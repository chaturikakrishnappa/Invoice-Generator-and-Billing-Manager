# InvoicePro+
## Smart Invoice Generator & Billing Management System

Welcome to the InvoicePro+ project repository. This is a complete, production-ready Full Stack web application built for a Final Year BCA Project.

### 🌟 Features
- **Smart Dashboard**: Visual analytics with charts using Chart.js. Track Revenue, Paid, Unpaid, and Overdue invoices.
- **Invoice Management**: Create, edit, and delete professional invoices. Dynamic item rows with auto-calculations for tax, discounts, and subtotals.
- **Client Management**: Save client details for quick reuse.
- **PDF Export**: One-click download of professional PDF invoices.
- **Authentication**: Secure JWT-based login and registration with bcrypt password hashing.
- **Premium UI/UX**: Built with Tailwind CSS, Framer Motion, and Glassmorphism design principles.

### 💻 Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Axios, React Router, Chart.js.
- **Backend**: Python, Flask, Flask-RESTful, Flask-JWT-Extended, PyMongo.
- **Database**: MongoDB Atlas.

---

## 🚀 Localhost Setup & Running Requirements

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (Local instance or Atlas URI)

### 1. Backend Setup
Navigate to the backend folder:
```bash
cd backend
```
Create and activate a virtual environment (optional but recommended):
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Configure Environment Variables:
Copy `.env.example` to `.env` and update the `MONGO_URI` and `JWT_SECRET_KEY`.
```bash
copy .env.example .env
```
Run the server:
```bash
python app.py
```
*The backend will start on http://localhost:5000*

### 2. Frontend Setup
Navigate to the frontend folder:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Configure Environment Variables:
Create a `.env` file in the `frontend` folder and add:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the development server:
```bash
npm run dev
```
*The frontend will be available at http://localhost:5173*

---

## 🌍 Deployment Guide
This project is ready for deployment.
- **Frontend (Vercel)**: Connect your GitHub repo to Vercel. Vercel will automatically detect the Vite React configuration. Use the included `vercel.json` for proper React Router rewrites.
- **Backend (Render)**: Connect your GitHub repo to Render as a "Web Service". Use the included `render.yaml` blueprint for automatic configuration.

---
*Developed as a BCA Final Year Project.*
