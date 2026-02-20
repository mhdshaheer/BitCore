# BitCore - Authenticated URL Shortener

BitCore is a production-ready, enterprise-level URL shortener built with NestJS and Angular.

## 🏗️ Architecture

### Backend (NestJS & MongoDB)
- **Mongoose Schemas**: Using document-based storage for better flexibility.
- **Repository Pattern**: Segregated data access logic from business logic.
- **SOLID Principles**: Focused on single responsibility and interface segregation.
- **Layered Structure**: Controller -> Service -> Repository -> Schema.
- **Standardized Responses**: Global interceptors and filters for consistent API output.
- **Secure Auth**: JWT-based authentication with Bcrypt password hashing.

### Frontend (Angular)
- **Standalone Components**: Modern Angular architecture.
- **Feature-Based Structure**: Organized by core, shared, and feature modules.
- **Tailwind CSS**: Premium SaaS-style UI with custom color palettes.
- **Signals**: Modern state management using Angular Signals.

## 🚀 Setup Instructions

### Backend
1. Navigate to `/backend`
2. Run `npm install`
3. Run `npm run start:dev`
4. Base URL: `http://localhost:3000/api`

### Frontend
1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm start`
4. Access: `http://localhost:4200`

## 🔐 Security Considerations
- JWT tokens for session management.
- Route guards on frontend and Passport guards on backend.
- Password hashing using Bcrypt.
- Input validation using `class-validator` (backend) and Reactive Forms (frontend).

## 🧠 AI Usage Transparency
AI tools were used to:
- Generate base boilerplate for NestJS and Angular.
- Design the premium SaaS UI-compatible Tailwind configuration.
- Accelerate the implementation of the Repository pattern and SOLID-compliant layers.
- Ensure consistent naming conventions and standardized error handling across both layers.

---
Built with ❤️ by Antigravity
