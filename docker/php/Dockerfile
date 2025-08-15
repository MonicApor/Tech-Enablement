FROM sprobeph/php-web-8.4:latest

# Setup xDebug
ARG ENABLE_XDEBUG
ADD ./docker/php/scripts/configure-xdebug.sh /configure-xdebug.sh
RUN ["chmod", "+x", "/configure-xdebug.sh"]
RUN /configure-xdebug.sh

# Setup Opcache
ARG OPCACHE_VALIDATE_TIMESTAMPS
ADD ./docker/php/scripts/configure-opcache.sh /configure-opcache.sh
RUN ["chmod", "+x", "/configure-opcache.sh"]
RUN /configure-opcache.sh

# Update Git directory permission
RUN git config --global --add safe.directory /var/www/backend
