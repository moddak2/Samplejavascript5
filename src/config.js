const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

// Load .env from project root if present.
// This is safe to call at module load: it only populates process.env.
const projectRoot = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

const configSchema = z.object({
  APP_NAME: z.string().min(1).max(50).default('samplejavascript5'),
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  // Intentionally vulnerable demo endpoint toggle.
  DEMO_VULN_ENABLED: z
    .preprocess((v) => {
      if (typeof v === 'boolean') return v;
      const s = String(v ?? '').trim().toLowerCase();
      if (s === 'true' || s === '1' || s === 'yes' || s === 'on') return true;
      if (s === 'false' || s === '0' || s === 'no' || s === 'off' || s === '') return false;
      return v;
    }, z.boolean())
    .default(false),

  // Fake values for demo/scanner purposes.
  FAKE_API_KEY: z.string().optional(),
  FAKE_DB_URL: z.string().optional(),
  FAKE_CARD_TOKEN: z.string().optional(),
});

function getConfig() {
  const parsed = configSchema.safeParse(process.env);
  if (!parsed.success) {
    const err = new Error('invalid_configuration');
    err.status = 500;
    throw err;
  }
  return parsed.data;
}

module.exports = { getConfig };
