# TalentHub Backend API

This is the **TalentHub Backend API**, built as part of my **Job Test for MO Business PLC**.  
It is a RESTful API built with **Express.js** and **MongoDB** that powers a job application platform.  

The system provides **JWT Authentication**, **Role-Based Access Control (RBAC)**, and secure endpoints for managing users, jobs, and job applications.  

<img width="831" height="439" alt="Screenshot 2025-08-24 114139" src="https://github.com/user-attachments/assets/3f12b646-ecb4-49e1-b4ad-7cf82d095077" />

---

## 🚀 Features

- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Role-Based Access Control**: Admin, Employer, Applicant
- **Applications Management**: Users can apply for jobs, Employers/Admins can manage applications.
- **Job Management**: Admins and Employers can create and manage jobs.
- **User Management**: Registration, login, and profile retrieval.

---

## 📌 API Endpoints

### 🔑 Auth (`/auth`)
- **POST** `/auth/register` → Register a new user  
- **POST** `/auth/login` → Login with email & password  
- **GET** `/auth/user` → Get authenticated user info  

---

### 👔 Job (`/job`)
- **POST** `/job` → Create a job *(Admin/Employer only)*  
- **GET** `/job` → Get all jobs (with **pagination** & **advanced filtering**)  
- **GET** `/job/:id` → Get job by ID  
- **DELETE** `/job/:id` → Delete a job *(Admin or job creator only)*  

---

### 📄 Applications (`/application`)
- **POST** `/application` → Apply for a job  
- **GET** `/application` →  
  - Get all applications submitted by the logged-in user  
  - Get all applications for a specific job created by the employer  
- **GET** `/application/:id` → Get an application by ID  
- **PATCH** `/application/:id` → Update the status of an application *(job creator only)*  

---

### 🛠 Admin (`/admin`)
- **GET** `/admin` → Get admin dashboard  

---

## 🏗 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/talenthub-backend.git
   cd talenthub-backend
    ```
2. Install dependencies:
   ```bash
     npm install
    ```
3. Create a .env file in the project root:
   ```bash
     MONGO_URI= your_mongo_url
     PORT=5000
     JWT_SECRET=your_jwt_secret_key
     CLIENT_URL=http://localhost:3000/
   ```
4. Run the development server:
   ```bash
     npm run dev
   ```
   
