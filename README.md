# Image Processing System

This project is an **Image Processing System** that asynchronously compresses image files by 50% quality. The system processes CSV files containing image URLs and other product-related data, validates the input, and provides a unique request ID to track the processing status. It supports MongoDB for storing image processing statuses and compressed image URLs and BullMQ for job queue handling.

## Features

- **Asynchronous Image Compression**: Images are processed in the background, reducing the quality by 50% for optimization.
- **CSV Validation**: Validates uploaded CSV files for proper format and data.
- **Unique Request ID**: Provides a unique request ID to track the status of image processing.
- **Status Tracking**: Allows users to check the status of the image processing tasks using a separate API.
- **BullMQ Integration (in-progress)**: Manages the processing of images using BullMQ for job queues.
- **MongoDB**: Flexible database integration for storing status and image information.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/thejayeshsoni/image-processing-service.git
   ```

2. Navigate to the project directory:

   ```bash
   cd imageprocessing
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create an .env file in the root directory and configure your environment variables:

   ```bash
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/imageprocessing
   REDIS_HOST=localhost
   REDIS_PORT=6379
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Scripts

- Start the production server:
  ```bash
  npm run start
  ```
- Start the development server:
  ```bash
  npm run dev
  ```
- Build the project:
  ```bash
  npm run dist
  ```
- Lint the code:
  ```bash
  npm run lint
  ```
- Fix linting issues:
  ```bash
  npm run lint:fix
  ```
- Check code formatting:
  ```bash
  npm run format:check
  ```
- Fix code formatting:
  ```bash
  npm run format:fix
  ```

# API Endpoints

1. Upload CSV

   - URL: /upload-csv
   - Method: POST
   - Description: Upload a CSV file with image URLs, product names, and serial numbers. The system validates the CSV and returns a request ID to track the status of the image compression.

   ### Example request:

   ```bash
   curl -X POST -F "file=@yourfile.csv" http://localhost:3000/upload
   ```

   ## Sample CSV File

   Below is a sample format of the CSV file that can be uploaded for image processing. The CSV should contain a serial number, product name, and a comma-separated list of image URLs.

   ```csv
   serial,name,urls
   1,nasa,"https://esahubble.org/media/archives/images/original/potw2049a.tif"
   2,img1,"https://images.unsplash.com/photo-1706430263184-c1f9ac844a54?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8fA%3D%3D,https://images.unsplash.com/photo-1720543227828-ec5ae842633a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTd8fHxlbnwwfHx8fHw%3D"
   3,img2,"https://images.pexels.com/photos/3536991/pexels-photo-3536991.jpeg?auto=compress&cs=tinysrgb&w=600,https://images.pexels.com/photos/3445219/pexels-photo-3445219.jpeg?auto=compress&cs=tinysrgb&w=600"
   ```

   <img width="1019" alt="upload-api-screenshot" src="https://github.com/user-attachments/assets/001c1b02-1c5a-464f-917f-6077902668ae">

2. Check Processing Status
   - URL: /check-status/:id
   - Method: GET
   - Description: Check the status of the image compression for a specific request ID. The status could be Pending, In Progress, or Completed. The response also includes the compressed image URLs once processing is complete.

   <img width="1007" alt="status-api" src="https://github.com/user-attachments/assets/cce8d7b2-97ea-48e5-844e-32dda50a8598">

# Technologies Used

- Node.js: Backend framework for handling API requests and processing logic.
- TypeScript: For type safety and better developer experience.
- Express: Minimalist web framework for building RESTful APIs.
- BullMQ: Job queue system for handling asynchronous image processing tasks.
- MongoDB: NoSQL database for storing processing statuses and image data.
- PostgreSQL: Relational database with Sequelize ORM for task status management.
- Sharp: High-performance image processing library used for compressing images.
- Cloudinary: Optional integration for image storage and manipulation.
- Redis: In-memory data structure store used by BullMQ for job queue management.
- Winston: Logging library for logging system events and errors.

## Contributing

If you'd like to contribute, please follow these steps:

- Fork the repository.
- Create a new branch.
- Make your changes.
- Submit a pull request.

# Author

Jayesh Soni
Feel free to reach out for any queries or contributions.

<img width="1387" alt="CloudinaryExplorer" src="https://github.com/user-attachments/assets/852cd0d7-3c50-4893-b7f7-8f8e6c061028">

<img width="912" alt="MongoDB Collection" src="https://github.com/user-attachments/assets/6e0948a1-fd0b-4482-8f96-e45a559c07ff">

