FROM node:18 AS base

WORKDIR /user/src/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23.2

COPY --from=base /user/src/app/build /user/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]