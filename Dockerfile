FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci || npm install

# Copy application source
COPY . .

# Generate PDF assets and compile full-stack production build
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built frontend assets, compiled backend server, and database files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/public ./public

# Install production-only dependencies
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
