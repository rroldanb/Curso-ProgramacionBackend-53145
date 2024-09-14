
const dotenv = require('dotenv');
const { program } = require('../utils/commander');
const { mode } = program.opts();

dotenv.config({
  path: mode === 'production' ? './.env.production' : './.env.development'
});

exports.objectConfig = {
  execMode: mode,
  port: process.env.PORT || 8080,
  mongo_url: process.env.MONGO_URL,
  admin_name:process.env.ADMIN_NAME,
  admin_password:process.env.ADMIN_PASSWORD,
  mongo_secret: process.env.MONGO_SECRET,
  gmail_user: process.env.GMAIL_USER,
  gmail_pass: process.env.GMAIL_PASS,
  persistence: process.env.PERSISTENCE || 'MONGO',
  api_url: process.env.API_URL,
  app_url: process.env.APP_URL,
  git_hub_id: process.env.GITHUB_CLIENT_ID,
  git_hub_secret: process.env.GITHUB_CLIENT_SECRET,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
};

