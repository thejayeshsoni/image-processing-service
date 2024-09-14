import mongoose, { Document, Schema } from "mongoose";

interface ImageProcessingStatus extends Document {
  requestId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  csvData: Array<{ serial: string; name: string; url: string }>;
}

const ImageProcessingStatusSchema: Schema = new Schema(
  {
    requestId: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: "Pending" },
    csvData: { type: Array, required: true },
  },
  { timestamps: true }
);

const ImageProcessingStatus = mongoose.model<ImageProcessingStatus>(
  "ImageProcessingStatus",
  ImageProcessingStatusSchema
);

export default ImageProcessingStatus;
