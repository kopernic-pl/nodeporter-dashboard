# Dockerfile for NodePorter Project (Next.js)
FROM node:22.16.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM node:22.16.0-alpine
WORKDIR /app
COPY --from=builder /app .

# Standard OCI labels
ARG VERSION
ARG VCS_REF
ARG BUILD_DATE
LABEL org.opencontainers.image.title="nodeporter-dashboard" \
      org.opencontainers.image.description="A Next.js dashboard, see README for details." \
      org.opencontainers.image.version="$VERSION" \
      org.opencontainers.image.url="https://github.com/kopernic-pl/nodeporter-dashboard" \
      org.opencontainers.image.source="https://github.com/kopernic-pl/nodeporter-dashboard" \
      org.opencontainers.image.authors="github.com/kopernic-pl" \
      org.opencontainers.image.created="$BUILD_DATE" \
      org.opencontainers.image.revision="$VCS_REF" \
      org.opencontainers.image.licenses="MIT"

# OpenShift compatibility: do NOT set USER, make /app writable by any user
RUN chmod -R g=u /app
# End OpenShift section

ARG PORT=3000
ENV NODE_ENV=production
ENV VERSION=$VERSION
ENV NEXT_PUBLIC_VERSION=$VERSION
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD ["npm", "start"]
