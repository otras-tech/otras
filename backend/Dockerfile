# Base stage (dependencies)
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build stage
FROM base AS builder
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# ✅ Install required packages
RUN apk add --no-cache openssl netcat-openbsd

# Copy from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Entrypoint
COPY ./docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 4000
ENTRYPOINT ["/app/docker-entrypoint.sh"]