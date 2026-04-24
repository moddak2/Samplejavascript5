const request = require('supertest');
const { createApp } = require('../src/app');

describe('Express app', () => {
  test('GET /healthz returns ok', async () => {
    const app = createApp();
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test('POST /api/echo validates input', async () => {
    const app = createApp();

    const bad = await request(app)
      .post('/api/echo')
      .send({ message: '' })
      .set('Content-Type', 'application/json');

    expect(bad.statusCode).toBe(400);

    const good = await request(app)
      .post('/api/echo')
      .send({ message: 'hello' })
      .set('Content-Type', 'application/json');

    expect(good.statusCode).toBe(200);
    expect(good.body).toEqual({ echoed: 'hello' });
  });

  test('GET /demo/safe-escape escapes HTML', async () => {
    const app = createApp();
    const payload = '<script>alert(1)</script>';
    const res = await request(app)
      .get('/demo/safe-escape')
      .query({ q: payload });

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(res.text).not.toContain(payload);
  });

  test('GET /demo/vuln-xss is intentionally unsafe', async () => {
    process.env.DEMO_VULN_ENABLED = 'true';
    const app = createApp();
    const payload = '<img src=x onerror=alert(1)>';
    const res = await request(app)
      .get('/demo/vuln-xss')
      .query({ q: payload });

    expect(res.statusCode).toBe(200);
    // This asserts the intentional vulnerability exists.
    expect(res.text).toContain(payload);
  });
});
