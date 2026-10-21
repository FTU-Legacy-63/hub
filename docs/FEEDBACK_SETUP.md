# Bật nhận góp ý không yêu cầu tài khoản

Website chỉ nhận góp ý thật khi có Google Form đã xuất bản. Không dùng GitHub Issues cho người xem phổ thông. Không ghi API key, token hoặc link bảng phản hồi vào repo.

## Cách ngắn nhất cho người quản lý lớp

1. Mở https://script.google.com/home/start bằng tài khoản Google của lớp, tạo project trống.
2. Dán nội dung `setup/create-feedback-form.gs`, chọn hàm `createK63FeedbackForm` và Run. Kiểm tra mã rồi cấp quyền tạo Google Form. Script không gửi email, không truy cập Gmail và không thêm người xem vào Drive.
3. Trong Google Forms, mở form vừa tạo. Chọn Publish/Manage và bảo đảm người có link đều trả lời được. Nếu tài khoản trường áp chính sách bắt buộc đăng nhập, dùng tài khoản lớp không bị hạn chế đó hoặc báo lại ban điều phối; không hứa anonymous khi chưa thử.
4. Đảm bảo Collect email OFF, Limit to one response OFF, không câu hỏi upload file, không giới hạn trong trường, View results summary OFF. Cấu hình script không thay thế việc kiểm tra quyền truy cập ở Google.
5. Sao chép đối tượng `formUrl`, `embedUrl`, `productEntry` trong Execution log vào `feedback` của `site.config.json`. Không gửi link `/edit` hoặc link Google Sheets.
6. Mở ở cửa sổ ẩn danh, gửi một phản hồi kiểm thử ghi rõ `KIỂM THỬ - có thể xóa`. Kiểm tra nó có trong Responses. Kiểm tra chưa chấm sao không gửi được; sau khi gửi có xác nhận và nút gửi phản hồi khác.
7. Sau deploy, thử lại từ trang chủ và một trang sản phẩm; trang chi tiết cần điền sẵn đúng sản phẩm. Iframe tải xong không được xem là đã gửi thành công.

Chỉ quản trị viên được xem phản hồi. Không bật công khai kết quả. Người gửi vẫn tương tác với hạ tầng Google; “không thu tên/email” không có nghĩa Google không có log kỹ thuật. Đây là góp ý, không phải hệ thống bỏ phiếu bảo đảm mỗi người chỉ gửi một lần.

Tham chiếu: https://developers.google.com/apps-script/reference/forms/form và https://support.google.com/docs/answer/2839588.
