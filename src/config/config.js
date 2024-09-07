
const dotenv = require('dotenv');
const { program } = require('../utils/commander');
const { mode } = program.opts();

dotenv.config({
  path: mode === 'production' ? './.env.production' : './.env.development'
});

exports.objectConfig = {
  port: process.env.PORT || 8080,
  mongo_url: process.env.MONGO_URL,
  mongo_secret: process.env.MONGO_SECRET,
  gmail_user: process.env.GMAIL_USER,
  gmail_pass: process.env.GMAIL_PASS,
  persistence: process.env.PERSISTENCE || 'MONGO',
  execMode: mode,
  api_url: process.env.API_URL,
  app_url: process.env.APP_URL,
  git_hub_id: process.env.GITHUB_CLIENT_ID,
  git_hub_secret: process.env.GITHUB_CLIENT_SECRET,
};

