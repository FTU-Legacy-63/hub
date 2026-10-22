# Bật nhận góp ý không yêu cầu tài khoản

## Thao tác để kích hoạt ngay

1. Mở https://script.google.com/home/start và chọn **New project / Dự án mới** bằng tài khoản quản lý lớp.
2. Mở file Code.gs mặc định, thay nội dung bằng toàn bộ file setup/create-feedback-form.gs đính kèm trong chat, rồi bấm **Save**.
3. Ở thanh trên, chọn hàm **createK63FeedbackForm** rồi bấm **Run / Chạy**. Xem mã và cấp quyền tạo Google Forms/Google Sheets cho chính script này. Không gửi mật khẩu cho người triển khai.
4. Mở **Execution log / Nhật ký thực thi** và gửi lại đoạn JSON có ba trường **formUrl**, **embedUrl**, **productEntry**. Không gửi link chỉnh sửa form hoặc link Sheet phản hồi.
5. Trong Forms, kiểm tra Publish/Manage cho phép **Anyone with the link** và thử cửa sổ ẩn danh. Chính sách tài khoản trường có thể chặn người ngoài dù script đã tắt thu email.

Script tạo một form và một Google Sheet riêng tư. Chạy lại sẽ dùng lại các file đã tạo, không xóa dữ liệu. Script không gửi email, không gọi dịch vụ ngoài và không tự chia quyền xem bảng phản hồi. Chưa chạy script thì website chưa có nơi nhận góp ý thật.

## Tự điền sản phẩm theo trang

- Trang chủ: chưa chọn sản phẩm.
- Trang chi tiết G01–G10: iframe và link mở tab mới đều điền sẵn đúng giá trị **Gxx - Tên sản phẩm**.
- Mã entry được lấy từ đường dẫn điền sẵn thật của Google, không đoán theo ID câu hỏi.
- Google Forms cho phép đổi lựa chọn điền sẵn. Tự điền không phải khóa cứng hay chống giả mạo.
- Unit test kiểm tra URL của đủ 10 sản phẩm và mã tạo form bằng mô phỏng. Cần gửi thử và kiểm tra phản hồi thật trên Google sau khi chủ tài khoản chạy script; không được coi iframe tải xong là gửi thành công.

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
