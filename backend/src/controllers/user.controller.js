const { ConflictRequestError, NotFoundError, AuthFailureError, BadRequestError } = require('../core/error.response');
const SendMailForgotPassword = require('../utils/mailForgotPassword');

const { Created, OK } = require('../core/success.response');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const otpModel = require('../models/otp.model');
const jwt = require('jsonwebtoken');

const { createAccessToken, createRefreshToken } = require('../auth/checkAuth');

/**
 * GIỮ function setCookie trong controller
 * Tự động bật secure khi production
 */
function setCookie(res, accessToken, refreshToken) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction, // local = false, prod = true
        maxAge: 1 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
    });

    // cookie để frontend biết user đã login
    res.cookie('logged', 1, {
        httpOnly: false,
        secure: isProduction,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
    });
}

class UserController {
    // ================= REGISTER =================
    async register(req, res, next) {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName || !email || !password) {
                throw new BadRequestError('Thiếu thông tin đăng ký');
            }

            const findUser = await UserModel.findOne({ email });
            if (findUser) {
                throw new ConflictRequestError('Email đã tồn tại');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await UserModel.create({
                fullName,
                email,
                password: hashedPassword,
            });

            const accessToken = createAccessToken({ id: newUser._id });
            const refreshToken = createRefreshToken({ id: newUser._id });

            setCookie(res, accessToken, refreshToken);

            return new Created({
                message: 'Đăng ký thành công',
                metadata: {
                    user: newUser,
                    accessToken,
                    refreshToken,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    // ================= LOGIN =================
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new BadRequestError('Thiếu email hoặc mật khẩu');
            }

            const findUser = await UserModel.findOne({ email });
            if (!findUser) {
                throw new NotFoundError('Tài khoản hoặc mật khẩu không chính xác');
            }

            const isMatchPassword = await bcrypt.compare(password, findUser.password);

            if (!isMatchPassword) {
                throw new AuthFailureError('Tài khoản hoặc mật khẩu không chính xác');
            }

            const accessToken = createAccessToken({ id: findUser._id });
            const refreshToken = createRefreshToken({ id: findUser._id });

            setCookie(res, accessToken, refreshToken);

            return new OK({
                message: 'Đăng nhập thành công',
                metadata: {
                    user: findUser,
                    accessToken,
                    refreshToken,
                },
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
    async authUser(req, res, next) {
        // Thêm next
        try {
            const userId = req.user; // Đã được middleware authUser gán vào
            if (!userId) {
                throw new AuthFailureError('Vui lòng đăng nhập lại');
            }

            // Sửa userModel thành UserModel (cho khớp với khai báo ở đầu file)
            const findUser = await UserModel.findById(userId);

            if (!findUser) {
                throw new NotFoundError('Người dùng không tồn tại');
            }

            return new OK({
                message: 'Xác thực thành công',
                metadata: findUser,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res) {
        const userId = req.user;
        const findUser = await UserModel.findById(userId);
        if (!findUser) {
            throw new NotFoundError('Người dùng không tồn tại');
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('logged');
        return new OK({
            message: 'Đăng xuất thành công',
            metadata: findUser,
        }).send(res);
    }
    async forgotPassword(req, res) {
        const { email } = req.body;
        const findUser = await UserModel.findOne({ email });
        if (!findUser) {
            throw new NotFoundError('Email không tồn tại');
        }

        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const tokenForgotPassword = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '5m',
        });

        res.cookie('tokenForgotPassword', tokenForgotPassword, {
            httpOnly: false,
            secure: true,
            maxAge: 5 * 60 * 1000, // 5 minutes
            sameSite: 'strict',
        });

        await otpModel.create({
            otp,
            email,
        });

        await SendMailForgotPassword(email, otp);

        return new OK({
            message: 'Mã OTP đã được gửi đến email của bạn',
            metadata: true,
        }).send(res);
    }
    async verifyForgotPassword(req, res, next) {
        // Thêm next vào đây
        try {
            // Kiểm tra xem req.body có tồn tại không trước khi bóc tách
            if (!req.body) {
                throw new BadRequestError('Dữ liệu yêu cầu không hợp lệ!');
            }

            const { otp, password } = req.body;
            const tokenForgotPassword = req.cookies.tokenForgotPassword;

            if (!tokenForgotPassword || !otp || !password) {
                throw new BadRequestError('Bạn đang thiếu thông tin (OTP hoặc mật khẩu mới)');
            }

            const decoded = jwt.verify(tokenForgotPassword, process.env.JWT_SECRET);
            const email = decoded.email;

            const findOtp = await otpModel.findOne({ email, otp });
            if (!findOtp) {
                throw new BadRequestError('Mã OTP không hợp lệ hoặc đã hết hạn');
            }

            const findUser = await UserModel.findOne({ email });
            if (!findUser) throw new NotFoundError('Người dùng không tồn tại');

            const hashedPassword = await bcrypt.hash(password, 10);
            findUser.password = hashedPassword;
            await findUser.save();

            await otpModel.deleteMany({ email });
            res.clearCookie('tokenForgotPassword');

            return new OK({
                message: 'Khôi phục mật khẩu thành công',
                metadata: true,
            }).send(res);
        } catch (error) {
            next(error); // Chuyển lỗi về Error Middleware xử lý
        }
    }
}

module.exports = new UserController();
