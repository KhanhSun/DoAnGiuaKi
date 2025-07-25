# Base image nhẹ với Node 16
FROM node:16-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy file cấu hình trước để tối ưu cache
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cổng ứng dụng sẽ chạy (Render sẽ map tự động)
ENV PORT=10000

# Lắng nghe cổng
EXPOSE 10000

# Lệnh chạy ứng dụng
CMD ["node", "server.js"]
