FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080

COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/data ./src/data

USER node

EXPOSE 8080

CMD ["node", "server/index.js"]
