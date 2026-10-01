import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve('public');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        const safeName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filename = `${Date.now()}-${safeName}`;
        callback(null, filename);
    }
});

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
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: pdfFileFilter,
});