const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const helmet = require('helmet');
const csurf = require('csurf'); // CSRF protection
const cookieParser = require('cookie-parser'); // Needed for CSRF cookies
const fs = require('fs');
const https = require('https');
const http = require('http');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cookieParser()); // Parses cookies for CSRF protection
app.use(csurf({ cookie: true })); // Enable CSRF protection with cookies

// CSRF error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // CSRF token validation failed
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  next(err);
});

// Set up a route to provide CSRF token to clients
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Database Connection
connectDB();

// Secure HTTPS server setup
const privateKey = fs.readFileSync('C:\\Users\\lab_services_student\\employee-payments-portal\\backend\\Keys\\privatekey.pem', 'utf8');
const certificate = fs.readFileSync('C:\\Users\\lab_services_student\\employee-payments-portal\\backend\\Keys\\certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// HTTPS server
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
});

// HTTP server that redirects to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log('HTTP server running on port 80 and redirecting to HTTPS');
});
