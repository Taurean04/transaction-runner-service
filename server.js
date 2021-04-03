const sequelize = require('./config/database')
const config = require('./config/app');
const express = require('express');
const app = express();
const router = require('./routers/routes');
const cors = require('cors');
const bodyParser = require('body-parser');

app.disable('etag');


app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req,res) => {
    res.send(`Transaction Runner Service ${new Date()}`);
});

app.use('/transaction-runner-service/api', router);

app.listen(config.appPort, () => {
    console.log(`Listening on port: ${config.appPort} :earth_americas:`);
});

module.exports = app;