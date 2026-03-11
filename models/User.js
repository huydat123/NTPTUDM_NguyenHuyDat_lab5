const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    fullName: { 
        type: String, 
        default: "" 
    },
    avatarUrl: { 
        type: String, 
        default: "https://i.sstatic.net/l60Hf.png" 
    },
    status: { 
        type: Boolean, 
        default: false 
    },
    role: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role' 
    },
    loginCount: { 
        type: Number, 
        default: 0, 
        min: 0  // Đảm bảo số lần đăng nhập không âm
    },
    isDeleted: { 
        type: Boolean, 
        default: false // Dùng để quản lý xóa mềm
    }
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

module.exports = mongoose.model('User', UserSchema);