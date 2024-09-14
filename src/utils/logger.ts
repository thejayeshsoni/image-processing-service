import "winston-mongodb";
import { createLogger, format, transports } from "winston";
import {
  ConsoleTransportInstance,
  FileTransportInstance,
} from "winston/lib/winston/transports";
import util from "util";
import config from "../config/config";
import { EApplicationEnvironment } from "../constant/application";
import path from "path";
import * as sourceMapSupport from "source-map-support";
import { blue, green, magenta, red, yellow } from "colorette";
// import { MongoDBTransportInstance } from "winston-mongodb";

// Linking Trace Support
sourceMapSupport.install();

const colorizeLevel = (level: string) => {
  switch (level) {
    case "ERROR":
      return red(level);
    case "INFO":
      return blue(level);
    case "WARNING":
      return yellow(level);
    default:
      return level;
  }
};

const consoleLogFormat = format.printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { message, level, timestamp, meta = {} } = info;
  const customLevel = colorizeLevel(level.toUpperCase());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const customTimeStamp = green(timestamp as string);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const customMessage = message;
  const customMeta = util.inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true,
  });
  const customLog = `${customLevel} [${customTimeStamp}] ${customMessage}\n${magenta("META")} ${customMeta}\n`;
  return customLog;
});

const consoleTransport = (): Array<ConsoleTransportInstance> => {
  if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
    return [
      new transports.Console({
        level: "info",
        format: format.combine(format.timestamp(), consoleLogFormat),
      }),
    ];
  }
  return [];
};

const fileLogFormat = format.printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { message, level, timestamp, meta = {} } = info;

  const logMeta: Record<string, unknown> = {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  for (const [key, value] of Object.entries(meta)) {
    if (value instanceof Error) {
      logMeta[key] = {
        name: value.name,
        message: value.message,
        trace: value.stack ?? "",
      };
    } else {
      logMeta[key] = value;
    }
  }

  const logData = {
    level: level.toUpperCase(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    message,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    timestamp,
    meta: logMeta,
  };

  return JSON.stringify(logData, null, 4);
});

const fileTransport = (): Array<FileTransportInstance> => {
  return [
    new transports.File({
      filename: path.join(__dirname, "../", "../", "logs", `${config.ENV}.log`),
      level: "info",
      format: format.combine(format.timestamp(), fileLogFormat),
    }),
  ];
};

// const mongoDBTransport = (): Array<MongoDBTransportInstance> => {
//     return [
//         new transports.MongoDB({
//             level: 'info',
//             db: config.DATABASE_URL as string,
//             metaKey: 'meta',
//             expireAfterSeconds: 3600 * 24 * 30,
//             options: {
//                 useUnifiedTopology: true
//             },
//             collection: 'application-logs'
//         })
//     ];
// };

export default createLogger({
  defaultMeta: {
    meta: {},
  },
  transports: [
    ...fileTransport(),
    ...consoleTransport(),
    // ...mongoDBTransport(),
  ],
});
