# Event Management System

A comprehensive, community-driven web platform that connects **event organizers** with **volunteers**. The system simplifies event creation, volunteer registration, participation tracking, and communication through automated workflows and analytics.

---

## 📌 Overview

The Event Management System enables organizers to efficiently manage community events while providing volunteers with an intuitive way to discover, register, and participate in events. The platform supports secure role-based access, automated email notifications, and real-time insights to ensure smooth event execution.

---

## 🚀 Features

### 👤 For Organizers
- **Event Management**  
  Create, update, view, and delete community events with full CRUD support.

- **Volunteer Tracking**  
  Real-time access to registered volunteers and confirmed participants.

- **Event Analytics**  
  Visual dashboards displaying registration trends and capacity utilization.

- **Automated Notifications**  
  Email alerts for new volunteer registrations and volunteer withdrawals.

---

### 🤝 For Volunteers
- **Event Discovery**  
  Browse and filter events by status: upcoming, ongoing, or completed.

- **Easy Registration**  
  Register for events or withdraw seamlessly when plans change.

- **Check-in System**  
  Simple self check-in during event participation.

- **Feedback & Ratings**  
  Submit ratings and feedback to help organizers improve future events.

---

### ⚙️ System-Wide Capabilities
- **Automated Email Reminders**  
  Scheduler sends reminders:
  - 3 days before the event  
  - 1 day before the event  
  - On the event day

- **Secure Authentication**  
  Session-based login with role-based access control for Organizers and Volunteers.

- **Responsive User Interface**  
  Modern and interactive UI optimized for all screen sizes.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 4.0.0  
- **Language:** Java 21  
- **Database:** MySQL with Spring Data JPA  
- **Email Templating:** Thymeleaf  
- **Utilities:** Lombok  

---

### Frontend
- **Framework:** React 19 (Vite)  
- **Styling:** Tailwind CSS  
- **Animations:** Framer Motion  
- **Charts & Analytics:** Recharts  
- **Routing:** React Router DOM  

---

## 📂 Project Structure

### Backend

controller/ - REST APIs for events and user operations
service/ - Business logic, registration flow, and email handling
scheduler/ - Cron jobs for automated email reminders
model/ - JPA entities (Users, Events, Registrations)


### Frontend
src/pages/ - Application pages (Dashboard, Event Details, Profile)
src/context/ - Authentication and role management
src/api/ - Axios configuration for backend communication


---

## 🔧 Getting Started

### Prerequisites
- Java 21 or higher  
- Node.js  
- MySQL  

---

### Backend Setup
1. Navigate to the backend directory.
2. Configure database and SMTP credentials in:

src/main/resources/application.properties

3. Run the application:
```bash
./mvnw spring-boot:run

Frontend Setup

Navigate to the frontend directory.

Install dependencies:
npm install

Start the development server
npm run dev
