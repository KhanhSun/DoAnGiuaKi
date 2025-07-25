const pool = require("../db");
const slugify = require("../utils/slugify");

exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.createCategory = async (req, res) => {
  let { name, slug } = req.body;
  if (!name) return res.status(400).json({ message: "Thiếu tên danh mục" });
  if (!slug) {
    slug = slugify(name);
  } else {
    slug = slugify(slug);
  }
  try {
    // Kiểm tra slug đã tồn tại chưa
    let finalSlug = slug;
    let counter = 1;

    while (true) {
      const check = await pool.query(
        "SELECT 1 FROM categories WHERE slug = $1 LIMIT 1",
        [finalSlug]
      );
      if (check.rowCount === 0) break;

      finalSlug = `${slug}-${counter++}`;
    }

    const result = await pool.query(
      "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *",
      [name, finalSlug]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;
  if (err.code === "23505") {
    return res.status(409).json({ message: "Slug đã tồn tại" });
  }

  if (!name) return res.status(400).json({ message: "Thiếu tên danh mục" });

  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *",
      [name, slug, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM categories WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
