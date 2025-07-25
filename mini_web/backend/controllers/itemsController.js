const pool = require("../db");

// [GET] /items?category_id=...
exports.getAllItems = async (req, res) => {
  const userId = req.user.id;
  const categoryId = req.query.category_id;

  try {
    let result;
    if (categoryId) {
      result = await pool.query(
        "SELECT * FROM items WHERE user_id = $1 AND category_id = $2 ORDER BY created_at DESC",
        [userId, categoryId]
      );
    } else {
      result = await pool.query(
        "SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách items:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// [GET] /items/:id
exports.getItemById = async (req, res) => {
  console.log("req.user:", req.user);
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM items WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy item" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Lỗi khi lấy item:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// [POST] /items
exports.createItem = async (req, res) => {
  const userId = req.user.id;
  const { category_id, title, content, extra } = req.body;

  if (!title || !category_id) {
    return res.status(400).json({ message: "Thiếu title hoặc category_id" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO items (user_id, category_id, title, content, extra)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, category_id, title, content || "", extra || {}]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Lỗi khi tạo item:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// [PUT] /items/:id
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { category_id, title, content, extra } = req.body;

  if (!title || !category_id) {
    return res.status(400).json({ message: "Thiếu title hoặc category_id" });
  }

  try {
    const result = await pool.query(
      `UPDATE items
       SET category_id = $1, title = $2, content = $3, extra = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [category_id, title, content || "", extra || {}, id, userId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Item không tồn tại hoặc không thuộc về bạn" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Lỗi khi cập nhật item:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// [DELETE] /items/:id
exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Item không tồn tại hoặc không thuộc về bạn" });
    }

    res.status(204).send(); // Không có nội dung
  } catch (err) {
    console.error("Lỗi khi xoá item:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
