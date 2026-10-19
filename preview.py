"""Private local preview. Optional Basic authentication, never a public deployment."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import argparse,base64,getpass,hmac,os
ROOT=Path(__file__).parent/'dist'
p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=4175);p.add_argument('--host',default='127.0.0.1');p.add_argument('--auth',action='store_true');a=p.parse_args()
if a.host not in ['127.0.0.1','localhost','::1'] and not a.auth:p.error('Non-loopback preview requires --auth and an HTTPS tunnel/reverse proxy. No public deployment is authorised.')
password=os.environ.get('PORTFOLIO_PREVIEW_PASSWORD') or (getpass.getpass('Private preview password: ') if a.auth else '')
if a.auth and len(password)<12:p.error('Use a preview password of at least 12 characters.')
expected='Basic '+base64.b64encode(('reviewer:'+password).encode()).decode()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def do_GET(self):
  if not self.authorised():return
  super().do_GET()
 def do_HEAD(self):
  if not self.authorised():return
  super().do_HEAD()
 def authorised(self):
  if a.auth and not hmac.compare_digest(self.headers.get('Authorization',''),expected):
   self.send_response(401);self.send_header('WWW-Authenticate','Basic realm="Private portfolio review"');self.end_headers();return False
  return True
 def list_directory(self,path):self.send_error(403,'Directory listings disabled')
 def end_headers(self):
  self.send_header('X-Robots-Tag','noindex, nofollow');self.send_header('X-Content-Type-Options','nosniff');self.send_header('Referrer-Policy','no-referrer');self.send_header('Cache-Control','no-store')
  self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; form-action 'none'; base-uri 'self'")
  super().end_headers()
 def log_message(self,*args):pass
server=ThreadingHTTPServer((a.host,a.port),Handler)
print(f'Private local preview: http://{a.host}:{a.port}'+(' (username: reviewer; password protected)' if a.auth else ' (loopback only)'),flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
