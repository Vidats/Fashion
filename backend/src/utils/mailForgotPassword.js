const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const SendMailForgotPassword = async (email, otp) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const info = await transport.sendMail({
            from: `"Moho" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            text: `Mã OTP để đặt lại mật khẩu của bạn là: ${otp}`,
            html: `
           <!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Reset cơ bản */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f6f9fc;
            color: #444;
        }

        .email-wrapper {
            width: 100%;
            background-color: #f6f9fc;
            padding: 40px 0;
        }

        .email-content {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        /* Thanh trang trí phía trên */
        .top-bar {
            height: 6px;
            background: linear-gradient(90deg, #6c5ce7, #a29bfe);
        }

        .header {
            padding: 40px 30px 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #2d3436;
            font-weight: 700;
        }

        .body-content {
            padding: 0 40px 40px;
            text-align: center;
            line-height: 1.6;
        }

        .body-content p {
            margin: 15px 0;
            font-size: 16px;
            color: #636e72;
        }

        /* Khu vực hiển thị mã OTP */
        .otp-container {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }

        .otp-code {
            font-size: 36px;
            font-weight: 800;
            color: #6c5ce7;
            letter-spacing: 10px;
            margin: 10px 0;
            display: inline-block;
        }

        .expiry-text {
            font-size: 13px;
            color: #b2bec3;
            font-style: italic;
        }

        .footer {
            padding: 25px;
            background-color: #fafafa;
            border-top: 1px solid #f0f0f0;
            text-align: center;
            font-size: 13px;
            color: #95a5a6;
        }

        .footer strong {
            color: #6c5ce7;
        }

        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
            .email-content {
                width: 90% !important;
            }
            .body-content {
                padding: 0 25px 30px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <div class="top-bar"></div>
            
            <div class="header">
                <h1>Xác thực tài khoản</h1>
            </div>

            <div class="body-content">
                <p>Chào bạn,</p>
                <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã xác thực dưới đây:</p>
                
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                    <div class="expiry-text">Mã có hiệu lực trong vòng 10 phút</div>
                </div>

                <p style="font-size: 14px;">Nếu bạn không thực hiện yêu cầu này, bạn có thể an tâm bỏ qua email này.</p>
            </div>

            <div class="footer">
                Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.<br>
                Trân trọng, <strong>Đội ngũ Vidas</strong>
            </div>
        </div>
    </div>
</body>
</html>
            `,
        });

        console.log('Forgot password email sent:', info.messageId);
    } catch (error) {
        console.log('Error sending forgot password email:', error);
    }
};

module.exports = SendMailForgotPassword;
