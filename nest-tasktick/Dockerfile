FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN chmod +x ./start.sh


RUN npm run build

EXPOSE 3000

CMD ["./start.sh"]
