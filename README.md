# Tai · E-commerce dashboard

Skeleton đa trang, JavaScript ES modules, không có thư viện ngoài. Dữ liệu DEMO, chưa kết nối tài khoản hoặc dữ liệu kinh doanh thật.

## Chạy
Cần Node.js 22 trở lên. Không cần npm install.

```sh
npm start
# mở http://127.0.0.1:5173
npm test
```

Có thể phục vụ thư mục bằng static hosting. Điều hướng hash hoạt động cả trên đường dẫn con; không cần rewrite URL. Chưa cấu hình hosting/deploy.

## Cấu trúc
```text
index.html                 Khung giao diện
src/
  app.js                   Điều hướng, bộ lọc ngày, render
  config.js                Chọn nguồn mock/http
  styles.css               Responsive layout
  pages/routes.js          Trang và danh sách KPI
  modules/kpi.js           Công thức dùng chung
  modules/todos.js         Todo cục bộ
  data/model.js            Kiểm tra hợp đồng dữ liệu
  data/providers.js        Load mock hoặc HTTP JSON
data/sample.json           Dữ liệu mẫu
docs/data-model.md         Grain, đơn vị, quy tắc KPI
docs/integrations.md       Google Sheets / Apps Script
scripts/serve.mjs          Máy chủ dev cục bộ
tests/kpi.test.js          Kiểm tra công thức và dữ liệu
```

## Trang
Tổng quan, GMV, Traffic, CR, AOV, Ads, Affiliate, Todo hằng ngày.
KPI có bộ lọc ngày chung và chi tiết theo ngày; CR/AOV/ROAS được tính lại từ tổng tử và mẫu, không lấy trung bình tỷ lệ từng ngày. Không có dữ liệu sẽ hiển thị trạng thái rỗng; mẫu số 0 hiển thị “—”.

Todo thêm, hoàn tất và xóa theo ngày; lưu localStorage trên trình duyệt, chưa đồng bộ hoặc phân quyền. Dữ liệu demo thuộc 15–16/10/2026, không phải ngày hiện tại.

## Mở rộng
- Thêm trang trong src/pages/routes.js, thêm định nghĩa/công thức trong modules/kpi.js.
- Thay provider theo [hợp đồng dữ liệu](docs/data-model.md) và [hướng dẫn tích hợp](docs/integrations.md).
- Bước tiếp: xác thực, backend/proxy riêng, đồng bộ todo, bảng nguồn chi tiết, phân quyền và CI.
- Không đưa khóa, token, thông tin khách hàng hoặc dữ liệu kinh doanh riêng tư vào repository công khai.
