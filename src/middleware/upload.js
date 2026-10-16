import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { env } from '../config/env.js';
import { badRequest } from '../utils/httpError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, '..', '..', env.uploadDir);

// Ensure the uploads directory exists.
fs.mkdirSync(uploadsDir, { recursive: true });

// Whitelisted image types only — no executables, scripts, or SVG (XSS-prone).
const ALLOWED = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Fully randomized, non-user-controlled base name.
    const safe = `${Date.now()}-${crypto.randomBytes(12).toString('hex')}${ext}`;
    cb(null, safe);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ALLOWED[file.mimetype];
  if (!allowedExts || !allowedExts.includes(ext)) {
    cb(badRequest('Unsupported file type. Allowed: JPG, PNG, WEBP, GIF.'));
    return;
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxUploadBytes, files: 1 },
}).single('file');

// Known image magic numbers, used to reject files whose bytes don't match an image.
const SIGNATURES = [
  { ext: 'jpg', bytes: [0xff, 0xd8, 0xff] },
  { ext: 'png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: 'gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  // WEBP: "RIFF"...."WEBP"
  { ext: 'webp', bytes: [0x52, 0x49, 0x46, 0x46] },
];

/** Read the first bytes of a saved file and confirm it looks like a real image. */
export function hasValidImageSignature(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buf = Buffer.alloc(12);
    fs.readSync(fd, buf, 0, 12, 0);
    return SIGNATURES.some((sig) => sig.bytes.every((b, i) => buf[i] === b));
  } finally {
    fs.closeSync(fd);
  }
}

/** Wrap the multer middleware so its errors become clean JSON responses. */
export function uploadImageMiddleware(req, res, next) {
  uploadImage(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const mb = Math.round(env.maxUploadBytes / (1024 * 1024));
        return next(badRequest(`File too large. Maximum size is ${mb} MB.`));
      }
      return next(err.status ? err : badRequest(err.message || 'Upload failed'));
    }
    next();
  });
}
