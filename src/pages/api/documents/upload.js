// pages/api/documents/upload.js
import { createRouter } from 'next-connect';
import multer from 'multer';
import { uploadToS3 } from '../../../lib/aws'; // Đảm bảo bạn đã cấu hình AWS S3
import prisma from '../../../lib/prisma'; // Đảm bảo bạn đã cấu hình Prisma

// Tắt body parser mặc định của Next.js để multer có thể xử lý
export const config = {
  api: {
    bodyParser: false,
  },
};

// Cấu hình multer để lưu trữ tạm thời trong bộ nhớ
const upload = multer({
  storage: multer.memoryStorage(),
});

// Tạo router với next-connect (phiên bản 1.0)
const router = createRouter();

// Sử dụng middleware multer để xử lý file upload
router.use(upload.single('file')); // 'file' là tên field trong form upload

// Định nghĩa phương thức POST
// Định nghĩa phương thức POST
router.post(async (req, res) => {
  try {
    if (!req.file) {
      console.log('Không nhận được file:', req.body);
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload file lên S3
    const fileUrl = await uploadToS3(req.file);

    // Lưu thông tin tài liệu vào cơ sở dữ liệu (dùng Prisma)
    const document = await prisma.document.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        fileUrl: fileUrl,
        // Chuyển userId từ string sang int:
        userId: parseInt(req.body.userId, 10),
      },
    });

    res.status(200).json({ message: 'File uploaded successfully', document });
  } catch (error) {
    console.error('Lỗi upload file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});


export default router.handler();
