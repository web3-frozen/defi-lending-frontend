FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx/nginx-unprivileged:1.31.10-alpine

# Patch OS packages in the nginx base image (trivy CRITICAL/HIGH gate)
USER root
RUN apk update --no-cache && apk upgrade --no-cache --available
USER nginx

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
USER nginx
