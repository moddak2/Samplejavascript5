const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { router: apiRouter } = require('./routes/api');
const { router: demoRouter } = require('./routes/demo');

function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // Demo endpoints intentionally output HTML; allow inline styles only.
        // Keep script-src strict.
        'style-src': ["'self'", "'unsafe-inline'"]
      }
    }
  }));

  app.use(cors({
    origin: false,
    methods: ['GET', 'POST'],
  }));

  app.use(express.json({ limit: '16kb', strict: true, type: 'application/json' }));

  app.get('/healthz', (req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use('/api', apiRouter);
  app.use('/demo', demoRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message = status >= 500 ? 'internal_error' : (err?.message || 'bad_request');
    res.status(status).json({ error: message });
  });

  return app;
}

module.exports = { createApp };
