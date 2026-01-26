import http.server
import socketserver
import os

PORT = 3000

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Get absolute path
        path = self.translate_path(self.path)
        
        # Check if it maps to a file or directory that exists
        if os.path.exists(path):
            # If directory, standard behavior (looks for index.html or lists dir)
            # If file, serves file
            super().do_GET()
        else:
            # If not found, fallback to /index.html for SPA routing
            print(f"Path '{self.path}' not found, falling back to /index.html")
            self.path = '/index.html'
            super().do_GET()

print(f"Starting server at http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
    httpd.serve_forever()
