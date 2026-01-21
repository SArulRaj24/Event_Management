Event Management System
A comprehensive web application for managing community events, designed to connect Organizers with Volunteers. This project features a Spring Boot backend and a React (Vite) frontend, providing real-time event tracking, automated email notifications, and detailed analytics.

🚀 Features
For Organizers
Event Lifecycle Management: Create, update, and delete events with automated notifications to all registered participants.

Participant Tracking: View real-time lists of registered volunteers and track actual event attendance via check-ins.

Analytics Dashboard: Access detailed insights including registration trends over time and capacity utilization.

Automated Communication: Automatically notify volunteers about event registrations, cancellations, or upcoming reminders.

For Volunteers
Event Discovery: Browse upcoming, ongoing, and completed events.

Registration System: Easily register for or withdraw from events.

Self Check-in: Securely check into events they are attending.

Profile Management: Update personal details and reset passwords securely.

System Capabilities
Automated Reminders: A background scheduler sends email alerts 3 days before, 1 day before, and on the day of an event.

Email Templating: Professional HTML emails for registrations, cancellations, and reminders powered by Thymeleaf.

Secure Authentication: Session-based authentication with role-based access control (RBAC).

🛠️ Tech Stack
Backend
Framework: Spring Boot 4.0.0

Language: Java 21

Database: MySQL with Spring Data JPA

Communication: Spring Mail & Thymeleaf

Utilities: Lombok for boilerplate reduction

Frontend
Framework: React 19 with Vite

Styling: Tailwind CSS

State Management: React Context API (AuthContext)

Icons & UI: Lucide React & Framer Motion

Data Visualization: Recharts for analytics

📂 Project Structure
Backend
Controllers: REST endpoints for user and event management.

Services: Core business logic, including registration flows and email triggers.

Scheduler: Automated tasks for sending event reminders.

DTOs: Data Transfer Objects for structured API communication.

Frontend
Pages: Login, Register, Dashboard, Create/Edit Event, Event Details, and Profile.

Context: Centralized authentication state management.

Components: Reusable UI elements like the Navigation Bar.

🔧 Getting Started
Prerequisites
Java 21 or higher

Node.js (latest LTS recommended)

MySQL Database

Backend Setup
Navigate to the Backend directory.

Configure your database and mail server in src/main/resources/application.properties.

Run the application using Maven:

Bash

./mvnw spring-boot:run
Frontend Setup
Navigate to the Frontend directory.

Install dependencies:

Bash

npm install
Start the development server:

Bash

npm run dev
