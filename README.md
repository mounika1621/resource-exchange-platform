# Resource Exchange Platform

## 🚀 Deployment

🌐 **Frontend:** https://resource-exchange-platform.vercel.app

⚙️ **Backend API:** https://resource-exchange-platform.onrender.com

❤️ **Backend Health Check:** https://resource-exchange-platform.onrender.com/api/health


A full-stack Software Engineering micro-project for sharing and exchanging resources. The implementation follows the project's Use Case, Class, ER, DFD, Activity, Sequence, Collaboration, State Chart, Component and Deployment models.

## Technology
- Frontend: React.js + JavaScript + Vite
- Backend: Java 21 + Spring Boot 3.5.16
- Database: MySQL
- API: REST
- Authentication: JWT + BCrypt
- Testing: Postman
- Version control: Git/GitHub

Spring Boot 3.5.16 is used because it is the final OSS release in the 3.5.x line as of June 2026.

## Main modules
- User registration/login
- JWT authentication and role-based access
- Profile management
- Resource CRUD
- Resource search and category filtering
- Exchange request lifecycle: PENDING -> ACCEPTED / REJECTED / CANCELLED -> COMPLETED
- Resource-owner request approval/rejection
- Admin user and request management
- MySQL persistence

## Project structure
```text
resource-exchange-platform/
├── backend/
├── frontend/
├── database/
├── docs/
└── README.md
```

## Prerequisites
1. Java 21
2. Maven 3.9+
3. MySQL 8+
4. Node.js 20+
5. Git

## 1. Database
Open MySQL:
```sql
CREATE DATABASE resource_exchange;
```
The application uses JPA `ddl-auto=update`, so the tables are created automatically.

Default database configuration:
```text
DB_URL=jdbc:mysql://localhost:3306/resource_exchange?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=root
```
If your MySQL password is different, change `DB_PASSWORD` or edit `backend/src/main/resources/application.properties` locally.

## 2. Start backend
Open terminal in `backend`:
```bash
mvn clean spring-boot:run
```
Backend:
```text
http://localhost:8080
```

A demo admin is automatically created on first startup:
```text
Email: admin@resourceexchange.com
Password: Admin@123
```
Change this password before any real deployment.

## 3. Start frontend
Open another terminal in `frontend`:
```bash
npm install
npm run dev
```
Open the Vite URL shown in the terminal, normally:
```text
http://localhost:5173
```

## 4. API examples
### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Mounika",
  "email": "mounika@example.com",
  "password": "Pass@123",
  "phone": "9876543210"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "mounika@example.com",
  "password": "Pass@123"
}
```
Use the returned JWT as:
```text
Authorization: Bearer <token>
```

### Resources
```text
GET    /api/resources
GET    /api/resources/{id}
GET    /api/resources/mine
POST   /api/resources
PUT    /api/resources/{id}
DELETE /api/resources/{id}
PUT    /api/resources/{id}/availability?available=true
```

### Exchange requests
```text
POST /api/requests/{resourceId}
GET  /api/requests/mine
GET  /api/requests/owner
PUT  /api/requests/{id}/status
```
Status values:
```text
PENDING
ACCEPTED
REJECTED
CANCELLED
COMPLETED
```

### Admin
```text
GET /api/admin/users
PUT /api/admin/users/{id}/enabled?value=false
GET /api/admin/requests
PUT /api/admin/requests/{id}/status
DELETE /api/admin/resources/{id}
```

## GitHub setup
From the project root:
```bash
git init
git add .
git commit -m "Initial full-stack Resource Exchange Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resource-exchange-platform.git
git push -u origin main
```
Never commit real passwords, JWT secrets or `.env` files. Only commit `.env.example`.

## Suggested GitHub milestones
```text
1. Project setup and database
2. User authentication and JWT
3. Resource management
4. Search and filtering
5. Exchange request workflow
6. Admin dashboard
7. UI improvements and validation
8. Testing and documentation
```

## Mapping to Software Engineering diagrams
- Use Case -> user/admin features
- Class/ER -> User, Resource, ExchangeRequest and role-based Admin
- DFD -> REST controllers and database operations
- Activity -> resource request workflow
- Sequence -> authentication/search/request/review interactions
- Collaboration -> User/System/Admin object interactions
- State Chart -> ExchangeRequest status lifecycle
- Component -> frontend, backend services and database
- Deployment -> client, web/app server and MySQL deployment


