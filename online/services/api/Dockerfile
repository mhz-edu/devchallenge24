FROM node:20.17.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /usr/src/app/
COPY tsconfig*.json /usr/src/app/
COPY .env.prod /usr/src/app/
COPY src /usr/src/app/src
RUN cd /usr/src/app && npm install

COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.relational.dev.sh /opt/startup.relational.dev.sh
RUN chmod +x /opt/startup.relational.dev.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.relational.dev.sh

WORKDIR /usr/src/app
# RUN if [ ! -f .env ]; then cp env-example-relational .env; fi
RUN npm run build

CMD ["/opt/startup.relational.dev.sh"]
