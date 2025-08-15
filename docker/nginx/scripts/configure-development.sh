#!/bin/bash
mkdir -p /etc/nginx/ssl

# Create Self-signed SSL Cert for APP Domain
if [ "$GENERATE_SELF_SIGNED_SSL" -eq 1 ] && [ ! -z "$APP_DOMAIN" ]
then
openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048

openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
  -keyout /etc/nginx/ssl/$APP_DOMAIN.key -out /etc/nginx/ssl/$APP_DOMAIN.cert -extensions san -config \
  <(echo "[req]";
    echo distinguished_name=req;
    echo "[san]";
    echo subjectAltName=DNS:$APP_DOMAIN,IP:10.0.0.1
    ) \
  -subj /CN=$APP_DOMAIN

# Update Nginx Config
SSL_CONFIG="server_name APP_DOMAIN;\nssl_certificate \/etc\/nginx\/ssl\/APP_DOMAIN.cert;\nssl_certificate_key \/etc\/nginx\/ssl\/APP_DOMAIN.key;\nssl_trusted_certificate \/etc\/nginx\/ssl\/APP_DOMAIN.cert;"
sed -i "s/server_name APP_DOMAIN;/$SSL_CONFIG/g" /etc/nginx/conf.d/default.conf
sed -i "s/80/443 ssl http2/g" /etc/nginx/conf.d/default.conf
echo -e "# HTTP redirect\nserver {\nlisten 80;\nlisten [::]:80;\nserver_name APP_DOMAIN;\n# letsencrypt support\ninclude /etc/nginx/letsencrypt.conf;\nreturn 301 https://\$host\$request_uri;\n}" >> /etc/nginx/conf.d/default.conf
fi

# Update App Domain
sed -i "s/APP_DOMAIN/$APP_DOMAIN/g" /etc/nginx/conf.d/default.conf
