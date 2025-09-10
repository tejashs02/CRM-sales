# 📊 CRM for Sales Teams

A simple yet powerful CRM system built for sales teams with role-based access control.  
Sales reps can manage their own leads and opportunities, while managers get full visibility into all team data.

---

## ✨ Features

### 🔐 Authentication & RBAC
- JWT-based authentication  
- Role-based access control (Sales Rep vs Manager)  
- Secure login/register  

### 📝 Leads Management (CRUD)
- Create new leads  
- View leads with role-based filtering  
- Edit leads (inline form)  
- Delete leads with confirmation  
- Convert leads to opportunities  

### 💼 Opportunities Management (CRUD)
- View opportunities with filtering  
- Update opportunity stage  
- Delete opportunities  

### 🎯 Role-Based Views
- Sales Rep: Only own data  
- Sales Manager: All team data  

---

## 🛠 Tech Stack

**Backend**
- Node.js + Express  
- JWT authentication  
- File-based database (JSON)  

**Frontend**
- Next.js 15 + React 18  
- Tailwind CSS for styling  
- Axios for API calls  

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` – User login  
- `POST /api/auth/register` – User registration  

### Leads
- `GET /api/leads` – Get all leads (role-filtered)  
- `POST /api/leads` – Create new lead  
- `PUT /api/leads/:id` – Update lead  
- `DELETE /api/leads/:id` – Delete lead  
- `POST /api/leads/:id/convert` – Convert lead to opportunity  

### Opportunities
- `GET /api/opportunities` – Get all opportunities (role-filtered)  
- `POST /api/opportunities` – Create opportunity  
- `PUT /api/opportunities/:id` – Update opportunity  
- `DELETE /api/opportunities/:id` – Delete opportunity  

---

## ⚙️ Installation & Setup

### Backend
```bash
cd backend
npm install
npm start

### Frontend

cd frontend
npm install
npm run dev

👥 Test Credentials

Sales Rep

Email: virat@test.com

Password: 123456

Sales Manager

Email: dhoni@test.com

Password: 123456

✅ Success Criteria

Reps can login and see only their leads/opportunities

Managers can login and see all data

Leads CRUD operations work

Convert Lead → Opportunity works

Opportunities stage update works

Frontend forms/tables working end-to-end

🔧 Development Notes
Uses file-based JSON storage for simplicity

Includes comprehensive error handling

Features responsive design for mobile devices

Includes loading states and user feedback

Has proper validation for all inputs

📞 Support
For technical support or questions about this implementation, please refer to the code documentation or create an issue in the GitHub repository.

📄 License
This project was developed as part of an internship assessment assignment.
