
💬 Chat System - Full-Stack Authentication & Q&A Platform

A comprehensive Node.js/Express backend API with MongoDB Atlas, featuring advanced authentication, role-based access control, question-answer system, and real-time messaging capabilities. Built with security, scalability, and developer experience in mind.
## Project Overview
This Chat System is a production-ready backend API designed to power modern communication platforms. It implements industry-standard security practices, scalable architecture patterns, and provides a robust foundation for building chat applications, Q&A platforms, or customer support systems.

## Features
- User registration and login with JWT authentication
- Admin and user roles
- Question and answer system
- User profile management
- MongoDB Atlas database

## Features
Authentication & Authorization

- User Registration & Login with JWT tokens
- Role-Based Access Control (Admin & User roles)
- Password Hashing with bcrypt for security
- Protected Routes with middleware authentication
- Admin Secret Key for secure admin registration

## User Management

- User Profiles - View and update profile information
- Role Management - Admins can promote/demote users
- Password Change functionality
- User List for admins

## Question & Answer System

- Create Questions (Admin feature)
- Ask Questions (User feature)
- Answer Questions (Both admin and users)
- View All Q&A with pagination support
- Track Question Authors

## Messaging System

- Direct Messages between users
- User-to-Admin messaging


## Technologies Used
Backend

Node.js - JavaScript runtime
Express.js - Web framework
MongoDB Atlas - Cloud database
Mongoose - MongoDB object modeling

Authentication & Security

JWT (jsonwebtoken) - Secure token-based authentication
bcryptjs - Password hashing
dotenv - Environment variable management

Utilities

cors - Cross-Origin Resource Sharing
express.json() - JSON body parsing

📁 Project Structure
chat-system/
│
├── Models/
│   ├── userModels.js      # User schema with password hashing
│   ├── Question.js        # Question & answer schema
│   └── Message.js         # Message schema
│
├── Routes/
│   ├── Auth.js            # Authentication routes (register/login)
│   ├── admin.js           # Admin-only routes (user & question management)
│   └── user.js            # User routes (profile, questions, messages)
│
├── Middleware/
│   └── Auth.js            # JWT verification & role-checking middleware
│
├── .env                   # Environment variables (NOT in Git!)
├── .gitignore             # Git ignore file
├── index.js               # Main server file
├── package.json           # Dependencies
└── README.md              # This file

## Setup
1. Clone the repository
git clone https://github.com/jagger11-master/chat-system.git
cd chat-system
2. Run `npm install`
3. Create `.env` file with your MongoDB URI and secrets
4. Run `node index.js`