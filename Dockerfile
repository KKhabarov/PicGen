FROM node:20-alpine

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production=false

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose no port (bot uses polling)
# Start: run migrations then start bot
CMD ["sh", "-c", "sleep 3 && npx prisma migrate deploy && node dist/index.js"]
