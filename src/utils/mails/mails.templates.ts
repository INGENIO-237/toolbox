import MAIL_ACTIONS from "../constants/mail.actions";

const MAIL_TEMPLATES = {
  OTP: (otp: number | string) => {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${MAIL_ACTIONS.OTP_CODE}</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
        
            <div style="max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">One-Time Password (OTP) Verification</h2>
                <p>Hello,</p>
                <p>Your One-Time Password (OTP) for verification is:</p>
                <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
                <p>Please use this OTP to complete the verification process.</p>
                <p>If you did not request this OTP, please ignore this email.</p>
                <p>Thank you!</p>
            </div>
        
        </body>
        </html>
        `;
  },
};

export default MAIL_TEMPLATES;
