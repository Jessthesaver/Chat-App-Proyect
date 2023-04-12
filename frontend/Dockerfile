FROM node:18 AS base

WORKDIR /user/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=base /user/src/app/build /user/share/nginx/html

COPY --from=base /user/src/app/build /etc/nginx/html

#EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]