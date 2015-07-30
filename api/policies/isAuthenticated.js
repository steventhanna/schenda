module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller

  console.log(req.session);
  console.log(req.user);

  if (req.session.authenticated || req.user || req.isAuthenticated()) {
    return next();
  } else {
    console.log("We have a bit of a situation here...");
    return res.redirect('/');
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
};