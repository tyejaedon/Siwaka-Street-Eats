const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise'); // Using promises for cleaner async handling

const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from specific folders
app.use(express.static(path.join(__dirname)));  // Public files (e.g., seller_reg.html)
// User-specific files (e.g., homepage_user.html)

// Configure Multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only jpg, jpeg, and png files allowed.'));
    }
  },
});

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'seller',
});
// Handle registration form submission
app.post('/submit', upload.fields([
  { name: 'foodLicense', maxCount: 1 },
  { name: 'businessImage', maxCount: 1 }
]), (req, res) => {
  const { personName, businessName, paymentMode, location, email, password } = req.body;
  const foodLicensePath = req.files?.foodLicense?.[0]?.path;
  const businessImagePath = req.files?.businessImage?.[0]?.path;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert form data into MySQL
  const query = 'INSERT INTO registrations (personName, businessName, foodLicense, paymentMode, businessImage, location, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [personName, businessName, foodLicensePath, paymentMode, businessImagePath, location, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error saving to database:', err);
      return res.status(500).send('Error saving to database');
    }
    res.send('Form submitted successfully');
    res.redirect('/index.html')
  });
});

// Serve the registration form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'seller_reg.html'));
});

// Serve the registration form (unchanged)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'seller_reg.html'));
});

// Handle login request
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Connect to the database
    const connection = await pool.getConnection();

    // Query to find the user by email
    const query = 'SELECT * FROM registrations WHERE email = ?';
    const [results] = await connection.execute(query, [email]);

    // Release the connection back to the pool
    connection.release();

    if (results.length === 0) {
      return res.status(401).send('Invalid email or password'); // Unauthorized
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.redirect('/homepage_user.html');
      

      //  authorized
    }else{
    
      
    
      return res.redirect('/index.html')
    }

    // Login successful, redirect to homepage


  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Serve the login form (assuming it's in index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the homepage (assuming it's a separate file)
app.get('/homepage_user', (req, res) => {
  res.sendFile(path.join(__dirname));  // Assuming homepage.html exists
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
