# Production Dockerfile for Google Cloud Run (us-east5) & Multi-Cloud Deployment
# Deployment Target: us-east5 (Regional Run Endpoint)
# Port: 3000
FROM node:22-alpine AS base
LABEL maintainer="gxqstudio@gmail.com"
LABEL cloud.google.region="us-east5"
LABEL cloud.google.service="viniapp-enterprise"

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* bun.lock* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

# Production image, copy all the files and run
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 viniapp

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/vercel.json ./vercel.json

USER viniapp

EXPOSE 3000

CMD ["npm", "run", "preview"]
