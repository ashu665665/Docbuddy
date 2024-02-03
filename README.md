# Docbuddy - Clinic Management System

Docbuddy is a clinic management system designed to help small clinic doctors manage their patients and automate the generation of patient letter pads. This application is built with Node.js, Express.js, and MySQL for database management. Users can set up the application using MySQL locally or utilize Docker for a quick and easy deployment.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setting Up MySQL Locally](#setting-up-mysql-locally)
  - [Running with Docker](#running-with-docker)
- [Usage](#usage)
- [Configuration](#configuration)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Getting Started

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MySQL](https://www.mysql.com/) (for local setup)
- [Docker](https://www.docker.com/) (for Docker setup)

### Setting Up MySQL Locally

1. Create a MySQL database named `docbuddy`.
2. Update the database configuration in the `.env` file with your MySQL credentials:

   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=docbuddy
   DB_PORT=3306
   SECRET_KEY=ASHUSINGH
   EXPIRES_IN=3000s
   ```

3. Run the following commands:

   ```bash
   npm install
   npm run migrate
   ```

### Running with Docker

Ensure Docker is installed on your machine.

1. Create a `.env` file with the following content:

   ```env
   DB_HOST=db
   DB_USER=root
   DB_PASSWORD=root
   DB_DATABASE=docbuddy
   DB_PORT=3306
   SECRET_KEY=ASHUSINGH
   EXPIRES_IN=3000s
   ```

2. Run the application using Docker:

   ```bash
   docker-compose up --build
   ```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Usage

1. Open a web browser and go to [http://localhost:3000](http://localhost:3000).
2. Log in using your credentials.
3. Manage patients and generate letter pads efficiently.

## Configuration

- **Database:** The application uses MySQL for data storage. Configure the database connection details in the `.env` file.

## Features

- **Patient Management:** Add, edit, and delete patient records.
- **Letter Pad Automation:** Automatically generate patient letter pads with customizable templates.
- **User Authentication:** Secure login system for authorized access.

## Technologies Used

- **Node.js:** JavaScript runtime for server-side development.
- **Express.js:** Web application framework for Node.js.
- **MySQL:** Relational database for storing application data.
- **Docker:** Containerization for easy deployment.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Special thanks to [Docker](https://www.docker.com/) for providing containerization support.
