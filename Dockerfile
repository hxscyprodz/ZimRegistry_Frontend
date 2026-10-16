# Multi-stage Dockerfile for ZimRegistry Citizen Portal (Bun)
# =======================================================

# Stage 1: Build the Vite production bundle using Bun
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install dependencies using bun.lock
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy application source code
COPY . .

# Build-time environment variables for Vite passed from .env / docker-compose
ARG VITE_API_BASE_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_STORAGE_BUCKET
ARG VITE_ORG_ADDRESS
ARG VITE_ORG_PHONE
ARG VITE_ORG_EMAIL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_SUPABASE_STORAGE_BUCKET=$VITE_SUPABASE_STORAGE_BUCKET \
    VITE_ORG_ADDRESS=$VITE_ORG_ADDRESS \
    VITE_ORG_PHONE=$VITE_ORG_PHONE \
    VITE_ORG_EMAIL=$VITE_ORG_EMAIL

# Build production distribution using Bun
RUN bun run build

# =======================================================
# Stage 2: Serve with lightweight Nginx web server
FROM nginx:alpine-slim

# Copy custom Nginx configuration with SPA fallback support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure nginx is serving requests
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
