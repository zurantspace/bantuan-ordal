import { defineConfig } from 'prisma/config';

// Prisma 7 config — connection URL here instead of schema.prisma datasource.url
// The adapter (PrismaPg) is configured in src/lib/server/prisma.ts
// Docs: https://pris.ly/d/config-datasource
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
