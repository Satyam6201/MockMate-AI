import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "public");
    },
    filename: function (req, file, callback) {
        // Sanitize filename: replace spaces, use timestamp for uniqueness
        const safeName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filename = `${Date.now()}-${safeName}`;
        callback(null, filename);
    }
});

// Security fix: Only accept PDF files
const pdfFileFilter = (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (ext !== '.pdf' || mime !== 'application/pdf') {
        return callback(new Error('INVALID_FILE_TYPE: Only PDF files are allowed for resume upload.'), false);
    }
    callback(null, true);
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: pdfFileFilter,
});