const fs = require('fs');
const path = require('path');

// Create .env file for server
const serverEnvContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventory_management
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
`;

const serverEnvPath = path.join(__dirname, 'server', '.env');

try {
  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('✅ Server .env file created successfully!');
} catch (error) {
  console.log('⚠️  Could not create server .env file. Please create it manually.');
  console.log('Content to add to server/.env:');
  console.log(serverEnvContent);
}

console.log('\n🚀 Setup Instructions:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Navigate to server directory: cd server');
console.log('3. Install dependencies: npm install');
console.log('4. Start the server: npm run dev');
console.log('5. Open a new terminal and navigate to client directory: cd client');
console.log('6. Install dependencies: npm install');
console.log('7. Start the client: npm start');
console.log('8. Open http://localhost:3000 in your browser');
console.log('\n📝 Note: If you get MongoDB connection errors, make sure MongoDB is running on your system.');
