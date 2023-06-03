module.exports = {
    PORT: process.env.PORT || 3000,
    DB_HOST: 'localhost',
    DB_PORT: process.env.DB_PORT || '3306',
    DB_USERNAME: process.env.DB_USERNAME || 'root',
    DB_USERNAME_PASSWORD: process.env.DB_USERNAME_PASSWORD || 'Pass@123',
    DB_NAME: process.env.DB_NAME || 'Metyis_Trip',
};
