import fetch from 'node-fetch';
import { AbortController } from 'abort-controller';
import pool from '../../lib/db'; // Import the shared database pool

// --- SECTION 1: UTILITY FUNCTIONS ---

const carrierMap = {
  "013": "Grameenphone", "017": "Grameenphone", "014": "Banglalink",
  "019": "Banglalink", "015": "Teletalk", "016": "Airtel",
  "018": "Robi", "096": "App/Virtual/Business Number"
};

function detectCarrier(code) {
  return carrierMap[code] || "Unknown Operator";
}

/**
 * Checks for the admin secret key in the request headers.
 * @param {import('next').NextApiRequest} req The request object.
 * @returns {boolean} True if authorized, false otherwise.
 */
function isAdminAuthorized(req) {
  const providedKey = req.headers['authorization']?.split(' ')[1]; // Expects "Bearer YOUR_KEY"
  return providedKey && providedKey === process.env.ADMIN_SECRET_KEY;
}

/**
 * Logs an API request to the database.
 * @param {object} logData The data to log.
 */
const logRequest = async (logData) => {
    const { number, statusCode, success, message, carrier, name, ip } = logData;
    const query = `
        INSERT INTO api_logs(requested_number, status_code, api_response_success, response_message, carrier, found_name, ip_address)
        VALUES($1, $2, $3, $4, $5, $6, $7)
    `;
    try {
        await pool.query(query, [number, statusCode, success, message, carrier, name, ip]);
    } catch (logError) {
        console.error("Failed to log API request:", logError);
    }
};


// --- SECTION 2: REQUEST HANDLER LOGIC ---

/**
 * Handles the public number lookup logic with full fetch implementation.
 */
async function handleLookup(req, res) {
    // 1. Check API status from the database
    try {
        const statusCheck = await pool.query('SELECT * FROM api_status WHERE id = 1;');
        const apiStatus = statusCheck.rows[0];

        if (apiStatus.is_maintenance || !apiStatus.is_active) {
            const message = apiStatus.is_maintenance ? apiStatus.maintenance_message : "The API is currently disabled.";
            const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            // Log the blocked request
            logRequest({ number: req.query.number || 'N/A', statusCode: 503, success: false, message: message, carrier: 'N/A', name: 'N/A', ip: userIp });
            return res.status(503).json({ status: 503, success: false, message, developer: "GAJARBOTOL", timestamp: new Date().toISOString() });
        }
    } catch (dbError) {
        console.error("Database connection error:", dbError);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error", developer: "GAJARBOTOL", timestamp: new Date().toISOString() });
    }

    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { number, raw = "false" } = req.query;

    if (!number || !/^01\d{9}$/.test(number)) {
        logRequest({ number: number || 'none', statusCode: 400, success: false, message: "Invalid or missing number", carrier: 'N/A', name: 'N/A', ip: userIp });
        return res.status(400).json({ status: 400, success: false, message: "Invalid or missing number. Use format: 01XXXXXXXXX", developer: "GAJARBOTOL", timestamp: new Date().toISOString() });
    }
    
    const prefix = number.substring(0, 3);
    const carrier = detectCarrier(prefix);
    const cli = "88" + number;
    const international_format = "+880" + number.substring(1);

    // --- FULL FETCH LOGIC STARTS HERE ---
    const apiUrl = `https://api.eyecon-app.com/app/getnames.jsp?cli=${cli}&lang=en&is_callerid=true&is_ic=true&cv=vc_562_vn_4.0.562_a&requestApi=okHttp&source=MenifaFragment`;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "accept": "application/json", "e-auth-v": "e1",
        "e-auth": "56341ce1-f3e5-41ab-8d15-7cfe5ee96b06", "e-auth-c": "39", "e-auth-k": "PgdtSBeR0MumR7fO",
        "accept-charset": "UTF-8", "content-type": "application/x-www-form-urlencoded; charset=utf-8",
        "Host": "api.eyecon-app.com", "Connection": "Keep-Alive", "Accept-Encoding": "gzip"
    };

    const MAX_RETRIES = 3;
    const INITIAL_RETRY_DELAY_MS = 1000;
    const REQUEST_TIMEOUT_MS = 15000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(apiUrl, { headers, signal: controller.signal });
            clearTimeout(timeoutId);

            const responseText = await response.text();

            if (!response.ok || responseText.trim().toLowerCase().startsWith('<html>')) {
                if (attempt === MAX_RETRIES) {
                    const message = `External API returned an error after ${MAX_RETRIES} attempts.`;
                    logRequest({ number, statusCode: response.status || 502, success: false, message, carrier, name: 'N/A', ip: userIp });
                    return res.status(response.status || 502).json({ status: response.status || 502, success: false, message, developer: "GAJARBOTOL", timestamp: new Date().toISOString() });
                }
                await new Promise(resolve => setTimeout(resolve, INITIAL_RETRY_DELAY_MS * attempt));
                continue;
            }

            let jsonData;
            try {
                jsonData = JSON.parse(responseText.replace(/%+$/, ""));
            } catch (parseError) {
                if (attempt === MAX_RETRIES) {
                    const message = `Failed to parse API response as JSON after ${MAX_RETRIES} attempts.`;
                    logRequest({ number, statusCode: 500, success: false, message, carrier, name: 'N/A', ip: userIp });
                    return res.status(500).json({ status: 500, success: false, message, developer: "GAJARBOTOL", timestamp: new Date().toISOString() });
                }
                await new Promise(resolve => setTimeout(resolve, INITIAL_RETRY_DELAY_MS * attempt));
                continue;
            }

            if (Array.isArray(jsonData) && jsonData.length > 0) {
                const data = jsonData[0];
                const result = {
                    status: 200, success: true, name: data.name || "Unknown", number, international_format,
                    carrier_code: prefix, carrier, location: "Bangladesh", type: data.type || "Unknown",
                    timestamp: new Date().toISOString(), developer: "GAJARBOTOL"
                };
                if (raw === "true") { result.raw_api_response = data; }

                logRequest({ number, statusCode: 200, success: true, message: "Success", carrier, name: data.name || "Unknown", ip: userIp });
                return res.status(200).json(result);
            } else {
                const message = "No data found for this number from the external API.";
                logRequest({ number, statusCode: 404, success: false, message, carrier, name: 'N/A', ip: userIp });
                return res.status(404).json({ status: 404, success: false, message, number, carrier, location: "Bangladesh", developer: "GAJARBOTOL", timestamp: new Date().toISOString() });
            }

        } catch (fetchError) {
            clearTimeout(timeoutId);
            let errorMessage = fetchError.message;
            if (fetchError.name === 'AbortError') {
                errorMessage = `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`;
            }

            if (attempt === MAX_RETRIES) {
                const finalMessage = `External API error after ${MAX_RETRIES} attempts. (Last error: ${errorMessage})`;
                logRequest({ number, statusCode: 504, success: false, message: finalMessage, carrier, name: 'N/A', ip: userIp });
                return res.status(504).json({ status: 504, success: false, message: finalMessage, developer: "GAJARBOTOL", timestamp: new Date().toISOString() });
            }
             await new Promise(resolve => setTimeout(resolve, INITIAL_RETRY_DELAY_MS * attempt));
        }
    }
    // --- FULL FETCH LOGIC ENDS HERE ---
}


