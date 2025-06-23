// /pages/index.js
// This file creates the main public-facing page of your application.
// It uses the standard Next.js format, exporting a React component.

export default function HomePage() {
  // We are embedding the HTML, CSS, and JavaScript directly into the component's return value.
  // This is a valid approach for self-contained pages in Next.js.
  // Using `dangerouslySetInnerHTML` is necessary to inject the raw HTML string.

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="google-site-verification" content="9nIGVddu71rZpnGObGxPbIRU_a9iKu60G3inKCbAWnE" />
      <title>📞 BD Number Lookup - Free Operator, Name & Location Info</title>
      <meta name="description" content="A fast, free, and open-source tool to look up information about any Bangladeshi mobile number. Find the operator, location, and registered name instantly with our public API.">
      
      <meta name="keywords" content="BD number lookup, bangladesh phone number check, mobile number operator, sim details bangladesh, number locator bd, grameenphone number check, robi number check, banglalink number check, teletalk number check, airtel number check bd, 017 which operator, 018 operator, 019 operator, 013 operator, 014 operator, 015 operator, 016 operator, bangladesh mobile number details, find sim information bangladesh, check sim ownership bd, mobile number tracker bangladesh online, free number lookup bd, how to find sim details in bangladesh, phone number search bangladesh, gp sim details, robi sim details, banglalink sim details, check mobile operator bd, find number location bangladesh, sim registration check bd, phone number owner name search bangladesh, nid server number check, mobile number database bangladesh, bangladesh phone directory, bd phone number finder, cellular number info bd, sim card details checker, bangladesh mobile number prefix">
      <meta name="author" content="GAJARBOTOL">

      <link rel="icon" href="https://emoji.gg/assets/emoji/9095-phone.png" />

      <meta property="og:type" content="website">
      <meta property="og:url" content="https://YOUR_DOMAIN"> 
      <meta property="og:title" content="📞 BD Number Lookup - Free Operator, Name & Location Info">
      <meta property="og:description" content="Instantly find details for any Bangladeshi mobile number with our free lookup tool and public API.">
      <meta property="og:image" content="https://raw.githubusercontent.com/Gajarbot/bd-num-lookup/main/public/og-image.png">

      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:url" content="https://YOUR_DOMAIN">
      <meta property="twitter:title" content="📞 BD Number Lookup - Free Operator, Name & Location Info">
      <meta property="twitter:description" content="Instantly find details for any Bangladeshi mobile number with our free lookup tool and public API.">
      <meta property="twitter:image" content="https://raw.githubusercontent.com/Gajarbot/bd-num-lookup/main/public/og-image.png">

      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism-tomorrow.min.css');

        :root {
            --background-start: #0d1117; --background-end: #010409; --primary-blue: #58a6ff;
            --primary-green: #238636; --border-color: rgba(88, 166, 255, 0.2);
            --card-bg: rgba(22, 27, 34, 0.75); --text-primary: #c9d1d9;
            --text-secondary: #8b949e; --text-error: #f85149;
        }

        body {
          background: linear-gradient(-45deg, var(--background-start), #161b22, var(--background-end));
          background-size: 400% 400%; animation: gradientBG 15s ease infinite;
          color: var(--text-primary); font-family: 'Poppins', 'Segoe UI', sans-serif;
          display: flex; justify-content: center; align-items: flex-start;
          min-height: 100vh; margin: 0; padding: 40px 20px;
        }

        @keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .container { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; max-width: 500px; }
        .main-content { width: 100%; }

        h1 {
          font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 600; color: var(--primary-blue);
          margin-bottom: 25px; animation: pulse 2s infinite; text-shadow: 0 0 10px rgba(88, 166, 255, 0.3);
        }

        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }

        .input-group { display: flex; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2); border-radius: 10px; margin-bottom: 25px; }

        input[type="tel"] {
          font-size: 16px; border-radius: 8px 0 0 8px; border: 1px solid var(--border-color);
          outline: none; transition: all 0.3s ease; width: 100%; background: var(--card-bg);
          backdrop-filter: blur(10px); color: var(--text-primary); padding: 15px 22px; border-right: none;
        }
        input[type="tel"]:focus { border-color: var(--primary-blue); box-shadow: 0 0 12px rgba(88, 166, 255, 0.6); }
        
        button, .action-btn {
          padding: 15px 25px; font-size: 16px; border: 1px solid var(--border-color); outline: none;
          transition: all 0.3s ease; cursor: pointer; font-weight: 600; display: inline-flex;
          align-items: center; justify-content: center; gap: 8px; text-decoration: none; position: relative;
        }
        button:hover, .action-btn:hover { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }

        #lookupBtn {
            border-radius: 0 8px 8px 0; background: var(--primary-green); color: #fff;
            border-color: var(--primary-green); animation: breathe 3s infinite;
        }
        #lookupBtn:hover { background: #2ea043; animation-play-state: paused; }
        @keyframes breathe { 0% { box-shadow: 0 0 5px #238636; } 50% { box-shadow: 0 0 20px #2ea043; } 100% { box-shadow: 0 0 5px #238636; } }

        .button-container { margin-top: 25px; display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }

        .action-btn {
            border-radius: 8px; display: none; /* JS will change this */
            animation: slideInUp 0.5s ease-out forwards;
        }
        @keyframes slideInUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        #downloadBtn { background: #1f6feb; color: #fff; border-color: #1f6feb;}
        #whatsappBtn { background: #25D366; color: #fff; border-color: #25D366;}
        #telegramBtn { background: #0088cc; color: #fff; border-color: #0088cc;}

        #result {
          background: var(--card-bg); backdrop-filter: blur(10px); border-radius: 10px;
          padding: 25px; margin-top: 20px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-color); width: 100%; overflow: hidden;
          display: none; text-align: left;
        }

        .fade-in { animation: fade 0.5s ease-in-out; }
        @keyframes fade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .loader {
            border: 4px solid #30363d; border-top: 4px solid var(--primary-blue);
            border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .line { margin-bottom: 12px; font-size: 1.1em; }
        .label { color: var(--text-secondary); font-weight: bold; }
        .value { color: var(--text-primary); margin-left: 8px; }
        .error-message { color: var(--text-error); display: block; text-align: center; }

        .developer-credit {
            text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid var(--border-color);
            font-size: 1.1em; color: var(--text-secondary);
        }
        .developer-credit a {
            font-weight: 600; background: linear-gradient(90deg, #ff8a00, #e52e71, #4c5fd7, #2de2e6);
            background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            animation: gradient-text 4s linear infinite; text-decoration: none;
        }
        @keyframes gradient-text { to { background-position: 200% center; } }
        
        .action-btn::before {
            content: attr(data-tooltip); position: absolute; bottom: 110%; left: 50%;
            transform: translateX(-50%); background-color: #010409; color: #fff;
            padding: 5px 10px; border-radius: 5px; font-size: 14px; white-space: nowrap;
            opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; z-index: 10;
        }
        .action-btn:hover::before { opacity: 1; visibility: visible; }

        /* API Docs Styling */
        .api-docs-container { width: 100%; max-width: 700px; margin: 40px auto; text-align: left; }
        #apiDocsWrapper {
            background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px;
            padding: 25px; backdrop-filter: blur(10px); display: none; margin-top: 20px;
        }
        #toggleDocsBtn {
            width: 100%; padding: 12px; font-size: 1em; background: var(--primary-blue);
            color: #010409; border: none; border-radius: 6px; cursor: pointer; transition: all 0.3s;
        }
        #toggleDocsBtn:hover { background: #79c0ff; transform: translateY(-2px); }
        .endpoint { display: flex; align-items: center; background: #010409; padding: 10px 15px; border-radius: 5px; margin: 15px 0; border: 1px solid var(--border-color); }
        .method { font-weight: bold; padding: 5px 10px; border-radius: 5px; color: white; margin-right: 15px; }
        .get { background: var(--primary-green); }
        .url { font-family: 'Menlo', 'Courier New', monospace; color: var(--text-primary); word-break: break-all; }
        .params { list-style: none; padding: 0; } .params li { margin-bottom: 10px; font-size: 0.95em; }
        .param-name { font-weight: bold; color: #58a6ff; }
        .param-type { font-style: italic; color: #a5d6ff; margin: 0 10px; }
        .required, .optional { padding: 2px 6px; border-radius: 3px; font-size: 0.8em; color: white; }
        .required { background: #da3633; } .optional { background: #30363d; }
        pre[class*="language-"] { padding: 1em; margin: .5em 0; overflow: auto; border-radius: 6px; background: #010409 !important; border: 1px solid var(--border-color); }

      </style>
    </head>
    <body>
      <div class="container">
        <div class="main-content">
            <h1>📞 BD Number Lookup</h1>
            <div class="input-group">
                <input id="number" type="tel" placeholder="01XXXXXXXXX" maxlength="11" onkeydown="if(event.key==='Enter') lookup();"/>
                <button id="lookupBtn" onclick="lookup()">🔍 Lookup</button>
            </div>
            
            <div id="result"></div>

            <div id="buttonContainer" class="button-container">
                <a id="whatsappBtn" class="action-btn" href="#" target="_blank" data-tooltip="Chat on WhatsApp">💬 WhatsApp</a>
                <a id="telegramBtn" class="action-btn" href="#" target="_blank" data-tooltip="Contact on Telegram">✈️ Telegram</a>
                <button id="downloadBtn" class="action-btn" onclick="downloadResult()" data-tooltip="Download as .txt">📥 Download</button>
            </div>
        </div>

        <div class="api-docs-container">
          <button id="toggleDocsBtn" onclick="toggleDocs()">Show API Documentation</button>
          <div id="apiDocsWrapper">
              <h2>Public API Documentation</h2>
              <p>You can use our free API to integrate number lookup into your own applications.</p>
              
              <div class="endpoint">
                  <span class="method get">GET</span>
                  <span class="url">/api/lookup</span>
              </div>

              <h4>Query Parameters</h4>
              <ul class="params">
                  <li><span class="param-name">number</span> <span class="param-type">string</span> <span class="required">Required</span> - The 11-digit Bangladeshi mobile number.</li>
                  <li><span class="param-name">raw</span> <span class="param-type">string</span> <span class="optional">Optional</span> - Set to "true" to get the full JSON response from the external provider.</li>
              </ul>

              <h4>Example: Javascript Fetch</h4>
              <pre><code class="language-js">
fetch('https://YOUR_DOMAIN/api/lookup?number=01700000000')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
              </code></pre>

              <h4>Success Response (200 OK)</h4>
              <pre><code class="language-json">
{
  "status": 200,
  "success": true,
  "name": "GAJARBOTOL",
  "number": "01700000000",
  "international_format": "+8801700000000",
  "carrier_code": "017",
  "carrier": "Grameenphone",
  "location": "Bangladesh",
  "type": "mobile",
  "timestamp": "2025-06-24T00:35:00.123Z",
  "developer": "GAJARBOTOL"
}
              </code></pre>
          </div>
      </div>

      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js"><\/script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/plugins/autoloader/prism-autoloader.min.js"><\/script>
      <script>
        let lastResultText = "";

        // Securely creates a line of text for the result div to prevent XSS
        function createLine(label, value) {
          const lineDiv = document.createElement('div');
          lineDiv.className = 'line';

          const labelSpan = document.createElement('span');
          labelSpan.className = 'label';
          labelSpan.textContent = label + ':';
          
          const valueSpan = document.createElement('span');
          valueSpan.className = 'value';
          valueSpan.textContent = value || 'N/A';
          
          lineDiv.appendChild(labelSpan);
          lineDiv.appendChild(valueSpan);
          return lineDiv;
        }

        async function lookup() {
          const num = document.getElementById("number").value.trim();
          const resultDiv = document.getElementById("result");
          const allActionButtons = document.querySelectorAll('.action-btn');

          resultDiv.style.display = "block";
          resultDiv.innerHTML = '<div class="loader" style="margin: auto;"></div>';
          resultDiv.classList.remove('fade-in');
          allActionButtons.forEach(btn => btn.style.display = "none");
          lastResultText = "";

          // Use a more specific regex for Bangladeshi numbers
          if (!/^01[3-9]\\d{8}$/.test(num)) {
            resultDiv.innerHTML = '<span class="error-message">❌ Invalid BD number format. Use 01XXXXXXXXX.</span>';
            return;
          }

          try {
            const res = await fetch('/api/lookup?number=' + num);
            const data = await res.json();
            
            resultDiv.classList.add('fade-in');

            if (data.success) {
              resultDiv.innerHTML = ''; // Clear loader
              
              resultDiv.appendChild(createLine("👤 Name", data.name));
              resultDiv.appendChild(createLine("📱 Number", data.international_format));
              resultDiv.appendChild(createLine("📡 Carrier", \`\${data.carrier} (\${data.carrier_code})\`));
              resultDiv.appendChild(createLine("📍 Location", data.location));
              resultDiv.appendChild(createLine("📞 Type", data.type));
              resultDiv.appendChild(createLine("⏰ Time", new Date(data.timestamp).toLocaleString()));

              const devCredit = document.createElement('div');
              devCredit.className = 'developer-credit';
              devCredit.innerHTML = \`Developed by <a href="#" onclick="event.preventDefault();" title="It's me!">\${data.developer}</a>\`;
              resultDiv.appendChild(devCredit);
              
              lastResultText = resultDiv.innerText;
              
              const telNumber = data.international_format.replace(/\\D/g, '');
              document.getElementById("whatsappBtn").href = \`https://wa.me/\${telNumber}\`;
              document.getElementById("telegramBtn").href = \`https://t.me/+\${telNumber}\`;
              allActionButtons.forEach(btn => btn.style.display = "inline-flex");

            } else {
              resultDiv.innerHTML = \`<span class="error-message">❌ \${data.message || 'An unknown error occurred.'}</span>\`;
              lastResultText = data.message;
            }
          } catch (e) {
            console.error("Lookup fetch error:", e);
            resultDiv.classList.add('fade-in');
            resultDiv.innerHTML = '<span class="error-message">❌ Network Error. Check your connection and try again.</span>';
          }
        }

        function downloadResult() {
          if (!lastResultText) {
            // Using a styled modal would be better, but alert is simple and effective.
            alert("Please look up a number first to get a result to download!");
            return;
          }
          const blob = new Blob([lastResultText], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = \`lookup-\${document.getElementById("number").value}.txt\`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }

        function toggleDocs() {
          const docsWrapper = document.getElementById('apiDocsWrapper');
          const btn = document.getElementById('toggleDocsBtn');
          if (docsWrapper.style.display === 'none') {
              docsWrapper.style.display = 'block';
              btn.textContent = 'Hide API Documentation';
          } else {
              docsWrapper.style.display = 'none';
              btn.textContent = 'Show API Documentation';
          }
        }
      <\/script>
    </body>
    </html>
  `;

  // This is how React/Next.js renders the raw HTML string.
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
