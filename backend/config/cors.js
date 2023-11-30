import cors from 'cors';

export function initCORS(app) {
  app.use(
    cors({
      origin: [
        `https://${process.env.HOST}`,
        `http://${process.env.HOST}`,
        `${process.env.HOST}`,
        'http://localhost:5173', // frontend for development purposes
      ],
      methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
      credentials: true, // enable set cookie
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
}
