// backend/controllers/authController.js
const pool = require("../db");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Thiếu thông tin" });

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username",
      [username, email, hash]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ message: "Tên hoặc email đã tồn tại" });
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ message: "Sai tên hoặc mật khẩu" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Sai tên hoặc mật khẩu" });

    req.session.user = { id: user.id, username: user.username };
    res.status(200).json({ message: "Đăng nhập thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Không thể đăng xuất" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Đã đăng xuất" });
  });
};

exports.me = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  res.json({ user: req.session.user });
};
