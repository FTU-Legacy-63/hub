# Nguồn tài sản hình ảnh

Kiểm tra ngày 21/10/2026. Không dùng giao diện mô phỏng do AI tạo làm bằng chứng sản phẩm.

## Ảnh sản phẩm

`assets/products/g01.webp` đến `g10.webp` là cover 960×600. Mỗi nhóm có thêm `gXX-f2.webp` và `gXX-f3.webp` cho hai trạng thái tính năng. `products.json` giữ caption và nguồn tài liệu chi tiết.

| Nhóm | Cover | Hai ảnh bổ sung |
| --- | --- | --- |
| G01 | GAME RULEBOOK.md trong repo | Các đoạn tiếp theo của rulebook |
| G02 | Demo MEDIFIN công khai | README: How MEDIFIN Works |
| G03 | Demo Who Runs The World công khai | README: tính năng chính |
| G04 | Week5/feature-scope.md | Các đoạn scope tiếp theo, gồm nội dung chưa triển khai |
| G05 | Demo ARBIVERSE công khai | README: tính năng chính |
| G06 | Demo FreeFall 2.0 công khai | README: Product Direction |
| G07 | Demo CFA Quest, màn hình Arena sau khi bắt đầu | README: luồng Week 7 |
| G08 | README công khai | Các đoạn tiếp theo của README; không phải UI game |
| G09 | Demo Finfolio, kết quả phân tích danh mục giả định mặc định | README: Current product scope |
| G10 | README: problem statement | Các đoạn tiếp theo của README; không phải UI game |

Ảnh chụp bằng trình duyệt không đăng nhập, không nhập thông tin cá nhân. G09 chỉ chạy phân tích thị trường đọc dữ liệu, không lưu quyết định. Ảnh gốc 1280×800 được nén cơ học bằng cwebp thành WebP 960×600. Không sửa con số hoặc trạng thái sản phẩm. Các ảnh tài liệu không chứng minh tính năng đã chạy; caption giao diện nêu rõ giới hạn này.

## Chrome trang trí

`assets/chrome.webp`: hình starburst chrome và torus trong suốt được tạo bằng công cụ sinh ảnh, theo yêu cầu asset chrome của art director. Chỉ trang trí hero, không phải logo hay bằng chứng sản phẩm. Prompt mô tả kim loại bạc phản chiếu cobalt/navy/sky, bố cục thiên phải, không chữ, không watermark. Nén WebP rộng 1200px, 139.792 byte, dưới giới hạn 300KB.

`assets/og.webp`: ảnh chia sẻ chụp từ trang chủ showcase, không chứa dữ liệu cá nhân.

`assets/favicon.svg`: dấu nhận diện chữ số 63 bằng vector native; không dùng làm ảnh sản phẩm.

## Typography

IBM Plex Mono, gói `@fontsource/ibm-plex-mono` 5.3.0. Build chỉ copy WOFF2 Latin, Latin Extended và Vietnamese ở weight 300/400/500/600 cùng LICENSE. Không tải font từ Google Fonts ở runtime.
