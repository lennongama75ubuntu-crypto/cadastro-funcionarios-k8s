# Estágio 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Estágio 2: Runner (Imagem Final)
FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Segurança: Rodar como usuário comum, não root
USER node

EXPOSE 3000
CMD ["node", "index.js"]
