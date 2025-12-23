const express = require('express');
const router = express.Router();
const Question = require('../Models/Question');
const Message = require('../Models/Message');
const User = require('../Models/userModels'); 
const bcrypt = require('bcryptjs'); 
const { auth } = require('../Middleware/Auth');

// Protect ALL user routes
router.use(auth);

 // GET current user's profile method
 
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});


 //A method in which user updates there  profile (name, email)
 
router.put('/profile', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    //A condition to check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user.userId } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


// a method to change  password
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords are required' });
    }

    const user = await User.findById(req.user.userId);
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash and save new password
    user.password = newPassword; 
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

 // getting  user's own questions + admin answers
 // filtered, User only sees questions they created.
 
router.get('/questions', async (req, res) => {
  try {
    //check if the logged-in user is an admin or a regular user 
    //if admin ,filter is empty {}(find all).if user ,filter by their ID
    const filter = req.user.role == 'admin' ? {} :{askedBy: req.user.userId};

    const questions = await Question.find(filter) 
      .populate('askedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});
//user respond method 
 
router.put('/questions/:id/answer', async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { answer },
      { new: true }
    );

    res.json({ message: 'Answer submitted', updatedQuestion });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// User asks a question to Admin method 
router.post('/ask', async (req, res) => {
  try {
    const { questionText } = req.body;

    const question = new Question({
      questionText,
      askedBy: req.user.userId
    });

    await question.save();
    res.status(201).json({ message: 'Question sent to admin', question });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ask question' });
  }
});


 // User sends message to admin method 

router.post('/message', async (req, res) => {
  try {
    const { text, adminId } = req.body;

    const message = new Message({
      text,
      sender: req.user.userId,
      recipient: adminId
    });

    await message.save();
    res.status(201).json({ message: 'Message sent', message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;