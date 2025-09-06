# Dockerfile for NodePorter Project (Next.js)
FROM node:22.19.0-alpine AS builder
ARG VERSION
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VERSION=$VERSION
ENV NEXT_PUBLIC_VERSION=$VERSION
RUN npm run build

# Production image
FROM node:22.19.0-alpine
WORKDIR /app
COPY --from=builder /app .

# OpenShift compatibility: do NOT set USER, make only necessary dirs writable
RUN mkdir -p /app/.next && chmod -R g=u /app/.next \
    && chmod -R g=u /tmp || true
# End OpenShift section

ARG VERSION
ARG PORT=3000
ENV NODE_ENV=production
ENV VERSION=${VERSION}
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD ["npm", "start"]
