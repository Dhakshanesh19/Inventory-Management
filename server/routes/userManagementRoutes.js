// server/routes/userManagementRoutes.js
const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userManagementController');
const protect = require('../middleware/protect');
const authorize = require('../middleware/rbacMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, authorize(['Admin']), getUsers)
  .post(protect, authorize(['Admin']), createUser);

router.route('/:id')
  .put(protect, authorize(['Admin']), updateUser)
  .delete(protect, authorize(['Admin']), deleteUser);

module.exports = router;