FROM nginx:stable-alpine3.17 AS ngi

# NOTE: This path may change according to your project's output folder
COPY  /dist/supervizaun-web /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

# the app will be using Port 80 while running
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]