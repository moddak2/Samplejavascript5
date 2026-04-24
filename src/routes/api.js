const express = require('express');
const { z } = require('zod');

const router = express.Router();

const echoSchema = z.object({
  message: z.string().min(1).max(200)
});

router.post('/echo', (req, res, next) => {
  const parsed = echoSchema.safeParse(req.body);
  if (!parsed.success) {
    const err = new Error('invalid_input');
    err.status = 400;
    return next(err);
  }

  // Safe JSON response (no HTML rendering)
  res.status(200).json({
    echoed: parsed.data.message
  });
});

router.get('/redact-demo', (req, res) => {
  // This endpoint demonstrates redaction. It uses ONLY obviously fake sample strings.
  const samples = {
    username: 'demo_user_01',
    password: 'p@ssw0rd-FAKE-NOT-REAL',
    card: 'CARD-FAKE-4111-1111-1111-111X',
    idCard: 'YYMMDD-XXXXXXX-FAKE'
  };

  const redacted = {
    username: samples.username,
    password: '[REDACTED]',
    card: samples.card.replace(/[0-9A-Za-z]/g, '*'),
    idCard: samples.idCard.replace(/[0-9A-Za-z]/g, '*')
  };

  res.status(200).json({ samples: redacted });
});

module.exports = { router };
