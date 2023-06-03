const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') dotenv.config();

const config1 = require('config');
const PORT = 8080;
const DB_HOST = 3306;

//console.log("Port No: " + config1.get("PORT"));

const app = require('./app');
app.listen(PORT, () => console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`));
