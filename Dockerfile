# Build stage
FROM node:20.4-alpine as builder
WORKDIR /app

# Environment variables for build time
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_S3_URL
ARG NODE_ENV
ARG AUTH_SERVER_URL
ARG MEMBERS_SERVER_URL
ARG RESUMES_SERVER_URL
ARG NOTIFICATIONS_SERVER_URL

# Copy package files
COPY package*.json ./

# Install dependencies including Tailwind Typography
RUN npm ci && \
    npm install -D @tailwindcss/typography && \
    npm cache clean --force

# Copy source code
COPY . .
#이미 next.config.js 관련 파일이 있다.
# Install sharp for image optimization (addressing the warning)
RUN npm install sharp

# Build the application
RUN CI

# Production stage
FROM node:20.4-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S -g 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nextjs && \
    chown -R nextjs:nodejs /app

# Copy built artifacts from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]