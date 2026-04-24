const express = require('express');
const { z } = require('zod');
const { getConfig } = require('../config');

const router = express.Router();

// Intentionally vulnerable demo routes.
// These are NOT meant for production use.

const qSchema = z.object({
  q: z.string().max(200).default('')
});

router.get('/vuln-xss', (req, res, next) => {
  const { DEMO_VULN_ENABLED } = getConfig();
  if (!DEMO_VULN_ENABLED) {
    return res.status(404).send('not_found');
  }

  // Intentional vulnerability: user input is inserted into HTML without escaping.
  // This exists only to demonstrate what NOT to do.
  const parsed = qSchema.safeParse(req.query);
  if (!parsed.success) {
    const err = new Error('invalid_input');
    err.status = 400;
    return next(err);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>Vuln XSS Demo</title></head>
<body>
  <h1>Echo</h1>
  <p>Query: ${parsed.data.q}</p>
  <p style="color:#666">(intentional demo vulnerability)</p>
</body>
</html>`);
});

router.get('/safe-escape', (req, res, next) => {
  const parsed = qSchema.safeParse(req.query);
  if (!parsed.success) {
    const err = new Error('invalid_input');
    err.status = 400;
    return next(err);
  }

  const escaped = escapeHtml(parsed.data.q);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>Safe Escape</title></head>
<body>
  <h1>Escaped</h1>
  <p>Query: ${escaped}</p>
</body>
</html>`);
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { router };
