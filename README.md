# Senapransakthi

## Overview

Senapransakthi is a full-stack Data Science and AI system designed to monitor, analyze, and manage soldier health and operational data. The platform integrates machine learning-driven insights with scalable backend services and an interactive frontend dashboard to support real-time decision-making.

---

## Problem Statement

Managing large-scale personnel health and operational data is complex and time-sensitive. Traditional systems lack intelligent analysis, real-time alerts, and unified visibility.

Senapransakthi addresses this by combining AI-driven analysis with a centralized system for monitoring and decision support.

---

## Key Features

* **AI-driven analysis** for extracting insights from health and operational data
* **Real-time dashboard** for monitoring key metrics
* **Digital twin system** for representing soldier profiles dynamically
* **Alert mechanism** for detecting and notifying critical conditions
* **Secure authentication** using JWT
* **Chat-based interaction module** for system communication
* **Modular backend architecture** with scalable APIs

---

## Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express.js
* RESTful APIs

### Data Science / AI

* Machine learning logic integration
* Data processing using structured datasets (CSV-based workflows)

### Database & Tools

* Drizzle ORM
* PostgreSQL (or compatible database)
* JWT Authentication

---

## System Architecture

The application follows a modular full-stack architecture:

* **Frontend** handles user interaction and visualization
* **Backend** manages APIs, business logic, and authentication
* **AI/Data layer** processes datasets and generates insights
* **Database layer** stores structured data and system state

---

## Project Structure

```bash
senapransakthi/
├── frontend/        # User interface and client-side logic
├── backend/         # APIs, services, controllers, and database logic
└── README.md
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/rahul4018/senapransakthi.git
cd senapransakthi
```

### 2. Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd ../backend
npm install
```

---

### 3. Configure environment variables

Create a `.env` file inside the backend directory:

```bash
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=your_database_url
```

---

### 4. Run the application

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

---

## Future Improvements

* Integration of advanced machine learning models
* Real-time streaming data processing
* Cloud deployment and scalability enhancements
* Enhanced UI/UX for better usability
* Performance optimization and monitoring

---

## License

This project is licensed under the MIT License.
