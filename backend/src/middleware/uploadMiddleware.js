const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/receipts');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `receipt_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter: accept only jpeg, png, webp
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file format '${file.mimetype}'. Only JPEG, PNG, and WebP images are allowed for receipts.`
      ),
      false
    );
  }
};

// Multer upload instance (5MB max)
const uploadReceipt = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes
  },
  fileFilter,
});

module.exports = uploadReceipt;
