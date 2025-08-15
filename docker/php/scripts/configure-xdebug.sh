#!/bin/bash
if [[ $ENABLE_XDEBUG != "1" ]]; then
  rm /usr/local/etc/php/conf.d/xdebug.ini
fi
