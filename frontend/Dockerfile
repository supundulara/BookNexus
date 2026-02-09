# Build the react app
FROM node:18-alpine AS build

WORKDIR /app

# copy dependancy files
COPY package*.json ./
RUN npm install

# copy source code with .env file
COPY . .


ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# build the app
RUN npm run build

# Serve with nginx
FROM nginx:alpine

# copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]