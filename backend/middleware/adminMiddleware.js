import asyncHandler from 'express-async-handler';

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access required. Insufficient permissions.');
  }

  next();
});

// Protect admin from being deleted by themselves or other admins
export const preventAdminDeletion = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'admin' && req.user._id.toString() === req.params.id) {
    res.status(403);
    throw new Error('Cannot delete your own admin account');
  }
  next();
});
