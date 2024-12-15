# Music Library Management API

## Project Overview
A robust, scalable Music Library Management API built with Node.js, TypeScript, Express, and PostgreSQL.

## Features
- Role-based Authentication (Admin, Editor, Viewer)
- CRUD Operations for Users, Artists, Albums, Tracks
- Favorites Management
- Secure JWT Authentication
- Comprehensive Error Handling

## Prerequisites
- Node.js (v14+)
- PostgreSQL
- npm/yarn

## Installation

1. Clone the repository
```bash
git clone webName
cd music-library-api
```

2. Install Dependencies
```bash
npm install
```

3. Set up PostgreSQL Database
- Create a new database named `music_library`
- Update `.env` with your database credentials

4. Environment Configuration
Copy `.env.example` to `.env` and fill in your details:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=music_library
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secure_secret
JWT_EXPIRATION=1h
PORT=3000
```

5. Run Migrations
```bash
npm run migrate
```

6. Start the Server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /signup`: Register a new user
- `POST /login`: User login

### Users (Admin Only)
- `GET /users`: List all users
- `POST /users/add-user`: Add new user
- `DELETE /users/:id`: Delete user
- `PUT /users/update-password`: Update user password

### Artists
- `GET /artists`: List artists
- `GET /artists/:id`: Get specific artist
- `POST /artists/add-artist`: Add artist
- `PUT /artists/:id`: Update artist
- `DELETE /artists/:id`: Delete artist

### Albums
- Similar endpoints as Artists

### Tracks
- Similar endpoints as Artists

### Favorites
- `GET /favorites/:category`: Get favorites
- `POST /favorites/add-favorite`: Add favorite
- `DELETE /favorites/remove-favorite/:id`: Remove favorite

## Authentication
- First registered user becomes Admin
- Use Bearer Token in Authorization header
- Roles: Admin (full access), Editor (modify), Viewer (read-only)

## Error Handling
- Consistent error responses
- Appropriate HTTP status codes
- Detailed error messages

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
```

## Security Practices
- Password hashing with bcrypt
- JWT for authentication
- Role-based access control
- Input validation
- Error handling
