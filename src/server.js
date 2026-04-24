const { createApp } = require('./app');
const { getConfig } = require('./config');

const app = createApp();

const { PORT: port } = getConfig();
const server = app.listen(port, () => {
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;
  // Avoid logging sensitive data; only port.
  console.log(`listening on ${actualPort}`);
});
