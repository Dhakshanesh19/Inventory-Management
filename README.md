# Inventory Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) inventory management system with user authentication, role-based access control, and comprehensive inventory tracking features.

## Features

- **User Authentication & Authorization**
  - User registration and login
  - Session-based authentication
  - Role-based access control (Admin, Inventory Manager, Sales Staff, Purchase Staff)

- **Inventory Management**
  - Product catalog with SKU tracking
  - Stock level monitoring
  - Low stock alerts
  - Product variants support
  - Batch tracking for perishable items

- **Supplier & Customer Management**
  - Supplier information tracking
  - Customer database
  - Contact management

- **Purchase & Sales Management**
  - Purchase order creation
  - Sales order processing
  - GRN (Goods Received Note) management
  - Invoice generation

- **Reporting & Analytics**
  - Sales reports
  - Stock summary reports
  - Low stock alerts

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd inventory1
```

### 2. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory:
```bash
# Create .env file
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventory_management
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

### 3. Frontend Setup

Navigate to the client directory:
```bash
cd ../client
```

Install dependencies:
```bash
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system. If you're using MongoDB locally, start the MongoDB service:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
```

## Running the Application

### 1. Start the Backend Server

In the server directory:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Start the Frontend Application

In the client directory (open a new terminal):
```bash
npm start
```

The React app will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Default User Setup

After starting the application for the first time, you can register a new user through the registration page. The first user will have default permissions.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/current-user` - Get current user info

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer

### Purchases
- `GET /api/purchases` - Get all purchase orders
- `POST /api/purchases` - Create new purchase order

### Sales
- `GET /api/sales` - Get all sales orders
- `POST /api/sales` - Create new sales order

## Project Structure

```
inventory1/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/           # API functions
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Main server file
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGO_URI in your .env file
   - Verify MongoDB is accessible on the specified port

2. **Port Already in Use**
   - Change the PORT in the .env file
   - Kill processes using the default ports

3. **CORS Errors**
   - The backend is configured to allow requests from `http://localhost:3000`
   - Ensure both frontend and backend are running on the correct ports

4. **Session Issues**
   - Clear browser cookies and local storage
   - Restart both frontend and backend servers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
