# Patient Health Assessment & AI Wellness Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

A comprehensive, full-stack medical health reporting system featuring role-based dashboards, automated Excel/CSV data ingestion, real-time health metric delta tracking, and **Google Gemini AI integration** for highly personalized wellness insights.

---

## 🔗 Live Deployments & Repositories

- **Frontend Repository:** [Harsh5820/Health-Assessment-Frontend](https://github.com/Harsh5820/Health-Assessment-Frontend)
- **Backend Repository:** [Harsh5820/Health-Assessment-Backend](https://github.com/Harsh5820/Health-Assessment-Backend)
- **Frontend Live URL:** *(Vercel)* `[ADD YOUR VERCEL LINK HERE]`
- **Backend API URL:** *(Render)* [https://health-assessment-backend-0199.onrender.com](https://health-assessment-backend-0199.onrender.com)

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Secure JWT authentication isolating regular Patients from Clinic Administrators.
- **Bulk Data Ingestion (Admin):** Admins can upload `Excel (.xlsx)` or `CSV` files containing thousands of new clients or health reports, which are instantly mapped to the NoSQL database.
- **Interactive Metric Tracking:** Patient reports visually highlight deficiencies or high/excess parameters. Automatically calculates the % growth/decline compared to the previous test.
- **Unified Medical Profiles:** Admins click "View Details" to see the exact dashboard the patient sees—eliminating context switching.
- **Personalized AI Health Coach:** Connects to Google's **Gemini-3.5-Flash** AI model. The system intelligently aggregates a patient's age, gender, medical conditions, and out-of-range metrics to generate real-time, actionable lifestyle and dietary tips.

---

## 🛠️ Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- [Google AI Studio API Key](https://aistudio.google.com/) (For Gemini integration)

### 1. Clone the Repositories
Since the frontend and backend are deployed in separate repositories, clone both into adjacent folders.
```bash
git clone https://github.com/Harsh5820/Health-Assessment-Backend.git
git clone https://github.com/Harsh5820/Health-Assessment-Frontend.git
```

### 2. Backend Setup
```bash
cd Health-Assessment-Backend
npm install
```

Create a `.env` file in the root of the backend folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_key
```

Run the backend server:
```bash
# For production
npm start

# For development (hot-reload)
npm run dev
```

### 3. Frontend Setup
```bash
cd Health-Assessment-Frontend
npm install
```

Create a `.env` file in the root of the frontend folder and add:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend client:
```bash
npm run dev
```
The application will start on `http://localhost:5173`.

---

## 🧑‍💻 Using the Application (Testing Guide)

### Logging In
By default, you can utilize the pre-seeded accounts:
- **Admin Access:** `admin@example.com` / `adminpassword`
- **Patient Access:** `user1@example.com` / `adminpassword`

### Uploading New Data (Admin)
1. Log in to the Admin Dashboard.
2. Click **"Download Excel Template"** to get the exact schema format.
3. Fill it out and upload it via the **Upload Data** (for new patients) or **Upload Test Results** (for new tests attached to existing patients) forms.
4. Refresh the patient directory to see the data instantly mapped and accessible!

### Generating AI Insights (Patient & Admin)
1. Navigate to a Patient's dashboard (or "View Details" via the Admin portal).
2. Below the Key Attributes grid, locate the **"Personalized AI Insights"** section.
3. Click the purple **Generate Insights** button.
4. The system sends the patient's demographics, primary goals, and failing medical tests securely to the Gemini API, returning a customized health regimen.
