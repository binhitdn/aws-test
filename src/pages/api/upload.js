import nextConnect from 'next-connect';
import multer from 'multer';
import { uploadToS3 } from '../../lib/aws'; // Hãy chắc chắn rằng bạn đã cấu hình AWS S3

const upload = multer({
  storage: multer.memoryStorage(),
});

const handler = nextConnect();
handler.use(upload.single('file')); // 'file' là tên field trong form upload

handler.post(async (req, res) => {
  try {
    if (!req.file) {
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
        userId: req.body.userId, // Giả sử đã có thông tin người dùng
      },
    });

    res.status(200).json({ message: 'File uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

export default handler;
