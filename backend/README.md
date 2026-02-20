# BitCore Backend - NestJS & MongoDB

This is the backend service for BitCore, an authenticated URL shortener.

## 🛠️ Technology Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Auth**: [Passport.js](https://www.passportjs.org/) with JWT
- **Validation**: [class-validator](https://github.com/typestack/class-validator)
- **Security**: Bcrypt for password hashing

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

## 🚀 Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.
   ```bash
   cp .env.example .env
   ```

3. **Running the App**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

## 🏗️ Architecture

The backend follows a clean, layered architecture:

- **Controllers**: Handle incoming HTTP requests and map them to service calls.
- **Services**: Contain the core business logic.
- **Repositories**: Handle data persistence logic, abstracting the database layer.
- **Schemas**: Define the Mongoose data models.

## 🔒 Security

- **JWT Authentication**: Protected routes require a valid Bearer token.
- **Bcrypt**: All passenger passwords are salted and hashed before storage.
- **Global Pipes**: Automated input validation and transformation.
- **Exception Filters**: Standardized error responses to prevent sensitive data leakage.

---
Built by Antigravity
