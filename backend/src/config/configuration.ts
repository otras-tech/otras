export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    url: process.env.REDIS_URL,
    disable: process.env.DISABLE_REDIS === 'true',
  },
  jwt: {
    accessSecret: (process.env.JWT_ACCESS_SECRET || 'secret').trim(),
    refreshSecret: (process.env.JWT_REFRESH_SECRET || 'secret').trim(),
  },

});
