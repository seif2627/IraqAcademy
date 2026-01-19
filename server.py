import http.server
import socketserver
import os
import sys

# Get port from command line argument or default to 8081
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Always serve index.html for the root path or if path is just the hash
        if self.path == '/' or self.path.startswith('/#'):
            self.path = '/index.html'
        # If the path doesn't exist but it's not a file (likely a client-side route), serve index.html
        elif not os.path.exists(os.path.join(DIRECTORY, self.path.lstrip('/'))):
            if '.' not in self.path.split('/')[-1]: # Not a file with extension
                self.path = '/index.html'
        
        return super().do_GET()

# Allow address reuse to avoid "Address already in use" errors on restart
socketserver.TCPServer.allow_reuse_address = True

# Listen on 0.0.0.0 to allow network access
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Serving IraqAcademy at http://0.0.0.0:{PORT}")
    print(f"Local Network Access: http://192.168.2.32:{PORT}")
    httpd.serve_forever()
