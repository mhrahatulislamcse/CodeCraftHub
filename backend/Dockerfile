# ===================================================
# CodeCraftHub Backend - Production Dockerfile
# Multi-stage lean build for Node.js Express REST API
# ===================================================

# Stage 1: Dependency resolution and pruning
FROM node:22-alpine AS dependencies
WORKDIR /app

# Install curl for container healthchecking if needed
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Final minimal production runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install curl for docker healthcheck
RUN apk add --no-cache curl

# Create non-root system group and user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy installed production node_modules from Stage 1
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs database ./database
COPY --chown=nodejs:nodejs scripts ./scripts

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/health || exit 1

CMD ["node", "src/server.js"]

