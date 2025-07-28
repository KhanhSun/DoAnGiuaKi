const express = require("express");
const session = require("express-session");
const path = require("path");
const pool = require("./db");
require("./db");
require("dotenv").config();

//được thêm
console.log("CALLBACK:", process.env.GOOGLE_CALLBACK_URL);
//

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const authRoutes = require("./routes/auth");
const categoriesRoutes = require("./routes/categories");
const itemsRoutes = require("./routes/items");

const app = express(); // Thêm dòng này nếu chưa có, để kết nối DB

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.get("/session-test", (req, res) => {
  req.session.count = (req.session.count || 0) + 1;
  res.send(`Bạn đã truy cập ${req.session.count} lần`);
});

// Passport cấu hình session
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize/deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"], // ⚠️ PHẢI CÓ
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let result = await pool.query("SELECT * FROM users WHERE google_id = $1", [profile.id]);
        let user = result.rows[0];

        if (!user && profile.emails && profile.emails[0]) {
          result = await pool.query("SELECT * FROM users WHERE email = $1", [profile.emails[0].value]);
          user = result.rows[0];
        }

        if (!user) {
          const username = profile.displayName || profile.emails[0].value;
          const email = profile.emails[0].value;
          const insert = await pool.query(
            "INSERT INTO users (username, email, google_id) VALUES ($1, $2, $3) RETURNING *",
            [username, email, profile.id]
          );
          user = insert.rows[0];
        } else if (!user.google_id) {
          await pool.query("UPDATE users SET google_id = $1 WHERE id = $2", [profile.id, user.id]);
          user.google_id = profile.id;
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Gắn req.user nếu đã đăng nhập (giữ nguyên)
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
});


// Serve static files from the frontend directory
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));
app.use("/partials", express.static(path.join(frontendPath, "partials")));

// Routes
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/items", itemsRoutes);

// Home
app.get("/", (req, res) => {
  const indexFile = path.join(frontendPath, "index.html");
  res.sendFile(indexFile, (err) => {
    if (err) {
      console.error("❌ Không tìm thấy index.html:", err.message);
      res.status(500).send("Không thể tải trang");
    }
  });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
