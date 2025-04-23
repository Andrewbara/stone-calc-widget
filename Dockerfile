# Используем полный Debian-образ с glibc
FROM node:18-bullseye

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и lock
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Указываем порт
EXPOSE 3000

# Команда по умолчанию
CMD ["npm", "run", "start-react"]
