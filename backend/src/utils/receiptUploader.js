const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary if environment variables are provided
const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[SpendWise-Cloudinary] Cloudinary SDK configured successfully for receipt storage.');
}

/**
 * Upload receipt image to Cloudinary or fallback to local static storage
 * @param {Express.Multer.File} file
 * @param {import('express').Request} req
 * @returns {Promise<{ receiptUrl: string, receiptPublicId: string, storageProvider: 'cloudinary' | 'local' }>}
 */
const uploadReceiptImage = async (file, req) => {
  if (hasCloudinary) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'spendwise_receipts',
        resource_type: 'image',
      });

      // Remove temp local file after successful Cloudinary upload
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        // Ignore unlink error
      }

      return {
        receiptUrl: uploadResult.secure_url,
        receiptPublicId: uploadResult.public_id,
        storageProvider: 'cloudinary',
      };
    } catch (err) {
      console.error('[SpendWise-Cloudinary] Upload failed, falling back to local storage:', err.message);
    }
  }

  // Fallback to local server static storage
  // Construct URL accessible by devices on network
  const host = req.get('host') || `localhost:${process.env.PORT || 5000}`;
  const protocol = req.protocol || 'http';
  const receiptUrl = `${protocol}://${host}/uploads/receipts/${file.filename}`;

  return {
    receiptUrl,
    receiptPublicId: file.filename,
    storageProvider: 'local',
  };
};

/**
 * Delete receipt from storage provider
 * @param {string} publicId
 * @param {'cloudinary' | 'local'} [provider]
 */
const deleteReceiptImage = async (publicId) => {
  if (!publicId) return;

  if (hasCloudinary && !publicId.startsWith('receipt_')) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return;
    } catch (err) {
      console.warn('[SpendWise-Cloudinary] Destroy warning:', err.message);
    }
  }

  // If local file, remove from disk
  const localPath = path.join(__dirname, '../../uploads/receipts', publicId);
  if (fs.existsSync(localPath)) {
    try {
      fs.unlinkSync(localPath);
    } catch (e) {
      console.warn('[SpendWise-Storage] Local unlink warning:', e.message);
    }
  }
};

module.exports = {
  uploadReceiptImage,
  deleteReceiptImage,
};
