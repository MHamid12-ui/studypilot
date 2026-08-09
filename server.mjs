import express from 'express';
import https from 'https';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Proxy Flowise API requests to avoid CORS in production
app.post('/api/flowise-proxy', (req, res) => {
  const body = JSON.stringify(req.body);

  const options = {
    hostname: 'cloud.flowiseai.com',
    port: 443,
    path: '/api/v1/prediction/a56eb5e1-dae2-4b14-896d-ed599739d64d',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    timeout: 20000,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => { data += chunk; });
    proxyRes.on('end', () => {
      res.status(proxyRes.statusCode || 502);
      res.json(data);
    });
  });

  proxyReq.on('error', (err) => {
    console.error('Flowise proxy error:', err.message);
    res.status(502).json({
      error: 'AI Tutor is temporarily unavailable. Please try again.',
    });
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    res.status(504).json({
      error: 'AI Tutor is temporarily unavailable. Please try again.',
    });
  });

  proxyReq.write(body);
  proxyReq.end();
});

// Serve static files from the built dist directory
app.use(express.static('dist'));

// Fallback to index.html for SPA routing (must be after API routes)
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', { root: '.' });
});

app.listen(PORT, () => {
  console.log(`StudyPilot server running on http://localhost:${PORT}`);
});