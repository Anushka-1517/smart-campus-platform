const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized. Please log in.",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

export default adminOnly;