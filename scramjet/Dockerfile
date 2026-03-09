FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --ignore-scripts

COPY . .

EXPOSE 1337

ENV PORT=1337

CMD ["node", "server.js"]
