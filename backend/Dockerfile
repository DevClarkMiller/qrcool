FROM node:22-alpine AS base

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for caching dependencies
COPY package*.json ./

# Stage used by CI to run the test suite (needs devDependencies e.g. jest, typescript)
FROM base AS test

RUN npm ci

COPY . .

RUN npm run prisma:generate

# Stage used to build and ship the runtime image
FROM base AS production

RUN npm ci --omit=dev

COPY . .

RUN npm run prisma:generate

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 5000
