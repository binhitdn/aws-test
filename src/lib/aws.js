import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Khởi tạo S3 client
const s3 = new S3Client({
  region: 'ap-southeast-1', // Thay thế bằng khu vực của bạn
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Hàm tải lên tệp lên S3
export const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Tên bucket S3 của bạn
    Key: `uploads/${Date.now()}-${file.originalname}`, // Đặt tên tệp theo cách bạn muốn
    Body: file.buffer, // Dữ liệu tệp
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${s3.config.region}.amazonaws.com/${params.Key}`;
  } catch (error) {
    throw new Error(`Lỗi khi tải lên S3: ${error.message}`);
  }
};
