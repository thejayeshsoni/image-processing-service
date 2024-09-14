import fs from "node:fs";
import { NextFunction, Request, Response } from "express";
import httpResponse from "../utils/httpResponse";
import responseMessage from "../constant/responseMessage";
import httpError from "../utils/httpError";
import quicker from "../utils/quicker";
import { v4 as uuidV4 } from "uuid";
import csvParser from "csv-parser";
import ImageProcessingStatus from "../model/imageProcessing.model";
import { compressImageJob } from "../services/imageProcessingService";

export default {
  self: (req: Request, res: Response, next: NextFunction) => {
    try {
      httpResponse(req, res, 200, responseMessage.SUCCESS, { id: "id" });
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
  health: (req: Request, res: Response, next: NextFunction) => {
    try {
      const healthData = {
        application: quicker.getApplicationHealth(),
        system: quicker.getSystemHealth(),
        timeStamp: Date.now().toLocaleString(),
      };
      httpResponse(req, res, 200, responseMessage.SUCCESS, healthData);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
  parseCSV: (req: Request, res: Response, next: NextFunction) => {
    try {
      const results: { serial: any; name: any; urls: any }[] = [];
      const errors: string[] = [];
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (row) => {
          if (row.serial && row.name && row.urls) {
            results.push({
              serial: row.serial,
              name: row.name,
              urls: row.urls.split(","),
            });
          } else {
            errors.push(`Invalid row: ${JSON.stringify(row)}`);
          }
        })
        .on("end", () => {
          if (errors.length > 0) {
            return res
              .status(400)
              .json({ sucess: false, message: "Invalid CSV Format", errors });
          }
          req.body.csvData = results;
          next();
        });
    } catch (error) {
      return res.status(500).json({ sucess: false, message: error.message });
    }
  },
  handleCSV: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = uuidV4();
      const { csvData } = req.body;

      // Save initial status to MongoDB
      const processingRecord = new ImageProcessingStatus({
        requestId,
        status: "Pending",
        csvData,
      });
      await processingRecord.save();

      res.status(200).json({
        success: true,
        message: "Please wait, Images are being compressed..!!",
        data: { requestId },
      });
      compressImageJob(csvData, requestId);
    } catch (error) {
      return res.status(500).json({ sucess: false, message: error.message });
    }
  },
  checkStatus: async (req: Request, res: Response) => {
    const requestId = req.params.id;
    try {
      const processingRecord = await ImageProcessingStatus.findOne({
        requestId,
      });

      if (!processingRecord) {
        return res.status(404).json({ message: "Request ID not found" });
      }

      res.status(200).json({ sucess: true, data: processingRecord });
    } catch (error) {
      res.status(500).json({ message: "Error checking status", error });
    }
  },

  updateProcessingStatus: async (requestId: string, data: object) => {
    await ImageProcessingStatus.updateOne(
      { requestId },
      {
        $set: {
          status: data["status"],
          csvData: data["csvData"],
        },
      }
    );
  },
};
