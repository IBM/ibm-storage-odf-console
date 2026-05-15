# ---------- Build stage ----------
FROM --platform=$BUILDPLATFORM node:22.21.1-bullseye AS builder

WORKDIR /usr/src/app

# Set environment variables to optimize yarn behavior
ENV YARN_CACHE_FOLDER=/tmp/yarn-cache \
    HUSKY=0 \
    CI=true

# 1) Copy only manifests first for better layer caching
COPY package.json yarn.lock ./

# 2) Deterministic installs; this layer is reused unless manifests change
# Deterministic installs; this layer is reused unless manifests change
RUN set -ex && \
    yarn config set network-timeout 600000 && \
    yarn config set network-concurrency 1 && \
    yarn config set registry https://registry.yarnpkg.com && \
    yarn install --frozen-lockfile --ignore-scripts --prefer-offline 2>&1 | tee /tmp/yarn-install.log || \
    (echo "First attempt failed, retrying..." && yarn install --frozen-lockfile --ignore-scripts) && \
    yarn cache clean && \
    rm -rf /tmp/yarn-cache

# 3) Copy the rest of the source (respects your .dockerignore)
COPY . .

# 4) Clean previous build output (your "clean" script only removes dist)
RUN yarn clean

# 5) Build plugin assets using the build script from package.json
RUN yarn build

# ---------- Runtime stage ----------
FROM --platform=$BUILDPLATFORM node:22.21.1-alpine

WORKDIR /usr/src/app

# Copy only what you need at runtime (ocales are already in dist/locales)
COPY --from=builder /usr/src/app/dist ./dist

# Lightweight static server
RUN npm install -g http-server

EXPOSE 9003


ENTRYPOINT ["http-server"]
CMD ["./dist", "-p", "9003", "-c-1", "--cors", "--ssl", "--cert", "/var/serving-cert/tls.crt", "--key", "/var/serving-cert/tls.key"]
