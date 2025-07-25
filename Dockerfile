# Base image nhẹ với Node 16
FROM node:16-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cài đặt dependencies
WORKDIR /app/mini_web/backend
RUN npm install

# Lắng nghe cổng
ENV PORT=10000
EXPOSE 10000

# Lệnh chạy server
CMD ["node", "server.js"]
