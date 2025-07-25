-- Bảng người dùng
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE NOT NULL,
    google_id TEXT UNIQUE,
    reset_token TEXT,
    reset_token_expires TIMESTAMP,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT now()
);

-- Bảng danh mục (loại nội dung)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Bảng nội dung linh hoạt
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    extra JSONB,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE item_views (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMP DEFAULT now()
);
