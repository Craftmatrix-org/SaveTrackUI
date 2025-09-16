FROM node as build

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

FROM nginx

RUN apt-get update && apt-get install -y curl wget && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
