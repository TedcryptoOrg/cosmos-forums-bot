FROM node:22.16-alpine

RUN apk upgrade --no-cache && \
    apk add --no-cache openssl libgcc libstdc++ ncurses-libs supervisor jq curl mariadb-client

WORKDIR /srv

COPY ./ ./
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN npm rebuild && npm install && npm install -g ts-node

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]