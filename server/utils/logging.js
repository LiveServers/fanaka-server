import { createLogger, format } from 'winston';
import DailyLog from 'winston-daily-rotate-file';
import "dotenv/config";
import  _ from 'lodash';
import getTimeStamp from "./getTimestamp";

const {
  combine, timestamp, label, printf,
} = format;

const logStringBuilder = (meta, message, level) => {
  let logString = `${getTimeStamp()}|message=${message}|level=${level}`;

  if ('url' in meta) {
    logString = `${logString}|url=${meta.url}`;
    delete meta.url;
  }

  if ('request' in meta) {
    logString = `${logString}|request=${meta.request}`;
    delete meta.request;
  }

  if ('email' in meta) {
    logString = `${logString}|email=${meta.email}`;
    delete meta.email;
  }

  if ('technicalMessage' in meta) {
    logString = `${logString}|technicalMessage=${meta.technicalMessage}`;
    delete meta.technicalMessage;
  }

  const selectableErrors = ['customerMessage', 'customError', 'message', 'actualError', 'systemError'];
  const pipeSpecial = (errors) => {
    _.forOwn(errors, (value, key) => {
      if (typeof value === 'object') {
        pipeSpecial(value);
      } else if (selectableErrors.indexOf(key) >= 0) {
        logString = `${logString}|${key} =${value}`;
      }
    });
  };
  pipeSpecial(meta);

  logString = `${logString}|more=${JSON.stringify(meta)}\n`;

  return logString;
};

const timezoned = () => new Date().toLocaleString('en-US', {
  timeZone: 'Africa/Nairobi',
});

const logFormat = printf(({ level, message, ...meta }) => (`${logStringBuilder(meta, message, level)}`));
const logFilePath = process.env.LOG_PATH;

const logger = createLogger({
  transports: [
    new DailyLog({
      filename: logFilePath,
      datePattern: 'YYYY-MM-DD',
    }),
  ],
  format: combine(
    label({ label: 'Fanaka Server' }),
    timestamp({
      format: timezoned,
    }),
    logFormat,
  ),
});

export default logger;