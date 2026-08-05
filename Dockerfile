FROM node:24-alpine AS builder

WORKDIR /app

RUN apk update
RUN apk add --no-cache coreutils

ARG GITHUB_TOKEN

COPY package*.json .
COPY .npmrc .
RUN npm ci
COPY . .

RUN npm run build
RUN npm prune --production

FROM node:24-alpine

WORKDIR /app

RUN apk --no-cache add curl

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000

ENV NODE_ENV=production
CMD [ "node", "build" ]

HEALTHCHECK \
  --interval=1m \
  --timeout=10s \
  --start-period=5s \
  --retries=10 \
  CMD curl -f http://localhost:3000 || exit 1
