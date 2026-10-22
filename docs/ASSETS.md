# Nguồn tài sản hình ảnh

Kiểm tra ngày 21/10/2026. Không dùng giao diện mô phỏng do AI tạo làm bằng chứng sản phẩm.

## Ảnh sản phẩm

`assets/products/g01.webp` đến `g10.webp` là cover 960×600. Mỗi nhóm có thêm `gXX-f2.webp` và `gXX-f3.webp` làm ảnh minh họa bổ sung. `products.json` giữ caption và nguồn tài liệu chi tiết. Trong attempt 2, chọn card tính năng để xem ảnh trong modal.

| Nhóm | Cover | Hai ảnh bổ sung |
| --- | --- | --- |
| G01 | GAME RULEBOOK.md trong repo | Các đoạn tiếp theo của rulebook |
| G02 | Demo MEDIFIN công khai | README: current MVP và case flow; phần tiếp theo của How MEDIFIN Works |
| G03 | Demo Who Runs The World công khai | README: tính năng chính |
| G04 | Week5/feature-scope.md | Các đoạn scope tiếp theo, gồm nội dung chưa triển khai |
| G05 | Demo ARBIVERSE công khai | README: tính năng chính |
| G06 | Demo FreeFall 2.0 công khai | README: Product Direction |
| G07 | Demo CFA Quest, màn hình Arena sau khi bắt đầu | README: luồng Week 7 |
| G08 | README công khai | Các đoạn tiếp theo của README; không phải UI game |
| G09 | Demo Finfolio, kết quả phân tích danh mục giả định mặc định | README: Current product scope |
| G10 | README: problem statement | Các đoạn tiếp theo của README; không phải UI game |

Ảnh chụp bằng trình duyệt không đăng nhập, không nhập thông tin cá nhân. G09 chỉ chạy phân tích thị trường đọc dữ liệu, không lưu quyết định. Ảnh gốc 1280×800 được nén cơ học bằng cwebp thành WebP 960×600. Không sửa con số hoặc trạng thái sản phẩm. Các ảnh tài liệu không chứng minh tính năng đã chạy; caption giao diện nêu rõ giới hạn này.

## Trang trí theo attempt 2 (22/10/2026)

Dùng nguyên 7 SVG và 20 icon SVG được cung cấp trong `ftu-legacy-k63-web1.zip`: `globe.svg`, `globe-lite.svg`, `globe-lite-tilt-right.svg`, `star.svg`, `ring-glass-top.svg`, `ring-glass-side.svg`, `ring-chrome-double.svg` và `assets/icons/`. Vị trí, kích thước, opacity và lớp hiển thị giữ theo HTML gốc. SHA-256 từng file nằm trong `ATTEMPT_2_SOURCE.json`. Không vẽ lại hoặc thay bằng concept sinh ảnh khác.

### Asset bản đầu được giữ làm lịch sử

`assets/chrome.webp`: asset sinh ảnh của bản đầu, 139.792 byte, **không được dùng trong giao diện attempt 2**. Giữ lại để đối chiếu lịch sử, không phải logo hay bằng chứng sản phẩm.

`assets/og.webp`: ảnh chia sẻ chụp từ trang chủ showcase, không chứa dữ liệu cá nhân.

`assets/favicon.svg`: dấu nhận diện chữ số 63 bằng vector native; không dùng làm ảnh sản phẩm.

## Typography

IBM Plex Mono, gói `@fontsource/ibm-plex-mono` 5.3.0. Build copy WOFF2 Latin, Latin Extended và Vietnamese ở weight 300/400/500/600 normal cùng 400 italic cho phần rationale, tổng 15 font-face và LICENSE. Không tải font từ Google Fonts ở runtime.
