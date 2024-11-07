const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const helmet = require('helmet');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// Database Connection
connectDB();

// Secure HTTPS server setup
const privateKey = fs.readFileSync('C:\\Users\\lab_services_student\\employee-payments-portal\\backend\\Keys\\privatekey.pem', 'utf8');
const certificate = fs.readFileSync('C:\\Users\\lab_services_student\\employee-payments-portal\\backend\\Keys\\certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
