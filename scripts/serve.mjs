import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname,'..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = resolve(root,'.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep) || !types[extname(file)]) { res.writeHead(403).end(); return; }
    const content = await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]}); res.end(content);
  } catch { if (!res.headersSent) res.writeHead(404); res.end('Not found'); }
}).listen(5173,'127.0.0.1',()=>console.log('http://127.0.0.1:5173'));
