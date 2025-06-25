FROM --platform=$BUILDPLATFORM node:18.20.8 as builder

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn install
RUN yarn build

FROM --platform=$BUILDPLATFORM node:18.20.8-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
RUN npm install http-server -g
EXPOSE 9003
ENTRYPOINT [ "http-server", "./dist", "-p", "9003", "-c-1", "--cors", "./dist", "$@" ]
