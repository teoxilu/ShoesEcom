const multer = require("multer");

// Cấu hình lưu trữ tệp tải lên
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thay đổi đường dẫn tới thư mục lưu trữ tệp tải lên theo nhu cầu của bạn
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Tạo đối tượng multer
const upload = multer({ storage: storage });

module.exports = upload;