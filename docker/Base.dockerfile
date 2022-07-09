FROM node:16.16.0-alpine as base

WORKDIR /app

FROM base AS builder
COPY package.json package-lock.json ./
COPY . .
RUN npm ci
RUN npm run build:src

FROM base AS release
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/package.json /app/package-lock.json /app/.env.defaults /app/LICENSE.md ./

RUN npm ci --production
