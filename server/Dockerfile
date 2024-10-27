FROM nginx:1.27.2-alpine

WORKDIR /server

COPY . /server/

RUN chmod +x /server/entrypoint.sh

ENTRYPOINT ["/server/entrypoint.sh"]
