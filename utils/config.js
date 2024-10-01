if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV is required in the environment configuration.');
}

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const config = {
    port: process.env.PORT || 3000,
    dbUri: process.env.DB_URI,
    environment: process.env.NODE_ENV || 'development'
};

if (!config.dbUri) {
    throw new Error('DB_URI is required in the environment configuration.');
}

module.exports = config;