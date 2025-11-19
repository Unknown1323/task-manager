# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Копіюємо package files
COPY package*.json ./

# Встановлюємо залежності
RUN npm ci

# Копіюємо весь код
COPY . .

# Білдимо проект
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Копіюємо package files
COPY package*.json ./

# Встановлюємо тільки production залежності
RUN npm ci --only=production

# Копіюємо збілдений код з builder stage
COPY --from=builder /app/dist ./dist

# Відкриваємо порт
EXPOSE 3001

# Здоров'я перевірка
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Запускаємо додаток
CMD ["node", "dist/main"]
