import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const awsBucketName = process.env.AWS_BUCKET_NAME;
const awsRegionName = process.env.AWS_REGION_NAME;

export default async function uploadToS3(fileNameToSave, file) {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // store it in .env file to keep it safe
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: awsRegionName // this is the region that you select in AWS account
  });

  const uploadParams = {
    Bucket: awsBucketName,
    Key: fileNameToSave,
    Body: file
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    return `https://${awsBucketName}.s3.${awsRegionName}.amazonaws.com/${fileNameToSave}`;
  } catch (error) {
    throw error;
  }
}

