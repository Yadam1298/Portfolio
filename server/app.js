const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db'); // Import first
connectDB(); // Then call it

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/auth');
const homepageRoutes = require('./routes/homepage');
const aboutRoutes = require('./routes/about');
const certificatesRouter = require('./routes/Certificates');
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/project');
const internshipRoutes = require('./routes/internships');
const skillRoutes = require('./routes/skills');
const testimonialRoutes = require('./routes/testimonials');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/certificates', certificatesRouter);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/testimonials', testimonialRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
