FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set appropriate ownership and permissions
RUN chown -R node:node /app && chmod -R 755 /app

USER node

EXPOSE 3000

CMD ["npm", "start"]
