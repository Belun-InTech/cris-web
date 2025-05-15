# CRIS

CRIS is an Angular application, designed to demonstrate various features and functionalities.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: You need Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **Angular CLI**: Install Angular CLI globally using npm:
  ```bash
  npm install -g @angular/cli
  ```
- **Docker**: Ensure Docker is installed and running if you plan to use Docker.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Belun-InTech/cris-web
   cd cris-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running Locally

To run the application on your local machine, follow these steps:

1. **Start the Angular Development Server**:
   ```bash
   ng serve
   ```
   The application will be available at `http://localhost:4200`.

## Running with Docker

1. **Build the Docker image**:
   ```bash
   docker build -t cris-demo .
   ```

2. **Run the Docker container**:
   ```bash
   docker run -p 80:80 cris-demo
   ```
   The application will be accessible at `http://localhost`.

## Testing

To run tests, execute the following command:
```bash
ng test
```

## Linting

To lint the project, use:
```bash
ng lint
```


