// 1. ALWAYS call dotenv first
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Import Models (Add this line!)
const Message = require('./Models/Message'); // Ensure this file exists

// 3. Import Routes
const authRoutes = require('./Routes/Auth');
const adminRoutes = require('./Routes/admin'); 
const userRoutes = require('./Routes/user');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
     origin: [
          'http://localhost:5173',
          'http://localhost:3000',
          'https://chat-system-lyart.vercel.app'  
     ],
     credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
// 4. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
     res.send('chat system API is running...');
});

app.post('/message', async (req, res) => {
     try {
         const newMessage = new Message({ text: req.body.text });
         await newMessage.save();
         res.status(201).json(newMessage);
     } catch (error) {
         res.status(500).json({ error: 'Error saving message' });
     }
});

// 5. Database Connection
mongoose
     .connect(process.env.MONGODB_URI)
     .then(() => console.log('MongoDB Connected'))
     .catch((err) => {
         console.log('MongoDB connection error:', err);
         // Hint: If you see ESERVFAIL here, check your internet or MongoDB Whitelist
     });

app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
});
