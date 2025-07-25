const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
// const requireGuest = require("../middleware/requireGuest");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Đăng nhập thành công, chuyển hướng về trang chính hoặc dashboard
        res.redirect("/");
    }
);


module.exports = router;
