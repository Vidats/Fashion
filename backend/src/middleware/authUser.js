const { AuthFailureError } = require('../core/error.response');
const { verifyToken } = require('../auth/checkAuth');
const UserModel = require('../models/user.model');

const authUser = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return next(new AuthFailureError('Vui lòng đăng nhập lại'));
        }

        const decoded = await verifyToken(accessToken);
        if (!decoded || !decoded.id) {
            return next(new AuthFailureError('Vui lòng đăng nhập lại'));
        }

        req.user = decoded.id;
        next();
    } catch (error) {
        return next(new AuthFailureError('Vui lòng đăng nhập lại'));
    }
};

const authAdmin = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw new AuthFailureError('Vui lòng đăng nhập lại');
        }
        const decoded = await verifyToken(accessToken);
        if (!decoded) {
            throw new AuthFailureError('Vui lòng đăng nhập lại');
        }
        const findUser = await UserModel.findById(decoded.id);
        if (!findUser) {
            throw new AuthFailureError('Vui lòng đăng nhập lại');
        }
        if (findUser.isAdmin === false) {
            throw new ForbiddenError('Bạn không có quyền truy cập');
        }
        next();
    } catch (error) {
        throw new ForbiddenError('Bạn không có quyền truy cập');
    }
};

module.exports = { authUser, authAdmin };
