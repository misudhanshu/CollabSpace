# CollabSpace

CollabSpace is a full-stack collaboration platform I'm building to help teams create shared workspaces and manage their work in one place.

The project is built with the MERN stack and focuses on implementing real-world application features such as authentication, authorization, workspace management, member management, and REST API integration.

This project is also an opportunity for me to put the concepts I've learned into practice and understand how the frontend, backend, database, and authentication layers work together in a complete application.

---

## What is CollabSpace?

CollabSpace allows users to create and work inside shared workspaces.

The basic idea is simple:

1. A user creates an account.
2. The user logs in securely.
3. The user can create a workspace.
4. Other users can join the workspace.
5. Members can work together inside the same workspace.

The application is being developed incrementally, with each feature being implemented across both the backend and frontend before moving on to the next feature.

---

## Current Features

### Authentication

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Authentication middleware
- Basic request validation and error handling

### Workspace Management

- Create workspaces
- View workspaces
- Join workspaces
- Workspace-based organization
- Workspace member management

More workspace functionality will be added as development continues.

---

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- JavaScript

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt

### Database

- MongoDB
- Mongoose

### Tools

- Git
- GitHub
- Postman
- VS Code

---

## Project Structure

The project is divided into two main parts: frontend and backend.

```text
CollabSpace
│
├── frontend
│   ├── components
│   ├── pages
│   ├── routes
│   └── ...
│
└── backend
    ├── controllers
    ├── models
    ├── routes
    ├── middlewares
    └── ...
```

The backend follows a simple separation of responsibilities:

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Model
   ↓
Database
```

This structure keeps routing, authentication, business logic, and database operations separate and easier to maintain.

---

## Authentication Flow

CollabSpace uses JWT-based authentication.

When a user registers, the password is hashed before the user is stored in the database.

When the user logs in:

```text
Login Request
     ↓
Verify Credentials
     ↓
Generate JWT
     ↓
Return Token
```

For protected requests:

```text
Client Request
     ↓
Authorization Header
     ↓
Authentication Middleware
     ↓
Verify JWT
     ↓
Protected Controller
```

This allows the backend to verify that a request is coming from an authenticated user before allowing access to protected resources.

---

## API

The API is built using REST principles.

### Authentication

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | `/users/register` | Register a new user    |
| POST   | `/auth/login`    | Login an existing user |

### Workspace

Workspace endpoints will be added and documented here as the workspace functionality develops.

---

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- MongoDB or a MongoDB Atlas account
- Git installed

### Clone the repository

```bash
git clone <your-repository-url>
cd CollabSpace
```

### Backend setup

```bash
cd backend
npm install
```

Start the backend:

```bash
npm run dev
```

### Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will then communicate with the backend through the configured API endpoints.

---

## Development Approach

I'm building CollabSpace feature by feature rather than completing the entire backend first and then moving to the frontend.

For each feature, the process is roughly:

```text
Plan the feature
      ↓
Build the backend
      ↓
Build the frontend
      ↓
Connect both sides
      ↓
Test the complete feature
      ↓
Move to the next feature
```

This makes it easier to find problems early and gives me a better understanding of how each part of a full-stack application connects together.

---

## What I'm Learning Through This Project

The main purpose of CollabSpace is not just to build another CRUD application. I'm using it to understand how the different parts of a modern web application work together.

Some of the concepts I'm practicing include:

- Designing REST APIs
- Authentication and authorization
- JWT and middleware
- Password hashing
- MongoDB and Mongoose
- React component architecture
- Client-side routing
- API integration
- Form handling
- Error handling
- Project structure and separation of concerns
- Git and GitHub workflow

---

## Future Plans

Some features I plan to add as the project grows:

- Real-time collaboration
- Notifications
- Search and filtering
- Better workspace administration
- Automated testing
- Deployment

These features will be added gradually as the core application becomes more complete.

---

## Screenshots

Screenshots will be added as the frontend development progresses.

---

## Live Demo

Coming soon.

---

## About

CollabSpace is a personal portfolio project built with the MERN stack.

The goal of the project is to take the concepts I've learned while studying full-stack development and use them to build something closer to a real-world application.

Rather than following a tutorial from beginning to end, I'm building the application feature by feature and learning how to make the architectural and implementation decisions along the way.

---

## License

This project is currently being developed as a personal portfolio project.
