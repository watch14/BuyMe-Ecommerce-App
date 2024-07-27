# BuyMe

BuyMe is an e-commerce platform dedicated to gamers and tech enthusiasts. Our website specializes in offering a wide range of gaming materials, including keyboards, mice, monitors, and PCs. Designed with a user-friendly interface, BuyMe aims to provide a seamless shopping experience for all gaming needs.

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture & Technologies](#architecture--technologies)
3. [Development Report](#development-report)
4. [App Overview](#app-overview)
5. [Conclusion](#conclusion)
6. [Acknowledgements](#acknowledgements)
7. [Getting Started](#getting-started)

## Introduction

BuyMe is built to cater to the needs of gamers and tech enthusiasts by providing a platform with a wide range of products. Our team includes:

- **Maamoun Chebbi**: API development, authentication management, and error handling. [GitHub](https://github.com/maamounchebbi)
- **Iheb Chaoued**: Schema design, CRUD operations, and data integrity assurance.
- **Seif Eddine Ben Othman**: Component development, API integration, and ensuring responsive design.

## Architecture & Technologies

Our project utilizes the following technologies:

- **Frontend**: Angular
  - _Dynamic and responsive user interface_
- **Backend**: Node.js with Express
  - _Robust RESTful API for handling client requests_
- **Database**: MongoDB
  - _Flexible and scalable data storage_
- **File Storage**: Firebase
  - _Reliable storage for product images_
- **Payment Gateway**: Stripe
  - _Secure online transactions_

### Development Tools

- **Visual Studio Code**: Source-code editor
- **Postman**: API testing and debugging
- **Swagger**: API design, building, and documentation

## Development Report

### Successes

- **User-Friendly Interface**: Implemented a responsive and intuitive UI using Angular.
- **Robust Backend**: Developed a reliable RESTful API using Node.js and Express.
- **Efficient Data Management**: Employed MongoDB with Mongoose for flexible data storage and management.
- **Effective Collaboration**: Leveraged agile methodologies for efficient development and iterative improvements.

### Challenges

- Managing complex data relationships in MongoDB required extensive schema validation to ensure data consistency.

### Lessons Learned

- The importance of communication and collaboration within the team was emphasized throughout the project.

## App Overview

- **Home Page**: Overview of the platform and featured products.
- **Shop Page**: Browse and search for products.
- **Product Page**: Detailed view of individual products.
- **Cart Page**: Manage selected items before checkout.

## Conclusion

Developing BuyMe was both rewarding and challenging. The project allowed us to improve our technical skills and demonstrated the value of teamwork in software development. We built a user-friendly e-commerce platform using Angular, Node.js, Express, MongoDB, and Firebase, overcoming data management and performance issues through agile methods and teamwork.

## Acknowledgements

Special thanks to ALX for providing this incredible learning opportunity. The guidance, resources, and support from ALX were invaluable in the successful completion of the BuyMe project. This experience has significantly contributed to our growth as developers and has prepared us for future challenges in our careers.

For more info: [Visit our project repository](https://github.com/watch14/E-Com-Project-Back-end)

---

## Getting Started

### Prerequisites

- Ensure you have Node.js and npm installed on your machine.

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   ```
2. **Install Dependencies**
   ```bash
   cd api && npm i
   cd ../client && npm i
   cd ../dashboard && npm i
   ```

### Hosting Servers

1. **Start Back-end**

   ```bash
   cd api
   npm start
   ```

   - Swagger API: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

2. **Start Front-end**

   ```bash
   cd client
   ng serve
   ```

   - Front-end: [http://localhost:4200](http://localhost:4200)

3. **Start Admin Dashboard**
   ```bash
   cd dashboard
   npm run electron
   ```
   - To create the app extension:
     ```bash
     npm run dist
     ```
     - The build will be located at: \`dashboard/dist/win-unpacked\` (Password: 123)
   - To host on localhost:
     ```bash
     ng serve --port 5000
     ```

## Contributors

- **Maamoun Chebbi**: [GitHub](https://github.com/maamounchebbi)
- **Iheb Chaoued**: [GitHub](https://github.com/ihebchaoued)
- **Seif Eddine Ben Othman**: [GitHub](https://github.com/seifeddinebenothman)
