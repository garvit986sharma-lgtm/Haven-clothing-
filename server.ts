import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for orders
app.post('/api/orders', (req: Request, res: Response) => {
  const orderNumber = `HVN-${Date.now().toString().slice(-8)}`;
  res.json({ ok: true, orderNumber });
});

// Health check endpoint for Cloud Run
app.get('/healthz', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Serve production static assets from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: send index.html for any unhandled routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HAVEN server listening on port ${PORT}`);
});
