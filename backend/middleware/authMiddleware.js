// User must be authenticated/logged in
const authenticated = (req, res, next) => {
  if (req.user && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};


// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.isAuthenticated && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
// User must be a provider. lets admin role through as well
const provider = (req, res, next) => {
  if (
    req.user &&
    req.isAuthenticated &&
    (req.user.role === 'provider' || req.user.role === 'admin')
  ) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a provider');
  }
};

export { authenticated, admin, provider };
