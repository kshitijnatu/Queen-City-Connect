# Event Management Web Application

A full-stack web application built with **Node.js**, **Express.js**, and **MongoDB** for managing and organizing events. This application allows users to create, view, edit, and delete events with a user-friendly interface.

## Features

- **Dynamic Views**: Utilized **EJS templates** for rendering dynamic and responsive web pages.
- **RESTful Routes**: Implemented CRUD operations for event management.
- **File Uploads**: Integrated **Multer** for secure image uploads (if applicable).
- **Database Integration**: Connected to **MongoDB Atlas** using **Mongoose** for schema-based data modeling.
- **Middleware**: Used **Morgan** for logging, **Method-Override** for HTTP method support, and **Express static** for serving static assets.
- **Error Handling**: Custom 404 and server error pages for enhanced user experience.
- **Responsive Design**: Styled with **CSS** for a clean and intuitive interface.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, CSS
- **Database**: MongoDB Atlas
- **Middleware**: Morgan, Method-Override, Multer

## Installation

1. Clone the repository:
   ```bash
   https://github.com/kshitijnatu/Queen-City-Connect.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Queen-City-Connect
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   nodemon app
   ```
5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Navigate to the homepage to view all events.
- Create a new event by filling out the event form.
- Edit or delete existing events using the respective options.
- Upload images for events (if applicable).

## Project Structure

```
Natu_KshitijProject3/
├── public/             # Static assets (CSS, images, etc.)
├── routes/             # Route handlers for main and event routes
├── views/              # EJS templates for rendering pages
├── app.js              # Main application file
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## Error Handling

- Custom 404 page for routes that do not exist.
- Graceful handling of server errors with detailed error messages.
