from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import json
root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=set();self.links=[];self.assets=[];self.h1=0;self.meta={}
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:assert a['id'] not in self.ids,('duplicate id',a['id']);self.ids.add(a['id'])
  if tag=='a':self.links.append(a.get('href',''))
  if tag in ['script','link']:self.assets.append(a.get('src') or a.get('href',''))
  if tag=='h1':self.h1+=1
  if tag=='meta':self.meta[a.get('name','')]=a.get('content','')
pages={}
for f in (root/'dist').rglob('index.html'):
 p=Page();p.feed(f.read_text());assert p.h1==1,f;route='/'+str(f.parent.relative_to(root/'dist')).strip('.')
 route=route.rstrip('/')+'/';pages[route]=p
 assert p.meta.get('description');assert p.meta.get('robots')=='index,follow'
 for forbidden in ['3.36/4.00','+92 304','dradicic@','shah316@','registration number']:assert forbidden not in f.read_text(),(f,forbidden)
for route,p in pages.items():
 for link in p.links:
  u=urlparse(link)
  if not u.scheme and (link.startswith('/') or link.startswith('#')):
   path=u.path or route;assert path in pages or (root/'dist'/path.lstrip('/')).is_file(),(route,link)
   if u.fragment:assert u.fragment in pages[path].ids,(route,link)
 for asset in p.assets:
  if not urlparse(asset).scheme: assert (root/'dist'/asset.lstrip('/')).exists(),asset
D=json.loads((root/'content/site.json').read_text());P=json.loads((root/'content/projects.json').read_text())['projects'];C=json.loads((root/'content/certifications.json').read_text())
assert len({p['slug'] for p in P})==len(P)==42
assert len({c['name'] for c in C})==len(C)==20
assert all(not asset['public_approved'] for asset in D['downloads'].values())
assert not list((root/'dist').rglob('*.pdf'))
assert not (root/'dist/private').exists()
assert [round(r['employment_2024']-r['employment_2010'],3) for r in D['south_asia']]==[.333,3.203,4.852]
assert round(D['retail']['profit']/D['retail']['sales']*100,2)==11.62
assert len(pages)==20
assert len(list((root/'dist/work').glob('*/index.html')))==3
for item in P:
 if not item.get('visible_on_site'):
  assert not (root/'dist/work'/item['slug']).exists()
for f in (root/'dist').rglob('*.html'):
 assert 'Draft / Not Public' not in f.read_text()
 assert 'Under Verification' not in f.read_text()
print(f'PASS: {len(pages)} pages; all local links/fragments/assets; unique IDs; SEO; no PDF/private contact exposure; 42 project records; 20 nonduplicated training records; data calculations.')
