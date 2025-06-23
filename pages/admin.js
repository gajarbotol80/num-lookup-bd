// /pages/admin.js
// This file creates the secure admin panel at the /admin route.
// It is a self-contained page with all its own HTML, CSS, and interactive JavaScript.

export default function AdminPage() {
    const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Admin Panel - BD Number Lookup</title>
      <meta name="robots" content="noindex, nofollow"> <!-- Prevent search engines from indexing the admin page -->
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        :root {
            --background-start: #0d1117; --background-end: #010409; --primary-blue: #58a6ff;
            --primary-green: #238636; --primary-yellow: #e3b341; --primary-red: #da3633;
            --border-color: rgba(88, 166, 255, 0.2); --card-bg: rgba(22, 27, 34, 0.75);
            --text-primary: #c9d1d9; --text-secondary: #8b949e;
        }
        body {
          background: linear-gradient(-45deg, var(--background-start), #161b22, var(--background-end));
          background-size: 400% 400%; animation: gradientBG 15s ease infinite; color: var(--text-primary);
          font-family: 'Poppins', 'Segoe UI', sans-serif; margin: 0; padding: 20px;
        }
        @keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        .admin-container { max-width: 1000px; margin: 2rem auto; }
        .login-box, .dashboard { background: var(--card-bg); backdrop-filter: blur(10px); padding: 2rem; border-radius: 10px; border: 1px solid var(--border-color); }
        h1, h2 { color: var(--primary-blue); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #010409; padding: 1.5rem; border-radius: 8px; text-align: center; border: 1px solid var(--border-color); }
        .stat-card h3 { margin: 0 0 0.5rem 0; color: var(--text-secondary); font-size: 1em; text-transform: uppercase; }
        .stat-card p { font-size: 2.2rem; font-weight: bold; color: var(--primary-blue); margin: 0; }
        
        .controls { margin-top: 2rem; padding-top: 1rem; }
        .control-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .control-group { background: #0d1117; padding: 1.5rem; border-radius: 8px; }
        
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: .5rem; font-weight: bold; }
        .form-group input, .form-group textarea {
            width: 100%; box-sizing: border-box; background: #010409; border: 1px solid var(--border-color);
            border-radius: 6px; padding: 12px; color: var(--text-primary); font-size: 1em;
        }
        .form-group textarea { resize: vertical; }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--primary-blue); box-shadow: 0 0 8px rgba(88, 166, 255, 0.5); outline: none; }
        
        button {
            padding: 12px 20px; font-size: 16px; border: 1px solid var(--border-color); outline: none;
            transition: all 0.2s ease; cursor: pointer; font-weight: 600; border-radius: 6px; color: #fff;
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        button:disabled { cursor: not-allowed; opacity: 0.5; transform: none; box-shadow: none; }
        .btn-primary { background-color: var(--primary-blue); border-color: var(--primary-blue); color: #010409; }
        .btn-on { background-color: var(--primary-green); border-color: var(--primary-green); }
        .btn-off { background-color: var(--primary-red); border-color: var(--primary-red); }
        .btn-maint { background-color: var(--primary-yellow); border-color: var(--primary-yellow); color: #010409;}

        .logs { margin-top: 2rem; }
        .table-wrapper { overflow-x: auto; }
        .logs-table { width: 100%; border-collapse: collapse; }
        .logs-table th, .logs-table td { padding: 12px; border-bottom: 1px solid var(--border-color); text-align: left; white-space: nowrap; }
        .logs-table th { color: var(--primary-blue); }
        .status-dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; }
        .success { background-color: #2ea043; }
        .failure { background-color: #f85149; }
        
        .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1.5rem; }
        #logoutBtn { position: absolute; top: 20px; right: 20px; background: var(--primary-red); border-color: var(--primary-red); }
        .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: var(--primary-green); color: white; padding: 15px 25px; border-radius: 8px; z-index: 1000; opacity: 0; transition: opacity 0.5s, transform 0.5s; }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .toast.error { background-color: var(--primary-red); }
      </style>
    </head>
    <body>
      <div id="app" class="admin-container">
        <!-- Login View -->
        <div id="loginView" class="login-box">
          <h1>Admin Panel Login</h1>
          <p>Enter the administrator secret key to access the dashboard.</p>
          <div class="form-group">
            <label for="apiKey">Admin Secret Key</label>
            <input type="password" id="apiKey" placeholder="••••••••••••••••••••" onkeydown="if(event.key==='Enter') login()">
          </div>
          <button onclick="login()" class="btn-primary">Login</button>
        </div>

        <!-- Dashboard View (hidden by default) -->
        <div id="dashboardView" style="display:none;" class="dashboard">
          <button id="logoutBtn" onclick="logout()">Logout</button>
          <h1>Admin Dashboard</h1>
          
          <div id="stats" class="stats-grid"></div>

          <div class="controls">
            <h2>API Controls</h2>
            <div class="control-grid">
                <div class="control-group">
                    <label>Master API Switch</label>
                    <p id="apiStatusText" style="font-size: 0.9em; color: var(--text-secondary);"></p>
                    <button id="toggleApiBtn" onclick="toggleApi()"></button>
                </div>
                <div class="control-group">
                    <label>Maintenance Mode</label>
                    <p id="maintenanceStatusText" style="font-size: 0.9em; color: var(--text-secondary);"></p>
                    <button id="toggleMaintenanceBtn" onclick="toggleMaintenance()"></button>
                </div>
            </div>
            <div id="maintenanceMessageContainer" class="form-group" style="display:none; margin-top: 1.5rem;">
                <label for="maintenanceMessage">Maintenance Message</label>
                <textarea id="maintenanceMessage" rows="3"></textarea>
                <button onclick="saveApiStatus()" class="btn-primary" style="margin-top:10px;">Save Changes</button>
            </div>
          </div>
          
          <div class="logs">
            <h2>API Logs</h2>
            <div class="table-wrapper">
              <table class="logs-table">
                <thead><tr><th>Time</th><th>Number</th><th>Status</th><th>Result</th><th>IP Address</th></tr></thead>
                <tbody id="logsBody"></tbody>
              </table>
            </div>
            <div id="pagination" class="pagination"></div>
          </div>
        </div>
      </div>
      <div id="toast" class="toast"></div>

      <script>
        const API_BASE = '/api/admin';
        let currentPage = 1;
        let totalPages = 1;
        let currentApiStatus = {};

        function getAuthHeaders() {
            const key = localStorage.getItem('adminSecret');
            if (!key) return null;
            return { 'Authorization': \`Bearer \${key}\`, 'Content-Type': 'application/json' };
        }

        function login() {
            const key = document.getElementById('apiKey').value;
            if (!key) return showToast('Please enter a key.', 'error');
            localStorage.setItem('adminSecret', key);
            checkAuth();
        }

        function logout() {
            localStorage.removeItem('adminSecret');
            document.getElementById('loginView').style.display = 'block';
            document.getElementById('dashboardView').style.display = 'none';
        }
        
        async function checkAuth() {
            const headers = getAuthHeaders();
            if (!headers) {
                logout(); return;
            }
            try {
                const res = await fetch(\`\${API_BASE}/stats\`, { headers });
                if (res.ok) {
                    document.getElementById('loginView').style.display = 'none';
                    document.getElementById('dashboardView').style.display = 'block';
                    loadDashboard();
                } else {
                    localStorage.removeItem('adminSecret');
                    showToast('Authorization failed. The key is invalid.', 'error');
                }
            } catch (e) {
                showToast('Could not connect to the server.', 'error');
            }
        }

        async function loadDashboard() {
            const headers = getAuthHeaders();
            if(!headers) return;
            try {
                const [statsRes, logsRes] = await Promise.all([
                    fetch(\`\${API_BASE}/stats\`, { headers }),
                    fetch(\`\${API_BASE}/logs?page=\${currentPage}\`, { headers })
                ]);
                if (!statsRes.ok || !logsRes.ok) throw new Error('Failed to fetch dashboard data.');
                
                const statsData = await statsRes.json();
                const logsData = await logsRes.json();
                
                renderStats(statsData); renderLogs(logsData);
                renderPagination(logsData.pagination); updateControls(statsData.status);
                currentApiStatus = statsData.status;
            } catch (e) {
                console.error(e); showToast('Error loading dashboard data.', 'error');
            }
        }

        function renderStats(data) {
            const successRate = data.total > 0 ? ((data.successful / data.total) * 100).toFixed(1) : 0;
            document.getElementById('stats').innerHTML = \`
                <div class="stat-card"><h3>Total Requests</h3><p>\${data.total}</p></div>
                <div class="stat-card"><h3>Successful</h3><p>\${data.successful}</p></div>
                <div class="stat-card"><h3>Success Rate</h3><p>\${successRate}%</p></div>
                <div class="stat-card"><h3>API Status</h3><p>\${data.status.is_active ? "ON" : "OFF"}</p></div>
            \`;
        }
        
        function updateControls(status) {
            const apiBtn = document.getElementById('toggleApiBtn');
            const maintenanceBtn = document.getElementById('toggleMaintenanceBtn');
            const msgContainer = document.getElementById('maintenanceMessageContainer');
            
            apiBtn.textContent = status.is_active ? 'Turn API OFF' : 'Turn API ON';
            apiBtn.className = status.is_active ? 'btn-off' : 'btn-on';
            document.getElementById('apiStatusText').textContent = status.is_active ? 'API is live and accepting requests.' : 'API is offline.';

            maintenanceBtn.textContent = status.is_maintenance ? 'Disable Maintenance' : 'Enable Maintenance';
            maintenanceBtn.className = status.is_maintenance ? 'btn-on' : 'btn-maint';
            document.getElementById('maintenanceStatusText').textContent = status.is_maintenance ? 'API is in maintenance mode.' : 'API is operating normally.';

            msgContainer.style.display = status.is_maintenance ? 'block' : 'none';
            document.getElementById('maintenanceMessage').value = status.maintenance_message;
        }

        function renderLogs(data) {
            const logsBody = document.getElementById('logsBody');
            if(data.logs.length === 0) {
              logsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No logs found for this page.</td></tr>';
              return;
            }
            logsBody.innerHTML = data.logs.map(log => \`
                <tr>
                    <td>\${new Date(log.created_at).toLocaleString()}</td>
                    <td>\${log.requested_number}</td>
                    <td><span class="status-dot \${log.api_response_success ? 'success' : 'failure'}"></span> \${log.status_code}</td>
                    <td>\${log.response_message.substring(0, 50)}</td>
                    <td>\${log.ip_address || 'N/A'}</td>
                </tr>
            \`).join('');
        }

        function renderPagination(pagination) {
            const { total, page, limit } = pagination;
            totalPages = Math.ceil(total / limit);
            const paginationDiv = document.getElementById('pagination');
            if (totalPages <= 1) { paginationDiv.innerHTML = ''; return; }
            paginationDiv.innerHTML = \`
                <button onclick="changePage(\${page - 1})" \${page === 1 ? 'disabled' : ''}>&laquo; Prev</button>
                <span>Page \${page} of \${totalPages}</span>
                <button onclick="changePage(\${page + 1})" \${page >= totalPages ? 'disabled' : ''}>Next &raquo;</button>
            \`;
        }

        function changePage(page) {
            if (page < 1 || page > totalPages) return; currentPage = page; loadDashboard();
        }
        function toggleApi() { currentApiStatus.is_active = !currentApiStatus.is_active; saveApiStatus(); }
        function toggleMaintenance() { currentApiStatus.is_maintenance = !currentApiStatus.is_maintenance; saveApiStatus(); }

        async function saveApiStatus() {
            const headers = getAuthHeaders();
            if(!headers) return;
            currentApiStatus.maintenance_message = document.getElementById('maintenanceMessage').value;
            
            try {
                const res = await fetch(\`\${API_BASE}/status\`, {
                    method: 'POST', headers: headers, body: JSON.stringify(currentApiStatus)
                });
                if(!res.ok) throw new Error(await res.text());
                const data = await res.json();
                currentApiStatus = data.newStatus;
                updateControls(currentApiStatus);
                showToast('API status updated successfully!');
            } catch(e) {
                console.error(e); showToast('Error saving status.', 'error');
            }
        }
        
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast show ' + type;
            setTimeout(() => { toast.className = 'toast'; }, 3000);
        }

        // Initial check on page load
        checkAuth();
      <\/script>
    </body>
    </html>
    `;
    return <div dangerouslySetInnerHTML={{ __html: adminHtml }} />;
}
