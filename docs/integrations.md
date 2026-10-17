# Google Sheets / Apps Script: đường mở rộng

Hiện tại chỉ đọc data/sample.json. Chưa tạo Google Sheet, Apps Script hoặc triển khai endpoint.

## Google Sheets
Tạo tab Daily với hàng tiêu đề giống các trường DailyMetric trong docs/data-model.md; mỗi ngày một dòng. Giữ date là chuỗi YYYY-MM-DD, số không có dấu phân cách hoặc ký hiệu tiền. Provider/proxy phía server dùng Sheets API lấy values, chuyển số và xác thực trước khi trả snapshot JSON v1.

Không đặt service account, OAuth token hay API key riêng trong src/config.js. Với Sheet riêng tư, dùng backend/proxy có xác thực; frontend gọi endpoint cùng origin. Không cần và không nên publish Sheet riêng tư ra web chỉ để dùng skeleton.

## Apps Script
Tạo Web App đọc tab Daily rồi trả JSON cùng hợp đồng; có thể triển khai doGet theo khung sau trong dự án Apps Script của bạn:

```js
function doGet() {
  // TODO: áp dụng kiểm soát truy cập trước khi triển khai.
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const values = SpreadsheetApp.openById(id).getSheetByName('Daily').getDataRange().getValues();
  const [headers, ...rows] = values;
  const daily = rows.filter(row => row.some(value => value !== '')).map(row =>
    Object.fromEntries(headers.map((name, i) => {
      if (name === 'date') {
        const date = row[i] instanceof Date
          ? Utilities.formatDate(row[i], 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')
          : String(row[i]);
        return [name, date];
      }
      if (row[i] === '' || !Number.isFinite(Number(row[i]))) throw new Error('Invalid cell: ' + name);
      return [name, Number(row[i])];
    }))
  );
  return ContentService.createTextOutput(JSON.stringify({
    schemaVersion: 1, currency: 'VND', timezone: 'Asia/Ho_Chi_Minh', daily
  })).setMimeType(ContentService.MimeType.JSON);
}
```

Đây là khung đọc dữ liệu, chưa phải endpoint production. Cần kiểm tra header, trùng ngày, quyền truy cập và cấu hình timezone tại nguồn. Không triển khai kiểu “anyone” cho dữ liệu kinh doanh riêng tư. Web App có thể redirect hoặc không đáp ứng CORS/auth của fetch trình duyệt; dùng proxy cùng origin khi cần và kiểm tra với deployment thực tế.

## Thay nguồn
Trong src/config.js đặt source: 'http' và endpoint: '/api/dashboard' (backend trả JSON v1). Giữ timeoutMs phù hợp. Provider báo rõ HTTP/schema/timeout error; không tự quay về demo khi nguồn thật lỗi.

Todo chưa đồng bộ. Khi bổ sung ghi Sheets, cần endpoint có xác thực, kiểm tra payload, idempotency, xử lý xung đột và tránh ghi trực tiếp từ frontend.
