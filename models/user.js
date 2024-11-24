const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true }); // إضافة timestamps للتتبع

// middleware قبل حفظ المستخدم
userSchema.pre('save', async function(next) {
    // التحقق من تعديل كلمة المرور
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // إنشاء salt
        const salt = await bcrypt.genSalt(10);
        // تشفير كلمة المرور
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// دالة للتحقق من كلمة المرور
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('User', userSchema);