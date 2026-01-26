const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/feedback');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const { asyncHandler } = require('../auth/checkAuth');
const { authAdmin, authUser } = require('../middleware/authUser');

const feedbackController = require('../controllers/feedback.controller');
router.post('/create', authUser, upload.array('imagesFeedback', 10), asyncHandler(feedbackController.createFeedback));
// Bỏ hết middleware authAdmin/authUser ở dòng này để ai cũng xem được
router.get('/get', asyncHandler(feedbackController.getLatestFeedback)); //lấy 4 feedback mới nhất
router.get('/get-all', authAdmin, asyncHandler(feedbackController.getAllFeedback));
//lấy feedback của user
router.get('/get-user-feedback', authUser, asyncHandler(feedbackController.getFeedbackInUser));
//xóa feedback
router.delete('/delete/:feedbackId', authUser, asyncHandler(feedbackController.deleteFeedback));
module.exports = router;
