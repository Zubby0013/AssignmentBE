import { google } from "googleapis";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import env from "dotenv";

env.config();

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const GOOGLE_REFRESH = process.env.GOOGLE_REFRESH;

const oAuth = new google.auth.OAuth2(
    GOOGLE_ID,
    GOOGLE_SECRET,
    GOOGLE_REDIRECT_URL
  );

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESH });

export const sendEmail = async (user: any) => {
    try {
      const accessToken: any = (await oAuth.getAccessToken()).token;
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "codelabbest@gmail.com",
          clientSecret: GOOGLE_SECRET,
          clientId: GOOGLE_ID,
          refreshToken: GOOGLE_REFRESH,
          accessToken,
        },
      });
      const getFile = path.join(__dirname, "../views/index.ejs");
  
      const data = {
        token: user.token,
        email: user.email,
        // http://localhost:5174/account/verify
        // url: `${URL}/user-verify/${user._id}`,
        url: `${URL}/account/verify`,
      };
  
      const html = await ejs.renderFile(getFile, { data });
  
      const mailer = {
        from: "Zubby Fun👋🤚🤚 <codelabbest@gmail.com>",
        to: user.email,
        subject: "Account Opening",
        html,
      };
  
      await transporter.sendMail(mailer).then(() => {
        console.log("send");
      });
    } catch (error) {
      return error;
    }
  };