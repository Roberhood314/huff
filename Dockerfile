FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml ./
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm build
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["pnpm", "start"]
