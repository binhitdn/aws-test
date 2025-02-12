// pages/api/documents/upload.js
import nextConnect from 'next-connect';
import multer from 'multer';
import { uploadToS3 } from '../../../lib/aws';
import { prisma } from '../../../lib/prisma';

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Upload file lên S3
    const fileUrl = await uploadToS3(req.file);
    
    // Lưu thông tin tài liệu vào DB với Prisma
    const document = await prisma.document.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        fileUrl: fileUrl,
        userId: parseInt(req.body.userId), // ép sang số, đảm bảo đúng kiểu
      },
    });
    
    return res.status(200).json({ message: 'File uploaded successfully', document });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser mặc định để multer hoạt động
  },
};

export default handler;
