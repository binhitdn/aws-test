import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Cung cấp key từ environment variable
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Cung cấp secret key từ environment variable
  region: process.env.AWS_REGION, // Region của bạn
});

const s3 = new AWS.S3();

export const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Tên bucket S3 của bạn
    Key: `student-images/${file.name}`, // Đường dẫn trong bucket
    Body: file.buffer, // Nội dung file
    ContentType: file.mimetype, // Kiểu file
    ACL: 'public-read', // Quyền truy cập public
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // Trả về URL ảnh đã upload
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
