# KathmanduHostels - MERN Stack Application 🏠

A modern, responsive web application for listing hostels in Kathmandu, Nepal. Built with Nepali cultural theming and robust security features.

## Features

### 🏠 Public Features
- Browse hostels with search and filters
- Detailed hostel pages with image galleries
- Interactive maps with exact locations
- Owner contact information (phone, WhatsApp, social media)
- Share hostel listings
- Click tracking for popularity

### 👨‍💼 Admin Features
- Secure login with JWT authentication
- Complete hostel management (CRUD operations)
- Analytics dashboard with click tracking
- Image management with multiple URLs
- Featured hostel management

### 🎨 Design
- Nepali-inspired color theme (Deep Red, Saffron, Royal Blue)
- Fully responsive design
- Smooth animations with Framer Motion
- Modern, accessible UI components

### 🔒 Security
- JWT tokens in HttpOnly cookies
- bcrypt password hashing
- Rate limiting and CORS protection
- Input validation and sanitization
- Secure headers with Helmet

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Framer Motion
- React Router
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt
- Helmet, CORS, Rate Limiter
- Joi Validation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd KathmanduHostels
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
```bash
# In backend folder, create .env file
cp .env.example .env
# Edit .env with your configuration
```

5. Start the development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
KathmanduHostels/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
└── README.md
```

## API Endpoints

### Public
- `GET /api/hostels` - Get hostels with search/filter
- `GET /api/hostels/:id` - Get hostel details
- `POST /api/track/click` - Track hostel clicks

### Admin
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/hostels` - Create hostel
- `PUT /api/hostels/:id` - Update hostel
- `DELETE /api/hostels/:id` - Delete hostel
- `GET /api/admin/metrics` - Get analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.