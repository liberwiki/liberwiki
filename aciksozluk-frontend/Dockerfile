FROM node:20-alpine

WORKDIR /aciksozluk-frontend

COPY . /aciksozluk-frontend/

RUN npm install --frozen-lockfile

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

RUN chmod +x /aciksozluk-frontend/entrypoint.sh

ENTRYPOINT ["/aciksozluk-frontend/entrypoint.sh"]
