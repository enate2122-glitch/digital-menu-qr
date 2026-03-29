// Ping the backend every 14 minutes to prevent Render free tier cold starts
const BACKEND = import.meta.env.VITE_API_URL ?? '';

if (BACKEND) {
  const ping = () => fetch(`${BACKEND}/health`, { method: 'GET' }).catch(() => {});
  ping(); // immediate ping on load
  setInterval(ping, 14 * 60 * 1000);
}
