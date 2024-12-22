# CamaraEvents - Event Management System

## Project Overview
CamaraEvents is a comprehensive event management system designed for Camara Education Ghana. The platform allows users to browse, RSVP to events, and administrators to manage events and users efficiently. Features include event categorization (workshops, seminars, sports, club activities), real-time capacity tracking, and personalized user dashboards.

## Deployment Links
- Frontend: [CamaraEvents Frontend](https://camaraevents-frontend.onrender.com)
- Backend API: [https://camaraevents-backend.onrender.com/api](https://camaraevents-backend.onrender.com/api)

## Test Login Credentials

### Regular User
- Email: `test@camara.com`
- Password: `test123`

### Administrator
- Email: `admin@camara.com`
- Password: `admin`

## ✅ Feature Checklist

### User Features
- [x] User Registration and Authentication
- [x] Browse Available Events
- [x] RSVP to Events
- [x] View Personal Dashboard
- [x] Manage Event Preferences
- [x] Cancel Event RSVPs
- [x] Interactive Calendar View

### Admin Features
- [x] Create and Manage Events
- [x] View All RSVPs
- [x] Cancel User RSVPs
- [x] User Management
- [x] Dashboard Analytics
- [x] Event Category Management

## Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git


## API Documentation

### Authentication Endpoints
- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login
- GET `/api/users/me` - Get user profile

### Event Endpoints
- GET `/api/events` - Get all events
- POST `/api/events` - Create new event (Admin only)
- POST `/api/events/:id/rsvp` - RSVP to event
- GET `/api/events/my-events` - Get user's RSVPed events

### Admin Endpoints
- POST `/api/admin/create` - Create admin user

## API Testing Screenshots

### User Authentication
![Authentication Tests](path_to_auth_screenshot.png)

### Event Management
![Event Tests](path_to_event_screenshot.png)

### Admin Operations
![Admin Tests](path_to_admin_screenshot.png)

## Security Features
- JWT Authentication
- Password Hashing
- Role-based Access Control
- Input Validation
- Error Handling

## Technologies Used
- Backend: Node.js, Express.js, MongoDB
- Frontend: HTML5, CSS3, JavaScript
- Authentication: JWT
- Database: MongoDB Atlas
- Deployment: Render (Backend) (frontend)
