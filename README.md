# FTU Legacy K63 · Showcase

Trang giới thiệu 10 dự án G01–G10 của học phần NHA408E, Chương trình Tiên tiến Tài chính - Ngân hàng, Trường Đại học Ngoại thương. Giảng viên hướng dẫn: Phan Trần Trung Dũng.

**Website:** https://ftu-legacy-63.github.io/hub/

## Nội dung

- Trang chủ: giới thiệu lớp, tìm kiếm tiếng Việt có/không dấu, 7 bộ lọc và carousel sản phẩm.
- 10 trang chi tiết: đối tượng, tính năng, lợi ích, hành trình, thành viên và nguồn đối chiếu.
- Sáu link trải nghiệm được các nhóm công bố tại thời điểm kiểm tra 21/10/2026; nhóm chưa có link được dẫn tới hồ sơ, không tạo demo giả.
- Font IBM Plex Mono tự lưu trữ, có bộ ký tự tiếng Việt. Hỗ trợ màn hình nhỏ, bàn phím và giảm chuyển động.
- Góp ý hiện là **placeholder theo quyết định của ban điều phối**. Không có chức năng gửi hoặc lưu phản hồi cho đến khi kết nối Google Form thật.

## Chạy local

Yêu cầu Node.js 22+ và Python 3.

```sh
npm ci --ignore-scripts
npm run build
npm test
npm run dev
```

Mở http://127.0.0.1:8180/. Sau mỗi lần sửa source hoặc JSON, chạy lại `npm run build` và tải lại trình duyệt.

## Cập nhật sản phẩm

`products.json` là nguồn dữ liệu chung cho trang chủ và tất cả trang chi tiết. Mỗi nhóm giữ nguyên ID `g01`–`g10`, sửa nội dung và bổ sung nguồn công khai tương ứng. `demoUrl: null` nghĩa là chưa có bản trải nghiệm được công bố.

1. Kiểm tra tài liệu và demo thực tế của nhóm.
2. Sửa `products.json`; không thêm email, mã sinh viên hoặc thông tin liên hệ chưa được đồng ý.
3. Nếu thay ảnh, dùng ảnh giao diện thật hoặc tài liệu nguồn; caption phải phân biệt rõ hai loại này. Cập nhật [sổ tài sản](docs/ASSETS.md).
4. Người có GitHub CLI được cấp quyền đọc các repo có thể chạy `npm run research` để cập nhật metadata/SHA nguồn, rồi đối chiếu thủ công nội dung thay đổi. Lệnh này **không tự viết lại nội dung showcase**.
5. Chạy build/test, kiểm tra desktop và mobile trước khi push.

`site.config.json` chứa URL xuất bản và cấu hình biểu mẫu công khai, không chứa secret. Xem [hướng dẫn kết nối góp ý](docs/FEEDBACK_SETUP.md) khi có Google Form. Cần tự kiểm tra biểu mẫu bằng cửa sổ không đăng nhập trước khi bật, không chỉ dán link rồi coi là hoàn tất.

## Xuất bản

GitHub Pages dùng GitHub Actions, không dùng nhánh `gh-pages`. Workflow `.github/workflows/pages.yml` build, test và chỉ xuất bản thư mục `dist` khi có push vào `main`. Trong Settings → Pages, chọn source **GitHub Actions**.

Các URL `/san-pham/g01/` đến `/san-pham/g10/` có HTML riêng để mở trực tiếp, refresh và chia sẻ. Nội dung chi tiết được nạp từ JSON chung, cần JavaScript. Thư mục `research`, `setup`, source và dependency không nằm trong artifact website.

Sau khi workflow deploy thành công, chạy `npm run verify-live` để kiểm tra HTTP và SHA-256 của toàn bộ file công khai so với bản build local. Lệnh chỉ đọc, không tạo tài nguyên hoặc gửi góp ý; kiểm tra này không thay thế việc thử giao diện trong trình duyệt.

## Nguồn và giới hạn

- Thiết kế dựa trên handoff `TrangChu.dc.html`, `ChiTietSanPham.dc.html` và hướng dẫn art director của K63; tham khảo cấu trúc showcase [K62](https://ftu-legacy-62.github.io/hub/).
- Dữ liệu sản phẩm lấy từ repository chính thức [FTU-Legacy-63](https://github.com/FTU-Legacy-63). Mỗi trang ghi rõ đường dẫn nguồn và SHA snapshot; thông tin không tự cập nhật theo repo nhóm.
- Mô tả lợi ích là mục tiêu sử dụng của sản phẩm, không phải kết luận về hiệu quả trên người dùng thật.
- Ảnh giao diện chụp ở thời điểm kiểm tra có thể khác bản mới nhất. Link demo bên ngoài do từng nhóm vận hành.
- Không thu dữ liệu cá nhân, không có analytics bên thứ ba hay account system của showcase. Khi bật Google Form, dịch vụ Google có chính sách xử lý dữ liệu riêng.
- Kết quả kiểm tra và các giới hạn được ghi tại [docs/AUDIT.md](docs/AUDIT.md).

Nội dung và ảnh sản phẩm thuộc các nhóm tương ứng; repo này không cấp lại quyền sử dụng tài sản của bên thứ ba. Font IBM Plex Mono giữ giấy phép gốc trong artifact `assets/fonts/LICENSE.txt`.
