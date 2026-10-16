# CampusDesk: Thapar Classroom Availability & Scheduling Platform

> **Software Engineering Course Project (UCS503P — B.Tech SEM V)**  
> **Institution:** Thapar Institute of Engineering & Technology, Patiala  
> **Repository:** [https://github.com/aditya-sharma-devs/CampusDesk](https://github.com/aditya-sharma-devs/CampusDesk)

---

## 👥 Team Members

| Roll Number | Name | Role / Focus |
|:---:|:---|:---|
| **1024160126** | **Aditya Sharma** | Full-Stack Architecture, Availability Engine & API Integration |
| **1024160121** | **Lakshay Jindal** | Frontend UI/UX, Component Design & State Management |
| **1024160112** | **Harshveer** | Database Schema, Timetable Normalization & Data Modeling |
| **1024160115** | **Aditya Chopra** | Maintenance & Complaint Ticketing System, Quality Assurance |

---

## 📌 1. Project Overview & Problem Statement

At **Thapar Institute of Engineering & Technology (TIET)**, faculty members, lab instructors, and student organization heads frequently need to identify empty classrooms to conduct makeup lectures, extra tutorial sessions, guest seminars, hackathons, or student club activities. 

Historically, locating an available lecture hall required manually browsing through multiple paper timetables or PDF spreadsheets distributed across distinct academic blocks. This manual procedure is inefficient, time-consuming, and prone to double-booking conflicts.

**CampusDesk** solves this challenge by ingesting the institute's fixed weekly timetable dataset and coupling it with an intelligent availability calculation engine. The system provides an interactive, real-time dashboard displaying block-wise classroom occupancy, future slot filtering, and facility maintenance reporting.

---

## ✨ 2. Key Features

- 🏫 **Dynamic Academic Block Classification:** Automatically parses and categorizes rooms (T106 → **T Block**, LT303 → **LT Block**, F201 → **F Block**, E104 → **E Block**, L302 → **L Block**, LP109 → **LP Block**) using dynamic regex extraction rather than hardcoded static arrays.
- ⚡ **Real-Time & Future Availability Calculation:** Converts timestamps into normalized minutes from midnight to evaluate exact room occupancy for any day of the week and standard timetable time slots.
- 🔬 **Laboratory Exclusion Logic (Requirement 18):** Strictly excludes specialized lab sessions ([Lab]) from regular lecture hall occupancy calculations, ensuring accurate lecture room discovery.
- 🛠️ **Classroom Facility Complaint & Maintenance Engine:** Allows faculty and student heads to report broken projectors, audio equipment, or seating issues. Classrooms with active tickets are dynamically tagged as *Issue Reported* or *Under Maintenance*.
- 🛡️ **Role-Based Access Control (RBAC):** Built on JWT authentication with distinct privilege levels for **TEACHER**, **ORGANISATION_HEAD**, and **ADMIN** (with dedicated ticket resolution & governance workflows).
- 📅 **Detailed Classroom Timetable Drawer:** Interactive schedule modal allowing instant inspection of any room's complete Monday–Saturday lecture schedule.
- 🎨 **Modern Responsive UI:** Crafted with React 18, Tailwind CSS, custom popover dropdown filters, and light/dark theme persistence.

---

## 🛠️ 3. Tech Stack

- **Frontend (/code/client):**
  - **Framework:** React 18 + Vite 5
  - **Styling:** Tailwind CSS + PostCSS
  - **Icons:** Lucide React
  - **Navigation:** React Router DOM (v6)
  - **HTTP Layer:** Axios with Bearer Authorization interceptor

- **Backend (/code/server):**
  - **Runtime:** Node.js + Express.js 4
  - **Database & ODM:** MongoDB + Mongoose 8 (with graceful in-memory fallback)
  - **Authentication:** JSON Web Tokens (jsonwebtoken) + Password Hashing (cryptjs)
  - **Configuration:** Dotenv & CORS

---

## 📁 4. Repository Structure

This repository is organized according to the **TIET UCS503 Software Engineering Course Project Template**:

`
CampusDesk/
├── .github/
│   └── workflows/
│       └── mkdocs.yml                # CI/CD documentation build pipeline
├── assets/                           # Course logos, icons, and stylesheets
│   ├── icons/
│   ├── stylesheets/
│   └── theme-overrides/
├── code/                             # Full Application Source Code
│   ├── client/                       # React 18 + Vite frontend
│   ├── server/                       # Node.js + Express backend API
│   ├── package-lock.json
│   └── README.md                     # Application-level architecture notes
├── docs/                             # Project documentation for MkDocs
│   ├── criteria-for-project-selection.md
│   └── index.md
├── journals/                         # Weekly member logs & ticket resolutions
│   ├── 1024160126-Aditya-Sharma/
│   ├── 1024160121-Lakshay-Jindal/
│   ├── 1024160112-Harshveer/
│   └── 1024160115-Aditya_Chopra/
├── project-proposal/                 # LaTeX project proposal
│   ├── main.tex
│   └── main.pdf
├── project-report-final/             # Final project report workspace
│   └── TODO
├── project-report-prototype-stage/   # Prototype stage report workspace
│   └── TODO
├── .gitignore                        # Standard ignore rules (Python, LaTeX, Node)
├── Makefile                          # Build and MkDocs automation targets
├── mkdocs.yml                        # Documentation site configuration
├── pyproject.toml                    # Python metadata and tool configs
└── README.md                         # Main repository overview (this file)
`

---

## 🚀 5. Getting Started / Quickstart

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance (or MongoDB Atlas connection string)

### 1. Backend Setup
`ash
# Navigate to the server folder
cd code/server

# Install dependencies
npm install

# Start development server
npm run dev
`
*The server will start on http://localhost:5000 and automatically seed default users, classrooms, and timetable entries if running for the first time.*

### 2. Frontend Setup
`ash
# Open a new terminal and navigate to the client folder
cd code/client

# Install dependencies
npm install

# Start Vite development server
npm run dev
`
*Open your browser and navigate to http://localhost:3000.*

---

## 📡 6. Core REST API Endpoints

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| POST | /api/auth/signup | Public | Register new user account |
| POST | /api/auth/login | Public | Authenticate user and receive JWT token |
| GET | /api/auth/me | Private | Retrieve logged-in user profile |
| GET | /api/classrooms/availability | Public | Query availability with day, 	ime, lock, and search |
| GET | /api/classrooms/:roomNumber | Public | Retrieve single classroom details and weekly schedule |
| GET | /api/tickets | Private | List reported issues (filtered by status or room) |
| POST | /api/tickets | Private | Log a classroom maintenance complaint |
| PUT | /api/tickets/:id/status | Admin | Update complaint status (PENDING → UNDER_MAINTENANCE → RESOLVED) |
| GET | /api/timetable | Public | Query raw timetable entries |

---

## 🔮 7. Future Scope & Roadmap

- **Classroom Reservation Workflow:** Automated booking request submission for faculty and student organizations.
- **Admin Conflict Detection:** Automated conflict verification for booking approvals.
- **Push & Email Alerts:** Notification integration for reservation status updates and ticket resolution alerts.
