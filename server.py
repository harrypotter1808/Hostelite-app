import http.server
import socketserver
import json
import os
from datetime import datetime

PORT = 8080
DB_FILE = 'database.json'

# Ensure database exists
if not os.path.exists(DB_FILE):
    with open(DB_FILE, 'w') as f:
        json.dump({"visitors": [], "requests": []}, f)

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve database.json specifically for the admin panel logic (in a real app, this would be secured)
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            with open(DB_FILE, 'r') as f:
                self.wfile.write(f.read().encode())
        else:
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        current_db = {"visitors": [], "requests": []}
        if os.path.exists(DB_FILE):
            with open(DB_FILE, 'r') as f:
                try:
                    current_db = json.load(f)
                except:
                    pass

        if self.path == '/api/visit':
            entry = {
                "ip": self.client_address[0],
                "time": timestamp,
                "page": data.get('page', 'unknown'),
                "userAgent": self.headers.get('User-Agent')
            }
            current_db['visitors'].append(entry)
            print(f"[{timestamp}] New Visit: {data.get('page')}")

        elif self.path == '/api/roommate':
            entry = {
                "time": timestamp,
                "name": data.get('name'),
                "contact": data.get('contact'),
                "type": data.get('type'),
                "requirements": data.get('requirements')
            }
            current_db['requests'].append(entry)
            print(f"[{timestamp}] New Roommate Request: {data.get('name')}")

        with open(DB_FILE, 'w') as f:
            json.dump(current_db, f, indent=4)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "success"}).encode())

print(f"Starting Local Database Server at http://localhost:{PORT}")
print(f"Admin Dashboard: http://localhost:{PORT}/admin.html")
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    httpd.serve_forever()
