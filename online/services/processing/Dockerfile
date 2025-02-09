FROM node:20.17.0-alpine

RUN apk add --no-cache bash
# RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /usr/src/app/
COPY tsconfig*.json /usr/src/app/
COPY nest-cli.json /usr/src/app/
COPY .env /usr/src/app/
COPY entrypoint.sh /usr/src/app/
COPY wait-for-it.sh /usr/src/app/
COPY src /usr/src/app/src
# COPY model.json /usr/src/app/
RUN cd /usr/src/app && npm install

RUN chmod +x /usr/src/app/entrypoint.sh
RUN sed -i 's/\r//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/wait-for-it.sh
RUN sed -i 's/\r//g' /usr/src/app/wait-for-it.sh

WORKDIR /usr/src/app
# RUN if [ ! -f .env ]; then cp env-example-relational .env; fi
RUN npm run build

CMD ["/usr/src/app/entrypoint.sh"]
