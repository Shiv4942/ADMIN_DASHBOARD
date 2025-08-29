export const requireAuth = (req, res, next) => {
  req.user = { id: 'dev-user' };
  return next();
};


