#!/bin/bash

sed -i "s/^opcache.validate_timestamps=\([ 0-9a-zA-Z]*$\)/opcache.validate_timestamps=$OPCACHE_VALIDATE_TIMESTAMPS/g" /usr/local/etc/php/conf.d/opcache.ini
