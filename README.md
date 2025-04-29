# Queen City Connect

A full-stack web application built with **Node.js**, **Express.js**, and **MongoDB** for managing and organizing events. This application allows users to create, view, edit, and delete events with a user-friendly interface.

## Features

- **Dynamic Views**: Utilized **EJS templates** for rendering dynamic and responsive web pages.
- **RESTful Routes**: Implemented CRUD operations for event management.
- **User Authentication**: Integrated session-based authentication with **express-session** and **connect-mongo**.
- **File Uploads**: Integrated **Multer** for secure image uploads.
- **Database Integration**: Connected to **MongoDB Atlas** using **Mongoose** for schema-based data modeling.
- **Middleware**: Used **Morgan** for logging, **Method-Override** for HTTP method support, and custom middlewares for authentication and validation.
- **Error Handling**: Custom 404 and server error pages for enhanced user experience.
- **Responsive Design**: Styled with **CSS** for a clean and intuitive interface.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, CSS
- **Database**: MongoDB Atlas
- **Middleware**: Morgan, Method-Override, Multer, connect-flash

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kshitijnatu/Queen-City-Connect.git
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
- Sign up or log in to access user-specific features like creating and managing events.
- Upload images for events.

## Project Structure

```
Queen-City-Connect/
├── app.js              # Main application file
├── package.json        # Project metadata and dependencies
├── .env                # Environment variables
├── .gitignore          # Ignored files
├── controllers/        # Controller files for handling business logic
│   ├── eventController.js
│   ├── mainController.js
│   └── userController.js
├── middlewares/        # Custom middleware for authentication and validation
│   ├── auth.js
│   └── validator.js
├── models/             # Mongoose models for MongoDB collections
│   ├── event.js
│   └── user.js
├── public/             # Static assets (CSS, images, etc.)
│   ├── css/
│   ├── images/
│   └── javascript/
├── routes/             # Route handlers for main, event, and user routes
│   ├── eventRoutes.js
│   ├── mainRoutes.js
│   └── userRoutes.js
├── views/              # EJS templates for rendering pages
│   ├── event/
│   ├── user/
│   ├── partials/
│   ├── about.ejs
│   ├── contact.ejs
│   ├── error.ejs
│   └── index.ejs
└── README.md           # Project documentation
```

## Error Handling

- Custom 404 page for routes that do not exist.
- Graceful handling of server errors with detailed error messages.
