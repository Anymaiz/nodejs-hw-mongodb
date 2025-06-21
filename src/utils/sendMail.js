import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { envVal } from './getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: envVal(SMTP.SMTP_HOST),
  port: Number(envVal(SMTP.SMTP_PORT)),
  auth: {
    user: envVal(SMTP.SMTP_USER),
    pass: envVal(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
