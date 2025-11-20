# Hướng dẫn thêm ảnh và nhạc vào website

## 📸 Thêm ảnh cưới

1. Chuẩn bị ảnh của bạn (khoảng 100 ảnh)
2. Đặt tên ảnh theo thứ tự: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, ... `photo100.jpg`
3. Copy tất cả ảnh vào thư mục: `public/images/wedding/`
4. Mở file `src/pages/Index.tsx` và cập nhật mảng `WEDDING_IMAGES`:

```typescript
const WEDDING_IMAGES = [
  "/images/wedding/photo1.jpg",
  "/images/wedding/photo2.jpg",
  "/images/wedding/photo3.jpg",
  "/images/wedding/photo4.jpg",
  // ... thêm tất cả các ảnh của bạn ở đây
  "/images/wedding/photo100.jpg",
];
```

## 🎵 Thêm nhạc nền

1. Chuẩn bị file nhạc của bạn (khoảng 10 bài, định dạng .mp3)
2. Đặt tên file: `song1.mp3`, `song2.mp3`, `song3.mp3`, ... `song10.mp3`
3. Copy tất cả file nhạc vào thư mục: `public/music/`
4. Mở file `src/pages/Index.tsx` và cập nhật mảng `MUSIC_PLAYLIST`:

```typescript
const MUSIC_PLAYLIST = [
  { title: "Tên bài hát 1", src: "/music/song1.mp3" },
  { title: "Tên bài hát 2", src: "/music/song2.mp3" },
  { title: "Tên bài hát 3", src: "/music/song3.mp3" },
  // ... thêm tất cả các bài nhạc của bạn ở đây
  { title: "Tên bài hát 10", src: "/music/song10.mp3" },
];
```

## ✨ Tính năng của website

- **Gallery**: Hiển thị ảnh dạng lưới, click vào ảnh để xem fullscreen
- **Slideshow**: Tự động chuyển ảnh sau 4 giây, có thể pause/play
- **Music Player**: Phát nhạc nền với điều khiển đầy đủ (play, pause, next, previous, volume)
- **Responsive**: Hiển thị đẹp trên mọi thiết bị (desktop, tablet, mobile)
- **Phím tắt trong slideshow**:
  - `←` / `→`: Chuyển ảnh trước/sau
  - `Space`: Pause/Play
  - `Esc`: Thoát slideshow

## 🎨 Tùy chỉnh màu sắc

Nếu bạn muốn thay đổi màu sắc của website, hãy chỉnh sửa file `src/index.css` phần CSS variables:
- `--wedding-rose`: Màu hồng chủ đạo
- `--wedding-gold`: Màu vàng gold
- `--wedding-cream`: Màu kem
- `--wedding-blush`: Màu nền nhẹ

## 📝 Ghi chú

- Định dạng ảnh khuyến nghị: `.jpg` hoặc `.png`
- Định dạng nhạc khuyến nghị: `.mp3`
- Kích thước ảnh nên tối ưu để tải nhanh (không quá 2-3MB/ảnh)
- Website sẽ tự động tối ưu hiển thị ảnh theo tỷ lệ
