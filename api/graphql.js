import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: process.env.PLAYGROUND_API, // Same backend API URL
  changeOrigin: true,
  pathRewrite: {
    '^/api/graphql': '/query', // Adjust the path to match your backend endpoint
  },
});