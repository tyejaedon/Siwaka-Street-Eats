const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'seller_reg.html')));
app.use(express.static(__dirname));

// Configure Multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10000000 }, // Limit file size to 1MB
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

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'seller'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Handle form submission
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
      return res.status(500).send('Error saving to database');
    }
    res.send('Form submitted successfully');
  });
});

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'seller_reg.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
