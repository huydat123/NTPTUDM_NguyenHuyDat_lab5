const express = require('express');
const router = express.Router();
const User = require('../models/User');

// --- CÂU 1: CRUD (CREATE & READ) ---

// 1.1 Hàm POST để tạo mới User (BẮT BUỘC phải có để nạp dữ liệu)
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: "Lỗi tạo User: " + err.message });
    }
});

// 1.2 Get All có query username (includes) & loại bỏ user đã xóa mềm
router.get('/', async (req, res) => {
    try {
        let query = { isDeleted: false };
        if (req.query.username) {
            // $regex tương đương với "includes" trong JS
            query.username = { $regex: req.query.username, $options: 'i' };
        }
        const users = await User.find(query).populate('role');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1.3 Get theo ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CÂU 2: ENABLE STATUS ---
router.post('/enable', async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );
        user ? res.json(user) : res.status(404).json({ message: "Thông tin email/username không khớp" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CÂU 3: DISABLE STATUS ---
router.post('/disable', async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );
        user ? res.json(user) : res.status(404).json({ message: "Thông tin email/username không khớp" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CÂU 4: GET USERS BY ROLE ID ---
router.get('/role/:roleId', async (req, res) => {
    try {
        const users = await User.find({ role: req.params.roleId, isDeleted: false });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CÂU 1 (UD): XÓA MỀM (Soft Delete) ---
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.json({ message: "Đã xóa mềm thành công", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;