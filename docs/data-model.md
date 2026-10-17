# Hợp đồng dữ liệu v1

Snapshot JSON: schemaVersion=1, currency="VND", timezone="Asia/Ho_Chi_Minh", daily là mảng DailyMetric. Xem data/sample.json để có payload hoàn chỉnh.

## Grain và trường
Một dòng cho mỗi ngày kinh doanh, toàn shop; date dạng YYYY-MM-DD và không trùng. Ngày thiếu là chưa có dữ liệu, không tự điền 0. Giao diện chỉ tổng hợp các ngày có dữ liệu trong khoảng chọn.

| Trường | Kiểu / ý nghĩa |
|---|---|
| date | Ngày theo Asia/Ho_Chi_Minh |
| gmv | Số VND; giá trị hàng hóa đơn đã thanh toán, loại đơn hủy, trước hoàn tiền, không gồm phí giao hàng |
| orders | Số nguyên đơn đã thanh toán, loại đơn hủy |
| sessions | Số nguyên phiên truy cập |
| adSpend | Số VND chi phí Ads |
| adRevenue | Số VND GMV quy thuộc Ads |
| impressions, clicks | Số nguyên lượt hiển thị, click Ads |
| affiliateRevenue | Số VND GMV quy thuộc Affiliate |
| affiliateOrders | Số nguyên đơn Affiliate |
| commission | Số VND hoa hồng Affiliate |

Tất cả trường số bắt buộc, hữu hạn, không âm. Không đổi ô trống thành 0 để che dữ liệu thiếu: provider phải báo lỗi hoặc bổ sung hợp đồng nullable ở phiên bản sau. Không trộn tiền tệ. Tập trường hiện tại chưa biểu diễn refund, lợi nhuận, người dùng duy nhất hoặc multi-shop.

## Công thức
- GMV, traffic, chi phí và các trường số gốc: cộng theo ngày.
- CR = tổng orders / tổng sessions.
- AOV = tổng gmv / tổng orders.
- ROAS = tổng adRevenue / tổng adSpend.
- CTR = tổng clicks / tổng impressions.
- CPC = tổng adSpend / tổng clicks.
- AOV Affiliate = tổng affiliateRevenue / tổng affiliateOrders.
- Mẫu số 0: null, UI hiển thị “—”, không coi là 0%.

Ads và Affiliate là số quy thuộc, có thể chồng lấn. Không cộng hai nguồn vào GMV tổng. Trước khi kết nối thật cần thống nhất cửa sổ quy thuộc, múi giờ, thời điểm chốt ngày, xử lý đơn hủy và hoàn tiền tại nguồn; tỷ lệ hiện tại là tỷ lệ theo kỳ, không phải cohort conversion.

## Todo
Todo = { id: string, date: YYYY-MM-DD, title: string, done: boolean }.
id tạo bằng crypto.randomUUID; tối đa 200 ký tự khi nhập. Ngày mặc định theo giờ Việt Nam. Kho dữ liệu hiện tại: localStorage key tai.todos.v1. Adapter đồng bộ tương lai nên dùng id ổn định và cơ chế kiểm soát xung đột.
