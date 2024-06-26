import { S3Client } from "@aws-sdk/client-s3";

export const REGION = "us-east-1";

export const s3Client = new S3Client({ region: REGION });