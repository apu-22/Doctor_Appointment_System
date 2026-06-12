# MediBook - Doctor Appointment System

A full-stack web application that streamlines the healthcare appointment process by connecting patients and doctors through a secure and user-friendly platform.

The system enables patients to book appointments, doctors to manage schedules and prescriptions, and administrators to monitor platform activities. It is designed using a modern client-server architecture with React, Node.js, Express, and MySQL.

---

## Project Overview

MediBook is a digital healthcare management platform that simplifies appointment scheduling and patient-doctor interactions.

The application provides:

* Secure user authentication and authorization
* Doctor schedule and slot management
* Online appointment booking
* Digital prescription generation
* PDF prescription download
* Email notifications
* Role-based dashboards
* Administrative monitoring tools

---

## Features

### Patient Features

* User Registration
* Secure Login & Authentication
* Browse Available Doctors
* View Available Time Slots
* Book Appointments
* Cancel Appointments
* View Appointment History
* Download Prescriptions (PDF)
* Receive Appointment Notifications

### Doctor Features

* Doctor Authentication
* Manage Availability Slots
* View Daily Appointment Queue
* Manage Appointment Status
* Create Digital Prescriptions
* Access Patient Information
* View Appointment History

### Administrator Features

* Monitor Registered Users
* Manage Doctors and Patients
* View System Statistics
* Track Appointments
* Generate Reports
* Monitor Platform Activities

### System Features

* JWT Authentication
* Password Encryption using Bcrypt
* Role-Based Access Control (RBAC)
* RESTful API Architecture
* Email Notifications
* PDF Generation
* Secure Database Operations
* Error Handling Middleware
* Responsive User Interface

---

## System Architecture

Frontend → Backend API → Database

```text
React + Vite
      │
      ▼
Axios API Requests
      │
      ▼
Node.js + Express.js
      │
      ▼
MySQL Database
```

### Request Flow Example

```text
Patient
   │
   ▼
Book Appointment
   │
   ▼
React Frontend
   │
   ▼
Axios API Request
   │
   ▼
Express Route
   │
   ▼
Authentication Middleware
   │
   ▼
Controller
   │
   ▼
Model
   │
   ▼
MySQL Database
   │
   ▼
Response
   │
   ▼
Frontend UI Update
```

---

## Technology Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Context API

### Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt
* Nodemailer
* PDFKit

### Database

* MySQL
* mysql2

### Development Tools

* Git
* GitHub
* Postman
* VS Code

---

## Database Design

### Users

Stores authentication and user information.

| Field    | Type    |
| -------- | ------- |
| id       | INT     |
| name     | VARCHAR |
| email    | VARCHAR |
| password | VARCHAR |
| role     | ENUM    |

### Doctors

Stores doctor profiles.

| Field          | Type    |
| -------------- | ------- |
| id             | INT     |
| user_id        | INT     |
| specialization | VARCHAR |
| experience     | INT     |

### Slots

Stores doctor availability.

| Field      | Type    |
| ---------- | ------- |
| id         | INT     |
| doctor_id  | INT     |
| weekday    | VARCHAR |
| start_time | TIME    |
| end_time   | TIME    |
| status     | ENUM    |

### Appointments

Stores appointment records.

| Field            | Type |
| ---------------- | ---- |
| id               | INT  |
| patient_id       | INT  |
| doctor_id        | INT  |
| slot_id          | INT  |
| appointment_date | DATE |
| status           | ENUM |

### Prescriptions

Stores digital prescriptions.

| Field          | Type |
| -------------- | ---- |
| id             | INT  |
| appointment_id | INT  |
| diagnosis      | TEXT |
| medicines      | JSON |

### Notifications

Stores notification records.

| Field   | Type |
| ------- | ---- |
| id      | INT  |
| user_id | INT  |
| message | TEXT |
| status  | ENUM |

---

## Project Structure

```text
MediBook
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   └── assets
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   └── utils
│
└── database
```

---

## Installation Guide

### Clone Repository

```bash
https://github.com/apu-22/Doctor_Appointment_System
```

### Backend Setup

```bash
cd backend
npm install
```

### Create Environment File

Create a `.env` file inside backend directory.

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=doctor_appointment_system

JWT_SECRET=medibook_secret_key_change_in_production

```

### Run Backend

```bash
npm run dev
```

Backend will start at:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Run Frontend

```bash
npm run dev
```

Frontend will start at:

```text
http://localhost:5173
```

---

## API Documentation

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |

### Doctor

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | /api/doctors           |
| GET    | /api/doctors/:id       |
| POST   | /api/doctors/slots     |
| PUT    | /api/doctors/slots/:id |
| DELETE | /api/doctors/slots/:id |

### Appointment

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/appointments/book    |
| GET    | /api/appointments/patient |
| GET    | /api/appointments/doctor  |
| PUT    | /api/appointments/status  |
| DELETE | /api/appointments/cancel  |

### Prescription

| Method | Endpoint                   |
| ------ | -------------------------- |
| POST   | /api/prescriptions         |
| GET    | /api/prescriptions/:id     |
| GET    | /api/prescriptions/:id/pdf |

---

## Authentication & Security

* JWT Based Authentication
* Password Hashing with Bcrypt
* Protected Routes
* Role-Based Authorization
* Secure API Endpoints
* Input Validation
* Error Handling Middleware

---

## Screenshots

### Login Page

Add screenshot here

```text
screenshots/login.png
```

### Dashboard

Add screenshot here

```text
screenshots/dashboard.png
```

### Appointment Booking

Add screenshot here

```text
screenshots/booking.png
```

### Prescription Generation

Add screenshot here

```text
screenshots/prescription.png
```

---

## Future Enhancements

* Video Consultation
* Online Payment Gateway
* SMS Notifications
* AI-Based Doctor Recommendation
* Mobile Application
* Real-Time Chat
* Medical Report Upload
* Multi-Language Support

---

## Learning Outcomes

This project demonstrates practical implementation of:

* Full Stack Web Development
* REST API Development
* Authentication & Authorization
* Database Design
* MVC Architecture
* State Management
* PDF Generation
* Email Integration
* Software Engineering Principles

---

## Author

### Apu Rayhan

B.Sc. in Software Engineering at SUST

GitHub: https://github.com/apu-22

Email: mdapurayhan1729@gmail.com

---

## License

This project is developed for educational and academic purposes.

© 2026 Apu Rayhan. All Rights Reserved.
