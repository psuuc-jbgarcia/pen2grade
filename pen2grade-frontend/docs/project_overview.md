# Pen2Grade Project Overview

This document provides a summary of the project structure, implementation files, and running URLs for the Pen2Grade AI Checker project.

## 🚀 Running the Project

You can run the entire system using Docker from the root directory:

```bash
docker-compose up
```

### URLs
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend API**: [http://localhost:3000](http://localhost:3000)
    - **AI Service**: [http://localhost:8000](http://localhost:8000)

---

## 📂 Project Structure & Key Files

The project is divided into three main components:

### 1. Frontend (`pen2grade-frontend`)
Built with React, Vite, and Tailwind CSS.
- **Main Location**: `src/`
- **Entry Point**: `src/main.tsx` & `src/App.tsx` (Routing)
- **Pages**: `src/pages/` (e.g., `DashboardPage.tsx`, `LoginPage.tsx`)
- **Styles**: `src/index.css` & `src/App.css`

### 2. Backend API (`pen2grade-backend`)
Built with Node.js, Express, and MongoDB.
- **Entry Point**: `server.js`
- **Routes**: `routes/`
  - `authRoutes.js`: User authentication
  - `rubricRoutes.js`: Rubric management
  - `essayRoutes.js`: Essay processing
- **Models**: `models/` (Database schemas)
  - `User.js`, `Rubric.js`, `Essay.js`
- **Environment**: `.env` (API keys and database URI)

### 3. AI Service (`pen2grade-ai`)
Built with Python (FastAPI) and Gemini AI.
- **Entry Point**: `main.py`
- **Logic**: `llm_service.py` (Interacts with Google Gemini)
- **Dependencies**: `requirements.txt`

---

## 🛠️ Infrastructure
- **Docker**: `docker-compose.yml` in the root directory manages all services.
- **Uploads**: `pen2grade-backend/uploads/` stores files uploaded by users.
