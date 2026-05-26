FROM nginx:1.27-alpine

COPY . /usr/share/nginx/html/

RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/.thumbnail

RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / { try_files $uri $uri/ $uri.html =404; }\n\
  location = /privacy { return 301 /privacy.html; }\n\
  location = /terms   { return 301 /terms.html; }\n\
  location = /legal   { return 301 /legal.html; }\n\
  location = /about   { return 301 /about.html; }\n\
  location = /services{ return 301 /services.html; }\n\
  location = /process { return 301 /process.html; }\n\
  location = /contact { return 301 /contact.html; }\n\
  add_header X-Content-Type-Options nosniff;\n\
  add_header X-Frame-Options SAMEORIGIN;\n\
  add_header Referrer-Policy strict-origin-when-cross-origin;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