/**
 * Handles fetching admin dashboard stats.
 */
async function handleAdminStats(req, res) {
    const totalRequests = await pool.query('SELECT COUNT(*) FROM api_logs;');
    const successfulRequests = await pool.query("SELECT COUNT(*) FROM api_logs WHERE api_response_success = true;");
    const apiStatus = await pool.query("SELECT * FROM api_status WHERE id = 1;");
    
    res.status(200).json({
        success: true,
        total: parseInt(totalRequests.rows[0].count, 10),
        successful: parseInt(successfulRequests.rows[0].count, 10),
        status: apiStatus.rows[0]
    });
}

/**
 * Handles fetching paginated admin logs.
 */
async function handleAdminLogs(req, res) {
    const page = parseInt(req.query.page || 1, 10);
    const limit = 15;
    const offset = (page - 1) * limit;

    const logs = await pool.query('SELECT * FROM api_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    const total = await pool.query('SELECT COUNT(*) FROM api_logs;');

    res.status(200).json({
        success: true,
        logs: logs.rows,
        pagination: {
            total: parseInt(total.rows[0].count, 10),
            page,
            limit
        }
    });
}

/**
 * Handles updating the API status (On/Off/Maintenance).
 */
async function handleAdminStatusUpdate(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
    const { is_active, is_maintenance, maintenance_message } = req.body;
    const query = `
      UPDATE api_status 
      SET is_active = $1, is_maintenance = $2, maintenance_message = $3
      WHERE id = 1
      RETURNING *;
    `;
    const updated = await pool.query(query, [is_active, is_maintenance, maintenance_message]);
    res.status(200).json({ success: true, newStatus: updated.rows[0] });
}


// --- SECTION 3: MAIN ROUTER ---

export default async function handler(req, res) {
    const { slug } = req.query;
    if (!slug || slug.length === 0) {
        return res.status(404).json({ success: false, message: 'API route not found' });
    }
    
    const mainPath = slug[0];
    const subPath = slug.slice(1).join('/');

    try {
        switch (mainPath) {
            case 'lookup':
                return await handleLookup(req, res);
            
            case 'admin':
                if (!isAdminAuthorized(req)) {
                    return res.status(401).json({ success: false, message: 'Unauthorized' });
                }
                switch (subPath) {
                    case 'stats':
                        return await handleAdminStats(req, res);
                    case 'logs':
                        return await handleAdminLogs(req, res);
                    case 'status':
                        return await handleAdminStatusUpdate(req, res);
                    default:
                        return res.status(404).json({ success: false, message: 'Admin API route not found' });
                }

            default:
                return res.status(404).json({ success: false, message: 'API route not found' });
        }
    } catch (error) {
        console.error(`Error processing API route: /api/${slug.join('/')}`, error);
        res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
    }
              }
