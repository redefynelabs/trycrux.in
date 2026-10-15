# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# NEXT_PUBLIC_* values are fixed into the browser bundle at build time.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN adduser -D -u 10001 site
COPY --from=build --chown=site /app/.next/standalone ./
COPY --from=build --chown=site /app/.next/static ./.next/static
COPY --from=build --chown=site /app/public ./public
USER site
EXPOSE 3000
CMD ["node", "server.js"]
