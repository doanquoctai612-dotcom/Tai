import { config } from './config.js';
import { loadSnapshot } from './data/providers.js';
import { calculate, metrics } from './modules/kpi.js';
import { readTodos, saveTodos, today } from './modules/todos.js';
import { routes } from './pages/routes.js';
const $ = id => document.getElementById(id);
let snapshot;
const node = (tag,text) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; return el; };
const format = (value,type) => value === null ? '—' : type === 'percent' ? new Intl.NumberFormat('vi-VN',{style:'percent',maximumFractionDigits:2}).format(value) : new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2,...(type === 'money' ? {style:'currency',currency:'VND'} : {})}).format(value) + (type === 'multiple' ? '×' : '');
for (const [id,page] of Object.entries(routes)) { const link = node('a',page.title); link.href = '#/' + id; $('nav').append(link); }
function render() {
  const id = location.hash.slice(2) || 'overview', page = routes[id];
  $('content').replaceChildren();
  for (const link of $('nav').children) { if (link.hash === '#/' + id) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); }
  if (!page) { $('title').textContent = 'Không tìm thấy trang'; return; }
  $('title').textContent = page.title;
  for (const input of [$('from'),$('to')]) input.disabled = id === 'todos';
  if (id === 'todos') return renderTodos();
  if (!snapshot) { $('content').append(node('p','Dữ liệu chưa sẵn sàng. Kiểm tra nguồn và tải lại trang.')); return; }
  if ($('from').value > $('to').value) { $('content').append(node('p','Ngày bắt đầu phải trước ngày kết thúc.')); return; }
  const rows = snapshot.daily.filter(r => r.date >= $('from').value && r.date <= $('to').value);
  if (!rows.length) { $('content').append(node('p','Không có dữ liệu trong kỳ đã chọn.')); return; }
  const totals = calculate(rows), cards = node('section'); cards.className = 'cards';
  for (const key of page.metrics) { const [label,type,definition] = metrics[key]; const card = node('article'); card.append(node('h3',label),node('strong',format(totals[key],type)),node('p',definition)); cards.append(card); }
  $('content').append(cards,node('p','—: không xác định khi mẫu số bằng 0. Ads và Affiliate có thể trùng quy thuộc; không cộng vào GMV tổng.'));
  const wrapper = node('div'); wrapper.className = 'table-wrap'; const table = node('table'), head = node('tr'); head.append(node('th','Ngày'));
  for (const key of page.metrics) head.append(node('th',metrics[key][0]));
  const thead = node('thead'); thead.append(head); table.append(thead); const body = node('tbody');
  for (const row of [...rows].sort((a,b)=>a.date.localeCompare(b.date))) { const tr = node('tr'); tr.append(node('td',row.date)); const values = calculate([row]); for (const key of page.metrics) tr.append(node('td',format(values[key],metrics[key][1]))); body.append(tr); }
  table.append(body); wrapper.append(table); $('content').append(wrapper);
}
function renderTodos() {
  $('content').append(node('p','Lưu trên trình duyệt này; chưa đồng bộ Google Sheets.'));
  const form = node('form'), date = node('input'), title = node('input'), add = node('button','Thêm việc');
  date.type = 'date'; date.value = today(); date.required = true; date.setAttribute('aria-label','Ngày công việc');
  title.required = true; title.maxLength = 200; title.placeholder = 'Việc cần làm'; title.setAttribute('aria-label','Tên công việc');
  form.append(date,title,add); $('content').append(form); const list = node('ul'); $('content').append(list);
  const persist = items => { try { saveTodos(items); draw(); } catch { alert('Không thể lưu. Kiểm tra dung lượng hoặc quyền lưu của trình duyệt.'); } };
  function draw() {
    list.replaceChildren();
    const items = readTodos().filter(x=>x.date === date.value);
    if (!items.length) list.append(node('li','Chưa có việc cho ngày này.'));
    for (const item of items) {
      const li = node('li'), label = node('label'), check = node('input'), remove = node('button','Xóa');
      check.type = 'checkbox'; check.checked = item.done;
      check.onchange = () => persist(readTodos().map(x=>x.id === item.id ? {...x,done:check.checked} : x));
      label.append(check,document.createTextNode(item.title)); remove.type = 'button'; remove.setAttribute('aria-label','Xóa ' + item.title);
      remove.onclick = () => persist(readTodos().filter(x=>x.id !== item.id)); li.append(label,remove); list.append(li);
    }
  }
  date.onchange = draw;
  form.onsubmit = event => { event.preventDefault(); const text = title.value.trim(); if (!text) return; persist([...readTodos(),{id:crypto.randomUUID(),date:date.value,title:text,done:false}]); title.value = ''; };
  draw();
}
window.addEventListener('hashchange',render);
$('from').onchange = render; $('to').onchange = render;
render();
try {
  snapshot = await loadSnapshot(config);
  const dates = snapshot.daily.map(r=>r.date).sort(); $('from').value = dates[0] || ''; $('to').value = dates.at(-1) || '';
  $('source').textContent = (config.source === 'mock' ? 'DEMO · Dữ liệu mẫu' : 'Nguồn HTTP') + ' · VND · Asia/Ho_Chi_Minh';
} catch (error) { $('source').textContent = 'Lỗi nguồn dữ liệu: ' + error.message; }
render();
