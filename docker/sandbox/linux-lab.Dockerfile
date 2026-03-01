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
  net-tools \
  procps \
  shadow \
  tree \
  less \
  sed \
  gawk

RUN adduser -D -s /bin/bash hacker

RUN mkdir -p /challenges /var/log/sim /home/hacker /tmp/lab && \
    chown -R hacker:hacker /challenges /home/hacker /tmp/lab

COPY docker/sandbox/scripts/linux-lab-init.sh /usr/local/bin/linux-lab-init.sh
RUN chmod +x /usr/local/bin/linux-lab-init.sh

RUN echo -e "ls\ncat\ngrep\nfind\nfile\nxxd\nbase64\ncd\npwd\necho\nwhoami\nid\nhead\ntail\nwc\nsort\nuniq\nstrings\nopenssl\njq\nnetstat\nps\ntop\nchmod\nmkdir\ntouch\nrm\nless\ntree\nstat\ndf\nfree" > /etc/allowed-commands

WORKDIR /home/hacker
USER hacker

CMD ["/bin/bash"]
