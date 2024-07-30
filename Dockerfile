FROM mcr.microsoft.com/playwright:v1.45.1-jammy

WORKDIR /tests
COPY . .

RUN npm ci
ENV CI=true
