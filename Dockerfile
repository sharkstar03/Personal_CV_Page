# Sitio estático servido por Nginx. No hay build: el CV es HTML, CSS y JS puro.
FROM nginx:alpine

COPY . /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/Dockerfile \
           /usr/share/nginx/html/docker-compose.yml

EXPOSE 80
