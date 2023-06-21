FROM node:18-alpine as development

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as production

WORKDIR /app

COPY --from=development ./app/dist ./dist

COPY package*.json .

RUN npm ci --only=production

CMD ["npm", "start"]