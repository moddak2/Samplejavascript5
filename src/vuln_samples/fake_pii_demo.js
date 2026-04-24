/*
  INTENTIONAL DEMO FILE (DO NOT USE IN PRODUCTION)

  This file contains ONLY obviously fake "PII-like" strings for scanner/demo purposes.
  They are not real, not valid, and patterns are intentionally broken.
*/

const FAKE_DEMO_RECORD = {
  username: 'demo_user_01',
  // Not a real password; demo-only string.
  password: 'p@ssw0rd-FAKE-NOT-REAL',
  // Not a valid card number (contains X).
  cardNumber: 'CARD-FAKE-4111-1111-1111-111X',
  // Not a valid national ID format (contains letters and placeholders).
  idCardNumber: 'YYMMDD-1ABCDEF-FAKE'
};

module.exports = { FAKE_DEMO_RECORD };
