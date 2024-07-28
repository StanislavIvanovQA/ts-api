FROM mcr.microsoft.com/playwright:v1.45.1-jammy

WORKDIR /app

COPY . .

RUN npm ci
ENV CI=true

CMD ["npm", "test", "&&", "cp", "-r", "allure-results", "/app/allure-results"]
