const exibirPaginaLogin = (req, res) => {
    res.render('login', { error: null });
};

const efetuarLogin = (req, res) => {
    const { username, password } = req.body;

    if (username === 'seguranca' && password === 'senha123') {
        req.session.user = { username: username };
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Credenciais inválidas.' });
    }
};

const efetuarLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

module.exports = {
    exibirPaginaLogin,
    efetuarLogin,
    efetuarLogout
};