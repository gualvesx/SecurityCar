const Veiculo = require('../models/veiculo');

// A função principal agora é async e com a lógica de busca
const exibirDashboard = async (req, res) => {
  try {
    const { placa_pesquisa } = req.query;
    let veiculosNoPatio = [];
    let historicoSaidas = [];
    let placaParaRegistrar = null;

    if (placa_pesquisa) {
      const todosOsRegistros = await Veiculo.buscarRegistrosPorPlaca(placa_pesquisa);
      if (todosOsRegistros.length > 0) {
        veiculosNoPatio = todosOsRegistros.filter(v => v.horario_saida === null);
        historicoSaidas = todosOsRegistros.filter(v => v.horario_saida !== null);
      } else {
        // Se a busca não retornou nada, preparamos para registrar a placa
        placaParaRegistrar = placa_pesquisa;
      }
    } else {
      veiculosNoPatio = await Veiculo.obterEstacionados();
      historicoSaidas = await Veiculo.obterHistoricoSaidas();
    }
    
    const totalDeCarrosNoPatio = await Veiculo.obterEstacionados();

    res.render('dashboard', {
      veiculosNoPatio,
      historicoSaidas,
      totalCars: totalDeCarrosNoPatio.length,
      user: req.session.user,
      placaParaRegistrar // Envia a placa pesquisada para a view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar dados do estacionamento.");
  }
};

const registrarEntradaVeiculo = async (req, res) => {
  const { placa, modelo, cor } = req.body;
  
  const veiculoExistente = await Veiculo.buscarPorPlaca(placa.toUpperCase());
  if (veiculoExistente && veiculoExistente.bloqueado) {
      return res.status(403).send("Este veículo está bloqueado e não pode entrar.");
  }

  await Veiculo.registrarEntrada({ placa: placa.toUpperCase(), modelo, cor });
  res.redirect('/dashboard');
};

const registrarSaidaVeiculo = async (req, res) => {
  const { placa } = req.params;
  await Veiculo.registrarSaida(placa);
  res.redirect('/dashboard');
};

const registrarRetornoVeiculo = async (req, res) => {
    const { placa } = req.params;
    const veiculo = await Veiculo.buscarPorPlaca(placa);
    if (veiculo) {
        await Veiculo.registrarEntrada({ placa: veiculo.placa, modelo: veiculo.modelo, cor: veiculo.cor });
    }
    res.redirect('/dashboard');
};

const alternarBloqueioVeiculo = async (req, res) => {
  const { placa } = req.params;
  await Veiculo.alternarBloqueio(placa);
  res.redirect('/dashboard');
};

module.exports = {
  exibirDashboard,
  registrarEntradaVeiculo,
  registrarSaidaVeiculo,
  registrarRetornoVeiculo,
  alternarBloqueioVeiculo
};
