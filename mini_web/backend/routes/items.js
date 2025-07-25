const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const requireLogin = require("../middleware/requireLogin");

router.use(requireLogin);

// Lấy tất cả items của user, có thể lọc theo category (?category_id=...)
router.get("/", itemsController.getAllItems);

// Lấy 1 item theo ID (phải thuộc user)
router.get("/:id", itemsController.getItemById);

// Tạo item mới
router.post("/", itemsController.createItem);

// Cập nhật item
router.put("/:id", itemsController.updateItem);

// Xoá item
router.delete("/:id", itemsController.deleteItem);

module.exports = router;
