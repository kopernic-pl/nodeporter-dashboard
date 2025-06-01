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
