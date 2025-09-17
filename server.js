const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const authRoutes = require('./mvc/routes/authRoutes');
const parkingRoutes = require('./mvc/routes/parkingRoutes');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'mvc', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'seu-segredo-super-secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

const necessitaLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

app.use('/', authRoutes);
app.use('/dashboard', necessitaLogin, parkingRoutes);

app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.listen(PORT, () => {
    console.log(`Servidor SecurityCar rodando em http://localhost:${PORT}`);
});