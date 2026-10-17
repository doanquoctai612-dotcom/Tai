import { validDate } from '../data/model.js';
const key = 'tai.todos.v1';
export function readTodos() {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.filter(x => typeof x.id === 'string' && typeof x.title === 'string' && validDate(x.date) && typeof x.done === 'boolean') : [];
  } catch { return []; }
}
export function saveTodos(items) { localStorage.setItem(key, JSON.stringify(items)); }
export function today() { return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
