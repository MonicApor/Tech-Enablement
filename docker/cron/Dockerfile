FROM sprobeph/php-cron:latest

RUN echo "* * * * * cd /var/www/backend && php artisan schedule:run >> /dev/null 2>&1" >> /etc/crontabs/root
RUN printf '[PHP]\ndate.timezone = "Asia/Tokyo"\n' > /usr/local/etc/php/conf.d/tzone.ini
COPY --chown=www-data:www-data ./src/backend /var/www/backend
RUN touch /run/supervisord.sock
COPY ./docker/cron/conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
ADD ./docker/cron/scripts/configure.sh /configure.sh
RUN ["chmod", "+x", "/configure.sh"]
CMD /configure.sh
