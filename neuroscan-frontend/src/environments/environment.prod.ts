declare var process: any;
// Vercel can inject this at build time, or we fallback to our Render URL
export const environment = {
  production: true,
  // You should change the fallback URL below to your actual Render URL after deploying it
  apiUrl: (process.env['NG_API_URL'] || 'https://neuroscan-backend.onrender.com').replace(/\/$/, '') + '/api/v1'
};
