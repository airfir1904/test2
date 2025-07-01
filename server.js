const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4445;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


// Endpoint để tải lên biên lai
app.post('/upload', upload.single('proofFile'), (req, res) => {
  const db = JSON.parse(fs.readFileSync('db.json'));
  const newEntry = {
    id: Date.now().toString(),        // dùng ID tự sinh
    fullname: req.body.fullname,      // ✅ thêm dòng này để lưu họ tên
    phone: req.body.phone,
    email: req.body.email,
    amount: req.body.amount,
    transactionId: req.body.transactionId,
    proofFile: req.file.filename,
    createdAt: new Date().toISOString(),
    status: 'Chưa duyệt' // Trạng thái mặc định
  };

  db.push(newEntry);
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  res.json({ success: true, message: "Bạn đã gửi ảnh xác minh" });

});

// Endpoint để lấy dữ liệu giao dịch
app.get('/transactions', (req, res) => {
  const db = JSON.parse(fs.readFileSync('db.json'));
  const { filter } = req.query;

  // Sắp xếp dữ liệu theo ngày tạo
  if (filter === 'newest') {
    db.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (filter === 'oldest') {
    db.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  res.json(db);
});

// Cung cấp tệp tĩnh
app.use(express.static('.'));

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
