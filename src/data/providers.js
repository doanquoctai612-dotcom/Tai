import { validateSnapshot } from './model.js';
export async function loadSnapshot(config) {
  const url = config.source === 'mock' ? new URL('../../data/sample.json', import.meta.url) : config.endpoint;
  if (!['mock','http'].includes(config.source) || !url) throw new Error('Chưa cấu hình nguồn dữ liệu');
  const response = await fetch(url, { signal: AbortSignal.timeout(config.timeoutMs), cache: 'no-store' });
  if (!response.ok) throw new Error('Không tải được dữ liệu: HTTP ' + response.status);
  return validateSnapshot(await response.json());
}
