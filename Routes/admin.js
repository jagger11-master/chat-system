const express = require('express');
const router = express.Router();
const Question = require('../Models/Question');
const User = require('../Models/userModels'); // Add this import
const { auth, isAdmin } = require('../Middleware/Auth');

// Apply protection to ALL routes in this folder
router.use(auth);
router.use(isAdmin);

// ===== USER MANAGEMENT ROUTES (NEW) =====

// 1. GET all users (Admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        res.json({ users, count: users.length });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// 2. GET single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// 3. DELETE a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// 4. UPDATE user role (promote/demote)
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        res.json({ message: "User role updated", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update role" });
    }
});

// ===== QUESTION MANAGEMENT ROUTES (EXISTING) =====

// 1. CREATE a new question (as an Admin)
router.post('/questions', async (req, res) => {
    try {
        const { questionText } = req.body;
        const newQuestion = new Question({ questionText, askedBy: req.user.userId });
        await newQuestion.save();
        res.status(201).json({ message: "Question created successfully", newQuestion });
    } catch (error) {
        res.status(500).json({ error: "Failed to create question" });
    }
});

// 2. RESPOND to a user's answer/question
router.put('/questions/:id/respond', async (req, res) => {
    try {
        const { answer } = req.body;
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id, 
            { answer }, 
            { new: true }
        );
        res.json({ message: "Response sent", updatedQuestion });
    } catch (error) {
        res.status(500).json({ error: "Failed to respond" });
    }
});

// 3. DELETE a question
router.delete('/questions/:id', async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete question" });
    }
});

// 4. DELETE/CLEAR an answer
router.put('/questions/:id/delete-answer', async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id, 
            { answer: "" }, 
            { new: true }
        );
        res.json({ message: "Answer cleared", updatedQuestion });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete answer" });
    }
});

module.exports = router;