# Thapar Classroom Availability & Scheduling Platform

> **Software Engineering Project (B.Tech SEM V)**  
> **Institution:** Thapar Institute of Engineering & Technology, Patiala  
> **Tech Stack:** MongoDB, Express.js, React (Vite), Node.js, Tailwind CSS, JWT Authentication  

---

## 📌 1. Project Overview & Problem Statement

At Thapar Institute of Engineering & Technology, teachers and student organization heads frequently need to locate empty classrooms for conducting guest lectures, makeup classes, study workshops, or student events. Manually inspecting multiple paper/PDF timetables across different academic blocks is inefficient and error-prone.

The **Thapar Classroom Availability & Scheduling Platform** solves this problem by ingesting the institute's fixed weekly timetable data and providing a real-time, block-wise classroom occupancy dashboard. Users can inspect currently available classrooms or search for free slots on any day and time.

---

## ✨ 2. Key Features

- 🏫 **Dynamic Academic Block Classification**: Automatically parses room numbers (`T106` → **T Block**, `LT303` → **LT Block**, `F201` → **F Block**, `E104` → **E Block**, `L302` → **L Block**, `LP109` → **LP Block**) using a reusable regex parser instead of hardcoded lists.
- ⚡ **Real-Time & Future Availability Engine**: Normalizes time slots into 24-hour minutes from midnight to evaluate exact occupancy at any given moment or future time slot.
- 🔬 **Laboratory Exclusion Logic**: Strictly enforces Requirement 18 by excluding `[Lab]` sessions from regular lecture hall occupancy calculations.
- 🎨 **Custom Component Filter UI**: Sleek, modern custom popover dropdowns for Day of Week and Time Slot selection, styled with Tailwind CSS instead of native browser selects.
- 🌙 **Modern Light / Dark Mode System**: Custom theme switcher with local storage persistence and clean SaaS aesthetic.
- 🔐 **JWT Authentication & Role-Based Authorization**: Secure password hashing via `bcryptjs`, JWT session persistence (7 days), auto-user creation foundation, and role definitions for **TEACHER**, **ORGANISATION_HEAD**, and **ADMIN**.
- 📅 **Detailed Classroom Timetable Drawer**: Interactive schedule modal displaying all scheduled lectures for a selected room across Monday through Saturday.

---

## 🛠️ 3. Technology Stack

### Frontend (`/client`)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Dark Theme System + Custom Dropdown Popovers
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with Bearer Authorization interceptor

### Backend (`/server`)
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ORM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Configuration**: Dotenv (`dotenv`) & CORS (`cors`)

---

## 📁 4. Folder Structure

```
D:\B.Tech\SEM V\SE\SE_Project\
├── README.md               # Complete Project Documentation
├── client/                 # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Navbar, ClassroomCard, ScheduleModal, CustomSelect, ThemeToggle, ProtectedRoute
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── pages/          # LandingPage, LoginPage, SignupPage, DashboardPage, NotFoundPage
│   │   ├── services/       # Axios API client
│   │   ├── utils/          # Time formatting & slot utilities
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── server/                 # Node.js + Express Backend API
    ├── config/
    ├── controllers/        # authController, classroomController, timetableController
    ├── data/               # sampleTimetable.js (Thapar dataset)
    ├── middleware/         # authMiddleware (JWT & Role authorization)
    ├── models/             # User, Classroom, TimetableEntry
    ├── routes/             # authRoutes, classroomRoutes, timetableRoutes
    ├── services/           # availabilityService (Core calculation engine)
    ├── utils/              # blockUtils.js, timeUtils.js, autoSeed.js
    ├── .env.example
    ├── .env
    ├── app.js
    ├── seed.js             # Database Seeding Script
    ├── server.js
    └── package.json
```

---

## 🚀 5. Installation & Setup Instructions

### Step 1: Backend Setup

1. Open terminal in the `server` directory:
   ```bash
   cd D:\B.Tech\SEM V\SE\SE_Project\server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000` and automatically seed default users, classrooms, and timetable entries if running for the first time.*

---

### Step 2: Frontend Setup

1. Open a new terminal in the `client` directory:
   ```bash
   cd D:\B.Tech\SEM V\SE\SE_Project\client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## ⚙️ 6. Dynamic Block Extraction & Availability Engine

### Academic Block Parser (`blockUtils.js`)
Rather than relying on static arrays, the platform inspects room strings dynamically using regex prefix extraction:
```js
function extractBlockFromRoom(roomNumber) {
  const match = roomNumber.trim().toUpperCase().match(/^([A-Z]+)/);
  return match ? `${match[1]} Block` : 'General Block';
}
```
- `T106` → **T Block**
- `LT303` → **LT Block**
- `F201` → **F Block**
- `E104` → **E Block**
- `L302` → **L Block**
- `LP109` → **LP Block**

---

### Availability Calculation Algorithm (`availabilityService.js`)
1. Converts the target day and time into minutes from midnight (e.g., `10:30 AM` → `630 mins`).
2. Fetches weekly timetable entries matching the target day.
3. **Lab Exclusion Rule**: Filters out `type: 'LAB'` and `[Lab]` tagged entries.
4. Checks slot overlap: `startTimeMinutes <= targetMinutes && targetMinutes < endTimeMinutes`.
5. Returns `AVAILABLE` or `OCCUPIED` status along with current subject, batch, faculty, and full day schedule.

---

## 📡 7. API Endpoint Documentation

### Authentication APIs
- `POST /api/auth/signup` — Register new user account.
- `POST /api/auth/login` — Authenticate user and receive JWT token.
- `GET /api/auth/me` — Retrieve logged-in user profile (Requires `Bearer Token`).

### Classroom & Availability APIs
- `GET /api/classrooms/availability` — Query availability report with params: `day`, `time`, `block`, `search`.
- `GET /api/classrooms/:roomNumber` — Retrieve single classroom details and complete weekly timetable.

### Timetable APIs
- `GET /api/timetable` — Query raw timetable entries by `day`, `batch`, or `type`.

---

## 🔮 8. Future Scope (Reservation & Approvals)

The current development phase focuses on the **Classroom Availability Engine, Timetable Processing, Authentication, and Responsive UI/UX**.

Future features (clearly tagged in the UI as *"Coming Soon"*):
1. **Permission Request Workflow**: Faculty and Student Heads submitting formal usage requests.
2. **Admin Approval Interface**: Instant approve/reject dashboard with conflict detection.
3. **Real-time Push Notifications**: Email and SMS alerts for venue approvals.
