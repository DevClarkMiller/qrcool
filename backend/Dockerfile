FROM node:22-alpine
WORKDIR /home/node/app

COPY . .

# Install dependencies
RUN npm install 

RUN npx prisma generate

EXPOSE 5000
CMD ["npm", "run", "start:prod"]