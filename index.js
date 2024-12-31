const express = require('express');
var path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const moment = require('moment');
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

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// flash message
app.use(cookieParser('VINH981'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash message

// tiny mce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// end tiny mce

// Set locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

routeAdmin(app);
route(app);

app.get("*", (req, res) => {
    res.render("client/pages/error/404", {
        title: "404 Not Found"
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);