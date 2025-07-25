module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user; // Gắn user vào req
    next();
  } else {
    res.status(401).json({ message: "Bạn chưa đăng nhập" });
  }
};
