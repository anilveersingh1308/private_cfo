import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_8Lljmywe1hAS@ep-fragrant-voice-a1bqfkk2-pooler.ap-southeast-1.aws.neon.tech/cfo?sslmode=require&channel_binding=require',
  },
});
