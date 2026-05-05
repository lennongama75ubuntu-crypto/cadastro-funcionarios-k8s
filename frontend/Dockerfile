# Estágio 1: Build
FROM node:24-alpine AS builder

# Adicionamos dependências básicas para compatibilidade no Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiamos apenas os arquivos de dependências primeiro (otimização de cache)
COPY package*.json ./
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm install --network-timeout=1000000

# Copiamos o restante do código
COPY . .

# Executamos o build via script do npm (mais seguro que npx direto)
RUN npm run build

# Estágio 2: Nginx para servir o conteúdo
FROM nginx:stable-alpine

# Limpamos a pasta padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# IMPORTANTE: Verifique se o caminho do build no Angular 19 
# não gerou uma subpasta adicional como /browser
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

# Configuração de segurança opcional: rodar como non-root
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
