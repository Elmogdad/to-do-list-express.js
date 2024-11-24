const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin = async (req, res) => {
    res.render('auth/login' , {pageTitle: 'Login' , path : '/login' , errorMessage : 'Login error'})
}


exports.getSignup = async (req, res) => {
    res.render('auth/signup' ,{pageTitle: 'Sign Up' , path : '/signup' , errorMessage : 'Login error'})
}

exports.postSignup = async (req, res) => {
  try {
   const {name , email, password } = req.body;
 
   const user = new User({
    name, email , password
   });

   user.save();
   console.log('user created successfully');
   res.redirect('/login')
  } catch (error) {
 res.status(500).json({error : error.message})
  }
}

exports.postLogin =  async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'البريد الإلكتروني غير موجود' });
        }
        
        // التحقق من كلمة المرور
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });
        }

        // إنشاء جلسة للمستخدم
        req.session.isAuth = true;
        req.session.userId = user._id;
        
       res.redirect('/tasks')
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};