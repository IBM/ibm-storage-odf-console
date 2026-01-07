# ---------- Build stage ----------
FROM --platform=$BUILDPLATFORM node:22.21.1-bullseye AS builder

WORKDIR /usr/src/app

# 1) Copy only manifests first for better layer caching
COPY package.json yarn.lock ./
# Deterministic installs; this layer is reused unless manifests change
RUN yarn install --frozen-lockfile

# 2) Copy the rest of the source (respects your .dockerignore)
COPY . .

# 3) Clean previous build output (your "clean" script only removes dist)
RUN yarn clean

# 4) Build plugin assets
# If you have a "build" script in package.json, prefer: RUN yarn build
RUN NODE_ENV=production yarn ts-node ./node_modules/.bin/webpack

# 5) Generate locales (if needed at runtime)
RUN yarn locales


# ---------- Runtime stage ----------
FROM --platform=$BUILDPLATFORM node:22.21.1-alpine

WORKDIR /usr/src/app

# Copy only what you need at runtime
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/locales ./locales

# Lightweight static server
RUN npm install -g http-server

EXPOSE 9003

# Use CMD for overridable defaults; flags don’t need "$@"
CMD ["http-server", "./dist", "-p", "9003", "-c-1", "--cors"]
