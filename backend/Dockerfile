FROM node:22-alpine

WORKDIR /
COPY testEntrypoint.sh ./
RUN chmod +x testEntrypoint.sh

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for caching dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

COPY . .

RUN npm run prisma:generate

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 5000