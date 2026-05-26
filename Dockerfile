FROM nginx:1.27-alpine

COPY index.html about.html services.html process.html contact.html \
     thank-you.html \
     privacy.html terms.html legal.html \
     styles.css robots.txt sitemap.xml \
     /usr/share/nginx/html/

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
  location = /api/contact {\n\
    limit_except POST { deny all; }\n\
    add_header Cache-Control "no-store" always;\n\
    return 303 /thank-you.html;\n\
  }\n\
  add_header X-Content-Type-Options nosniff always;\n\
  add_header X-Frame-Options SAMEORIGIN always;\n\
  add_header Referrer-Policy strict-origin-when-cross-origin always;\n\
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n\
  add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=()" always;\n\
  add_header Content-Security-Policy "default-src '\''self'\''; script-src '\''self'\''; style-src '\''self'\'' '\''unsafe-inline'\'' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; frame-src https://www.openstreetmap.org; img-src '\''self'\'' data:; connect-src '\''self'\''; form-action '\''self'\''; base-uri '\''self'\''; object-src '\''none'\''; frame-ancestors '\''self'\''" always;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
