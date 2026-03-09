FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install --ignore-scripts

EXPOSE 1337

ENV PORT=1337

CMD ["node", "server.js"]
