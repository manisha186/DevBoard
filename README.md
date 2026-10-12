# DevBoard — Project and Issue Tracking System

DevBoard is a full-stack web application for managing projects and tracking issues. It provides user authentication, project ownership, issue management, and an AI-powered assistant that answers questions using project data.

## Features

- **User Authentication:** Register and log in securely using password hashing and JWT authentication.
- **Project Management:** Create, view, update, and delete projects.
- **User-Specific Projects:** Each user can access their own projects.
- **Issue Tracking:** Create, view, update, and delete issues associated with projects.
- **Issue Ownership:** Users can access issues belonging to their own projects.
- **Search and Filters:** Search issues and filter them by priority and status.
- **Astro AI Assistant:** Ask questions about project and issue information using a locally hosted AI model.
- **Responsive Interface:** A dark, space-inspired interface built with React.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML and CSS

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Maven

### Database
- MySQL

### AI Integration
- Ollama
- Llama 3.2 (3B)

## Project Structure

```text
LibratyM/
├── frontend/       # React and Vite application
├── backend/        # Spring Boot REST API
└── README.md       # Project documentation
```

## Prerequisites

Install the following before running DevBoard:

- Java 17
- Node.js and npm
- MySQL 8
- Ollama with the `llama3.2:3b` model

## Configuration

1. Create a MySQL database named `devboard`.
2. Configure the database connection and credentials in `backend/src/main/resources/application.properties`.
3. Configure the JWT secret using the application's expected configuration.
4. Ensure Ollama is running locally and the `llama3.2:3b` model is available.
5. Keep passwords, database credentials, and JWT secrets private. Do not commit them to GitHub.

## How to Run

### 1. Start the Backend

Open a terminal in the project root and run:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs at:

`https://devboard-production-c684.up.railway.app`

### 2. Start the Frontend

Open a second terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser. The default port is `5173`, but Vite may select another available port.

### 3. Start the AI Service

Start Ollama and ensure the configured model is available. The backend expects Ollama at the URL configured in `application.properties`, currently `http://localhost:11434`.

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/projects` | Retrieve the authenticated user's projects |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/{id}` | Update an owned project |
| DELETE | `/api/projects/{id}` | Delete an owned project |
| GET | `/api/issues` | Retrieve issues from the user's projects |
| POST | `/api/issues` | Create an issue for an owned project |
| PUT | `/api/issues/{id}` | Update an accessible issue |
| DELETE | `/api/issues/{id}` | Delete an accessible issue |
| POST | `/api/astro/chat` | Ask Astro AI a question |

Protected endpoints require a valid JWT access token.

## Database

DevBoard uses MySQL to store user accounts, projects, and issues. Projects are associated with their owners, and issue access is restricted according to project ownership.

## Future Enhancements

Potential future improvements include a Kanban board, issue comments, project team membership, pagination, advanced sorting, and expanded automated testing.

## Author

Developed as an academic full-stack project using React, Spring Boot, MySQL, and Ollama.