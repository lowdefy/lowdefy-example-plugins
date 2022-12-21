FROM node:18-buster AS builder

WORKDIR /lowdefy

COPY . .
# Configure Standalone next build
ENV LOWDEFY_BUILD_OUTPUT_STANDALONE 1
# Enable pnpm using corepack
RUN corepack enable

RUN pnpx lowdefy@alpha build --config-directory ./app


FROM node:18-alpine AS runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /lowdefy

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 lowdefy

COPY --from=builder /lowdefy/app/.lowdefy/server/next.config.js ./
COPY --from=builder /lowdefy/app/.lowdefy/server/package.json ./package.json
COPY --from=builder /lowdefy/app/.lowdefy/server/public ./public
COPY --from=builder /lowdefy/app/.lowdefy/server/build ./build

COPY --from=builder --chown=lowdefy:nodejs /lowdefy/.lowdefy/server/.next/standalone ./
COPY --from=builder --chown=lowdefy:nodejs /lowdefy/.lowdefy/server/.next/static ./.next/static

USER lowdefy

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
