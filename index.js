const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const database = require('./config/database');
const systemConfig = require('./config/system')

const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'pug');

// flash message
app.use(cookieParser('VINH981'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash message

// Set locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);