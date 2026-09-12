FROM node:22-alpine AS base

WORKDIR /usr/src/app

# `prisma generate` only needs DB_URL to resolve the env() reference in schema.prisma - it never
# connects to it. This placeholder lets the image build without secrets; the real DB_URL is always
# supplied at container runtime (env_file/-e) and overrides this default there.
ARG DB_URL=sqlserver://localhost:1433;database=build;user=sa;password=build;trustServerCertificate=true;encrypt=false
ENV DB_URL=$DB_URL

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
