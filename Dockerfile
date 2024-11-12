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

# Copy package files
COPY package*.json ./

# Install dependencies including Tailwind Typography
RUN npm ci && \
    npm install -D @tailwindcss/typography && \
    npm cache clean --force

# Copy source code
COPY . .

# Create next.config.js with rewrites configuration
RUN echo "module.exports = {" > next.config.js && \
    echo "  rewrites: async () => {" >> next.config.js && \
    echo "    return [" >> next.config.js && \
    echo "      {" >> next.config.js && \
    echo "        source: '/api/auth/:path*'," >> next.config.js && \
    echo "        destination: '${AUTH_SERVER_URL}/api/auth/:path*'" >> next.config.js && \
    echo "      }," >> next.config.js && \
    echo "      {" >> next.config.js && \
    echo "        source: '/api/members/:path*'," >> next.config.js && \
    echo "        destination: '${MEMBERS_SERVER_URL}/api/members/:path*'" >> next.config.js && \
    echo "      }," >> next.config.js && \
    echo "      {" >> next.config.js && \
    echo "        source: '/api/resumes/:path*'," >> next.config.js && \
    echo "        destination: '${RESUMES_SERVER_URL}/api/resumes/:path*'" >> next.config.js && \
    echo "      }" >> next.config.js && \
    echo "    ]" >> next.config.js && \
    echo "  }" >> next.config.js && \
    echo "}" >> next.config.js

# Install sharp for image optimization (addressing the warning)
RUN npm install sharp

# Build the application
RUN CI=false npm run build

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