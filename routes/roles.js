const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const role = new Role({
            name: req.body.name,
            description: req.body.description
        });
        const savedRole = await role.save();
        res.status(201).json(savedRole);
    } catch (err) {
        res.status(400).json({ message: "Lỗi khi tạo Role: " + err.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: "Không tìm thấy Role" });
        res.json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. [UPDATE] - Cập nhật thông tin Role
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. [DELETE] - Xóa Role
router.delete('/:id', async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa Role thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Path: GET /api/v1/roles/:id/users
router.get('/:id/users', async (req, res) => {
    try {
        const users = await User.find({ 
            role: req.params.id, 
            isDeleted: false 
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách User theo Role: " + err.message });
    }
});

module.exports = router;