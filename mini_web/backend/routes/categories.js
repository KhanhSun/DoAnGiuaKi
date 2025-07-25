const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoriesController");

// Lấy danh sách categories của user
router.get("/", categoryController.getAllCategories);

// Tạo category mới
router.post("/", categoryController.createCategory);

// Cập nhật category
router.put("/:id", categoryController.updateCategory);

// Xoá category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
