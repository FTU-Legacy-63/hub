# Attempt 2: chuẩn thiết kế và các khác biệt có chủ đích

## Chuẩn áp dụng

Người dùng đã xác nhận `ftu-legacy-k63-web1.zip` là mẫu chính và gửi ảnh toàn trang thể hiện output mong đợi. Đây là bài port sát mẫu, không phải đề xuất concept mới. Định hướng: showcase học thuật cho người xem sản phẩm, bảo toàn hero lệch trái, nền globe/star/ring, typography mono, gradient và glass của mẫu. Dials mô tả mẫu: design variance 7, motion 2, density 4; không thêm animation hoặc hiệu ứng ngoài mẫu.

Mọi giá trị style trong hai template HTML, bộ token và các SVG gốc được giữ nguyên. SHA-256 của 30 file nguồn được khóa trong manifest và kiểm tra tự động. Không áp dụng các khuyến nghị thiết kế tổng quát để thay headline nhiều dòng, tiêu đề viết hoa, section numbering, bố cục split hay chuyển nền vốn được chỉ định rõ trong mẫu này. Không dùng Image-to-Code để sinh một thiết kế cạnh tranh với ảnh/HTML đã được người dùng chọn.

## Khác biệt bắt buộc

| Phần | Điều chỉnh | Lý do |
| --- | --- | --- |
| Sản phẩm | 10 nhóm thật thay 12 dữ liệu minh họa; phân loại/count theo dữ liệu thật | Không tạo nhóm hoặc demo không tồn tại |
| Ảnh card/hero chi tiết | Ảnh ứng dụng hoặc hồ sơ thật thay icon/ảnh mẫu; giữ khung, ratio, margin và radius | Có bằng chứng sản phẩm; phân biệt hồ sơ với UI đang chạy |
| Thông tin lớp | Điền giảng viên, chương trình và học phần đã biết; không suy đoán học hàm, khoa/bộ môn, học kỳ | Không công bố thông tin chưa xác nhận |
| Liên hệ | Link repo/tài liệu thay email minh họa | Không công khai email chưa được đồng ý |
| Góp ý | Giữ bố cục split và panel xem trước, nhưng vô hiệu hóa thao tác gửi; bỏ tên/email, thêm trạng thái chưa nhận/lưu | Người dùng đã chọn placeholder và không thu tên/email |
| Backend giả của mẫu | Không dùng handler console.log rồi hiện “đã gửi” | Không thể coi giao diện prototype là một đường gửi thật |
| Trang chi tiết | 3 tính năng có nguồn thay 4 ô minh họa; giữ style card của mẫu | Không bịa thêm tính năng thứ tư |
| Ảnh tính năng | Card mở modal ảnh có caption, đóng bằng nút/Escape | Giữ khả năng xem các minh họa đã có, không thêm gallery vào bố cục tĩnh |
| Journey/người dùng | Điền thông tin có trong dữ liệu, bỏ các tuổi, tuần, tần suất hoặc khảo sát mẫu chưa có bằng chứng | Không tạo dữ kiện nghiên cứu giả để lấp ô mẫu |
| Phông | Tự lưu trữ cùng font/weight, bổ sung italic thực | Không gọi Google Fonts tại runtime; giữ tiếng Việt và italic của mẫu |
| Accessibility | Thêm landmark/skip link, vùng bấm 44px, focus/modal/reduced-motion | Cải thiện thao tác mà không thay hệ thiết kế |
| Đường dẫn | Giữ `/san-pham/g01/`–`g10/`, hỗ trợ router `product.html?id=gXX` | Không phá link đã xuất bản |
| Rendering | Dựng HTML từ dữ liệu lúc build; JS chỉ bổ sung tương tác | Nội dung/SEO và link vẫn dùng được khi JS chưa tải |

## Góp ý trong tương lai

Hiện chưa có thao tác lưu/gửi, không có account system và không thu dữ liệu cá nhân. Khi có Google Form đã kiểm tra không yêu cầu đăng nhập, cấu hình trong `site.config.json` và build lại để thay preview bằng iframe thật. Chỉ xác nhận bên trong Form mới là xác nhận đã gửi. Không tự bật thu thập hoặc email chỉ vì mẫu có trường minh họa.

## Kiểm chứng

Chạy `npm run build && npm test`. Kiểm tra hình ảnh cạnh mẫu ở 1440px và 390px, sau đó kiểm tra các tương tác/URL trước khi xuất bản. Báo cáo độc lập cho lần này nằm ở `ATTEMPT_2_AUDIT.md`; không dùng điểm số của bản đầu làm bằng chứng cho bản mới.
