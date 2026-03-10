import process from 'process';

const config = {
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev_only_secret_change_me',
    options: {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '10m',
    },
  },
};

export default config;
