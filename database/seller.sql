
CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  personName VARCHAR(255) NOT NULL,
  businessName VARCHAR(255) NOT NULL,
  foodLicense VARCHAR(255),  -- Adjust data types if needed (e.g., BLOB for large images)
  paymentMode VARCHAR(255) NOT NULL,
  businessImage VARCHAR(255),  -- Adjust data types if needed (e.g., BLOB for large images)
  location VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,  -- Add UNIQUE constraint if you want unique emails
  password VARCHAR(255) NOT NULL
);

