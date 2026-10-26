# ORCA × CANHCUT — THE COSMIC CHART

Website tĩnh (HTML, CSS, JavaScript thuần), không máy chủ, không font/ảnh/script bên ngoài, không phân tích theo dõi. Toàn bộ nội dung luận giải nằm trong `data.js`.

**Hiện tại mọi phần luận giải chỉ là nội dung mẫu.** Chưa đọc lá số thật nào và không có ngày giờ sinh trong mã nguồn.

## Cấu trúc
```
index.html  style.css  script.js  data.js  README.md
assets/orca.svg  assets/penguin.svg
assets/orca-chart.jpg      <- BẠN tự thêm (không kèm sẵn)
assets/canhcut-chart.jpg   <- BẠN tự thêm (không kèm sẵn)
```
Khi chưa có ảnh, trang hiện khung "Chưa có ảnh lá số". Không dùng ảnh lá số bịa.

## Xem thử trên Windows
1. Giải nén vào thư mục, ví dụ `C:\orca-canhcut`, giữ nguyên thư mục `assets`.
2. Chép hai ảnh lá số vào `assets` với đúng tên ở trên (viết thường).
3. Bấm đúp `index.html`, hoặc mở PowerShell: `cd C:\orca-canhcut; python -m http.server 8000` rồi vào http://localhost:8000.

## Thay nội dung mẫu bằng luận giải thật
1. Gửi hai ảnh lá số (kèm ngày sinh, loại lịch, giờ sinh, múi giờ, nơi sinh nếu có) cho AI có khả năng đọc ảnh.
2. Yêu cầu chỉ chép những gì đọc rõ, đánh dấu sao hoặc chữ chưa chắc, không đoán.
3. Tự đối chiếu bản chép với ảnh.
4. Trong `data.js`, với mỗi mục điền `chartFacts`, `source`, rồi `interpretation`, `uncertainty`, `missing`. Chỉ đặt `status` là `"verified"` sau khi đã kiểm tra. Khi xong, đặt `astrologyData.site.isPlaceholder` thành `false`.
5. Bát Tự: không điền trụ, Nhật chủ hay dụng thần nếu chữ không rõ hoặc thiếu dữ liệu sinh. Không tự lấy giờ ngọ.
6. Chỉ viết phần tương hợp sau khi cả hai lá số đã xác minh; chỉ nêu xu hướng, không dự đoán.

## Đưa lên GitHub Pages (miễn phí)
1. Tạo tài khoản tại github.com, bấm **New repository**, đặt tên, ví dụ `cosmic-chart`.
2. **Public hay Private:** Public cho mọi người xem mã nguồn và ảnh lá số. Repo Private có thể không bật được Pages ở gói miễn phí, hãy kiểm tra trong Settings. Chỉ chọn Public nếu bạn thoải mái công khai.
3. Bấm **uploading an existing file**, kéo vào `index.html`, `style.css`, `script.js`, `data.js`, `README.md` và cả thư mục `assets`. Bấm Commit.
4. **Settings → Pages → Build and deployment**: Deploy from a branch, nhánh `main`, thư mục `/ (root)`, Save.
5. Chờ vài phút, tải lại Settings → Pages; địa chỉ website hiện ở đầu trang (thường `https://<tên>.github.io/<repo>/`). Đừng tự đoán địa chỉ.
6. Mở bằng điện thoại (nên dùng 4G) và làm theo danh sách kiểm tra bên dưới.
7. **Cập nhật:** sửa file trên GitHub (biểu tượng bút chì) hoặc tải đè file mới; có thể mất vài phút. Nhấn Ctrl + F5 nếu vẫn thấy bản cũ.

### Xử lý lỗi
- Trang không có định dạng: thiếu `style.css` hoặc không nằm ở thư mục gốc repo.
- Trang trống: thiếu `data.js` hoặc `script.js`; nhấn F12 xem tab Console.
- Không hiện ảnh lá số: sai tên file (phải là `orca-chart.jpg`, `canhcut-chart.jpg`) hoặc không nằm trong `assets/`.
- Lỗi 404: Pages chưa bật xong hoặc tên repo trong địa chỉ sai.

## Mã QR
Chỉ làm sau khi website chạy tốt ở địa chỉ cuối cùng: sao chép địa chỉ trong Settings → Pages, dán vào trang tạo QR tĩnh bạn tin tưởng, tải ảnh về, quét thử bằng hai điện thoại rồi mới in. Đổi tên tài khoản hoặc repo sẽ làm mã QR cũ vô dụng.

## Danh sách kiểm tra thủ công
Máy tính (Chrome, Edge, Firefox, Safari) và điện thoại (iOS Safari, Android Chrome):
- [ ] Màn hình đầu hiện hai linh vật; nút cuộn xuống phần lá số
- [ ] Không bị cuộn ngang ở chiều rộng 320 px
- [ ] Thiếu ảnh thì hiện khung thay thế, không hiện biểu tượng lỗi
- [ ] Ảnh mở được trong khung xem; nút Đóng và phím Esc hoạt động
- [ ] Mọi mục mở được bằng chạm hoặc bàn phím (Tab, Enter)
- [ ] Viền focus nhìn thấy được
- [ ] Bật giảm chuyển động thì hiệu ứng dừng
- [ ] Tab Network không có yêu cầu tới tên miền khác

## Danh sách kiểm tra riêng tư
- [ ] Không có ngày giờ sinh trong mã nếu bạn chưa chủ động thêm
- [ ] Đã chọn Public/Private có chủ ý; repo Public sẽ công khai cả ảnh lá số
- [ ] Không có khóa, token, mật khẩu
- [ ] Không có phân tích hay script bên thứ ba

## Hạn chế đã biết
- Chưa kèm ảnh lá số và luận giải thật.
- Chưa thử trên GitHub Pages thật hay thiết bị thật; chỉ mới kiểm tra cú pháp JavaScript và quét tham chiếu bên ngoài.
- Phóng to ảnh dùng cuộn và thu phóng của trình duyệt, không có cử chỉ tùy biến.
- Dùng font hệ thống nên kiểu chữ khác nhau đôi chút giữa các thiết bị.
- Tử Vi và Bát Tự là hệ thống truyền thống, không phải khoa học.
