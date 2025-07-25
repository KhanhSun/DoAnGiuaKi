INSERT INTO categories (name, slug, description)
VALUES
  ('Game PC', 'game-pc', 'Game dành cho máy tính cá nhân'),
  ('Game điện thoại', 'game-mobile', 'Game chơi trên điện thoại Android/iOS'),
  ('Nền tảng khác', 'game-other', 'Console, VR, Web game...');


-- Password đều là: 12345

INSERT INTO users (username, email, password)
VALUES
  ('alice', 'alice@example.com', '$2b$10$6vCQO3LtoHqrS.8MDrYnuuvlQtXLJydFiYv9UT7n0HXU4kgfuTGXC'),
  ('bob', 'bob@example.com',     '$2b$10$6vCQO3LtoHqrS.8MDrYnuuvlQtXLJydFiYv9UT7n0HXU4kgfuTGXC'),
  ('charlie', 'charlie@example.com', '$2b$10$6vCQO3LtoHqrS.8MDrYnuuvlQtXLJydFiYv9UT7n0HXU4kgfuTGXC');


INSERT INTO items (user_id, category_id, title, content, extra)
VALUES
  (1, 1, 'Elden Ring', 'Game hành động thế giới mở của FromSoftware',
   '{"platform": "PC", "price": 790000, "release_date": "2022-02-25"}'),

  (2, 1, 'Baldur’s Gate 3', 'RPG cực mạnh đoạt GOTY 2023',
   '{"platform": "PC", "price": 900000, "genre": "RPG"}'),

  (1, 2, 'Genshin Impact', 'Game nhập vai gacha miễn phí',
   '{"platform": "Mobile", "price": 0, "developer": "miHoYo"}'),

  (3, 2, 'Among Us', 'Game vui chơi cùng bạn bè',
   '{"platform": "Mobile", "price": 0, "genre": "Party"}'),

  (2, 3, 'Tetris VR', 'Game cổ điển dưới dạng VR',
   '{"platform": "VR", "price": 199000, "genre": "Puzzle"}');
