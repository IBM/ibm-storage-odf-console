FROM --platform=$BUILDPLATFORM node:22.21.1-bullseye AS builder

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn install

RUN yarn clean
RUN NODE_ENV=production yarn ts-node ./node_modules/.bin/webpack
RUN yarn locales


FROM --platform=$BUILDPLATFORM node:22.21.1-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
RUN npm install http-server -g
EXPOSE 9003
ENTRYPOINT [ "http-server", "./dist", "-p", "9003", "-c-1", "--cors", "./dist", "$@" ]
