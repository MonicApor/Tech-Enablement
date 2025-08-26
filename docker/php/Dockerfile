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

# Copy and setup Laravel startup script
COPY ./docker/php/scripts/start-laravel.sh /start-laravel.sh
RUN chmod +x /start-laravel.sh

# Set the startup script as the default command
CMD ["/start-laravel.sh"]
