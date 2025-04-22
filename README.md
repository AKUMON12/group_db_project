# group_db_project

```markdown
# 📦 Student Information System – Backend

This is the **backend API** for the Student Information System, built using **Node.js**, **Express**, and **MySQL**. It handles user registration, login (with JWT authentication), and CRUD operations for both Admins and Students.

---

## 📁 Project Structure



---

BACKEND/
│
├── config/               # Database connection settings
│   └── db.js
│
├── controllers/          # Route handler logic
│   ├── admin.controller.js
│   ├── auth.controller.js
│   └── student.controller.js
│
├── middleware/           # Middleware for JWT auth
│   └── auth.middleware.js
│
├── models/               # DB logic (SQL queries)
│   ├── admin.model.js
│   └── student.model.js
│
├── routes/               # API endpoints
│   ├── admin.routes.js
│   ├── auth.routes.js
│   └── student.routes.js
│
├── uploads/              # (Optional) File upload storage
│
├── .env                  # Environment variables (DB, JWT secret, etc.)
├── server.js             # Entry point – starts Express server
├── package.json          # Project metadata and dependencies
├── package-lock.json
└── README.md             # Project documentation
```

---

## ⚙️ Technologies Used

- **Node.js** with **Express**
- **MySQL** for database
- **JWT** (JSON Web Token) for authentication
- **bcryptjs** for password hashing
- **dotenv** for environment management
- **Postman** for API testing

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=student_information_db
JWT_SECRET=your_jwt_secret
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/student-information-system.git
cd BACKEND
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
- Create a MySQL database named: `student_information_db`
- Import your SQL schema (if any) manually or set up migrations.

### 4. Run the Server
```bash
npm start
```

Server will run on `http://localhost:5000` (or the `PORT` you set).

---

## 🔗 API Endpoints

### 🔒 Auth Routes (`/api/auth`)
- `POST /register` – Register as Admin or Student
- `POST /login` – Login and receive JWT token

### 👤 Admin Routes (`/api/admins`)
- `GET /` – List all admins
- `GET /:id` – Get admin by ID
- `PUT /:id` – Update admin
- `DELETE /:id` – Delete admin

### 🎓 Student Routes (`/api/students`)
- `GET /` – List all students
- `GET /:id` – Get student by ID
- `PUT /:id` – Update student
- `DELETE /:id` – Delete student

> 🔐 Note: Protected routes require an `Authorization` header with a Bearer token.

---

## 📂 Sample POSTMAN Collection

You can use Postman to test all routes. Example request headers:

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 👨‍💻 Team Members

- **Tristan Howard** – Developer / Project Leader
- (Add your teammates here)

---

## 📌 Future Improvements

- Profile picture uploads (via `multer`)
- Role-based access control
- Activity logs
- Admin dashboard
- Pagination and search for student lists

---

## Here's a breakdown of the backend folder structure and the purpose of each file/folder:

---

### ✅ `server.js`
This is the **entry point** of backend application. It:

- Starts the Express server.
- Connects all routes (admin, student, auth).
- Uses middleware like CORS and JSON body parsing.

---

### ✅ `config/db.js`
- Handles the **MySQL database connection** using `mysql2` or `mysql`.
- Allows you to reuse the DB connection across all controllers and models.

---

### ✅ `controllers/`
This folder contains logic for handling HTTP requests. Each controller connects requests to the database through the models.

- **`admin.controller.js`**  
  Handles admin-related logic like login, registration (if applicable), and other admin CRUD operations.

- **`auth.controller.js`**  
  Manages login and registration for both students and admins. It:
  - Validates inputs
  - Encrypts passwords
  - Checks credentials
  - Generates JWT tokens

- **`student.controller.js`**  
  Handles CRUD operations (create, read, update, delete) for student data.

---

### ✅ `middleware/auth.middleware.js`
- Contains the `verifyToken` function to **protect private routes**.
- Checks for a JWT token in the `Authorization` header.
- Denies access if the token is invalid or missing.

---

### ✅ `models/`
This folder defines how the backend interacts with the database (via SQL).

- **`admin.model.js`**  
  Contains functions like `findByEmail` that talk to the `admins` table.

- **`student.model.js`**  
  Same as above, but for the `students` table. Includes CRUD functions like `create`, `getAll`, `getById`, etc.

---

### ✅ `routes/`
This folder defines URL endpoints (like `/api/students`, `/api/admins`, `/api/auth`) and maps them to controller functions.

- **`admin.routes.js`**  
  Routes for admin login and registration (`/api/admins/login`, etc.)

- **`auth.routes.js`**  
  Routes for shared login/register logic (usually `/api/auth/register`, `/api/auth/login`).

- **`student.routes.js`**  
  Routes for CRUD operations on students (`GET`, `POST`, `PUT`, `DELETE`).

---

### ✅ `uploads/`
- Can be used to store uploaded files like profile pictures, PDFs, etc.
- You’d typically use this with something like `multer` for file upload handling.

---

### ✅ `.env`
- Stores **sensitive environment variables** like:
  - `PORT`
  - `DB_HOST`, `DB_USER`, `DB_PASS`, etc.
  - `JWT_SECRET`
- Keeps these values out of your main source code for security.

---

### ✅ `package.json` and `package-lock.json`
- Track your installed dependencies like `express`, `mysql2`, `jsonwebtoken`, `cors`, etc.
- Also includes start scripts (e.g. `node server.js` or `nodemon`).

---

### ✅ `README.md`
- A documentation file to explain how to install, run, and understand your project.
- Helpful for your teammates, teachers, and future you! 😄
