FROM node:18-buster AS builder

WORKDIR /lowdefy

COPY . .
# Configure standalone next build
ENV LOWDEFY_BUILD_OUTPUT_STANDALONE 1

# Enable pnpm using corepack
RUN corepack enable

# TODO: Change config-directory (./app) as appropriate here
RUN pnpx lowdefy@rc build --config-directory ./app --log-level=debug

RUN pnpm --filter=@lowdefy/server --prod deploy ./deploy

FROM node:18-alpine AS runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /lowdefy

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 lowdefy

# TODO: Change from-directory (/lowdefy/app/.lowdefy/server/public) as appropriate here
COPY --from=builder --chown=lowdefy:nodejs /lowdefy/app/.lowdefy/server/public ./public
# TODO: Change from-directory (/lowdefy/app/.lowdefy/server/.next/standalone) as appropriate here
COPY --from=builder --chown=lowdefy:nodejs /lowdefy/app/.lowdefy/server/.next/standalone ./

COPY --from=builder --chown=lowdefy:nodejs /lowdefy/deploy/node_modules ./node_modules

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
