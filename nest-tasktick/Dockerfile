FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install && npm install -g @nestjs/cli

COPY start.sh ./
RUN chmod +x ./start.sh

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]