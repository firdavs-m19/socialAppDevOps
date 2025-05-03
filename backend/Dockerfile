FROM node:18

WORKDIR /app

COPY package*.json ./

RUN test -f .env && cp .env . || echo ".env not found, using defaults"
RUN npm install

COPY . .

# Set appropriate ownership and permissions
RUN chown -R node:node /app && chmod -R 755 /app

USER node

EXPOSE 5000

CMD ["npm", "run", "dev"]
