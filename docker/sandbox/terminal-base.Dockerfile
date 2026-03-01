FROM alpine:3.19

RUN apk add --no-cache \
  bash \
  coreutils \
  grep \
  findutils \
  file \
  xxd \
  openssl \
  jq \
  curl \
  net-tools \
  procps \
  shadow

RUN adduser -D -s /bin/bash hacker

RUN mkdir -p /challenges && chown hacker:hacker /challenges

COPY docker/sandbox/scripts/restricted-shell.sh /usr/local/bin/restricted-shell.sh
RUN chmod +x /usr/local/bin/restricted-shell.sh

RUN echo "ls\ncat\ngrep\nfind\nfile\nxxd\nbase64\ncd\npwd\necho\nwhoami\nid\nhead\ntail\nwc\nsort\nuniq\nstrings\nopenssl\njq\ncurl\nnetstat\nps" > /etc/allowed-commands

WORKDIR /challenges
USER hacker

CMD ["/bin/bash"]
