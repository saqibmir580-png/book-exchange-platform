const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
const path = require("path");
const fs = require("fs");

// Create tmp/uploads directory if it doesn't exist
const tmpDir = path.join(process.cwd(), "tmp", "uploads");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// 1. For Images (Cloudinary)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "book-exchange/books",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 700, crop: "limit" }]
  }
});

// 2. For Excel Files (Temporary Local Storage)
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, `bulk-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Middlewares
const uploadImage = multer({ 
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadExcel = multer({ 
  storage: excelStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.xlsx', '.xls', '.csv'].includes(ext)) {
      return cb(new Error('Only Excel/CSV files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for Excel files
  }
});

module.exports = { uploadImage, uploadExcel };