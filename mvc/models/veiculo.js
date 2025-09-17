const pool = require('../../config/db');

const Veiculo = {
  // Busca um veículo na tabela principal, independente de estar estacionado
  async buscarPorPlaca(placa) {
    const [rows] = await pool.query('SELECT * FROM veiculos WHERE placa = ?', [placa]);
    return rows[0];
  },

  // Busca o último registro de entrada ATIVO (sem saída)
  async buscarRegistroAtivoPorPlaca(placa) {
    const sql = `
      SELECT v.placa, v.modelo, v.cor, v.bloqueado, r.id as registro_id, r.horario_entrada
      FROM veiculos v
      JOIN registros r ON v.placa = r.veiculo_placa
      WHERE r.veiculo_placa = ? AND r.horario_saida IS NULL
    `;
    const [rows] = await pool.query(sql, [placa]);
    return rows[0];
  },

  async buscarRegistrosPorPlaca(placa) {
    const sql = `
      SELECT v.placa, v.modelo, v.cor, v.bloqueado, r.id as registro_id, r.horario_entrada, r.horario_saida
      FROM veiculos v
      JOIN registros r ON v.placa = r.veiculo_placa
      WHERE v.placa LIKE ?
      ORDER BY r.horario_entrada DESC
    `;
    // Usamos LIKE com '%' para permitir buscas parciais (ex: 'ABC')
    const [rows] = await pool.query(sql, [`%${placa}%`]);
    return rows;
  },

  // Retorna a lista de veículos DENTRO do pátio
  async obterEstacionados() {
    const sql = `
      SELECT v.placa, v.modelo, v.cor, v.bloqueado, r.id as registro_id, r.horario_entrada
      FROM veiculos v
      JOIN registros r ON v.placa = r.veiculo_placa
      WHERE r.horario_saida IS NULL
      ORDER BY r.horario_entrada DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },
  
  // Retorna o histórico de veículos que JÁ SAÍRAM
  async obterHistoricoSaidas() {
    const sql = `
      SELECT v.placa, v.modelo, v.cor, v.bloqueado, r.horario_entrada, r.horario_saida
      FROM veiculos v
      JOIN registros r ON v.placa = r.veiculo_placa
      WHERE r.horario_saida IS NOT NULL
      ORDER BY r.horario_saida DESC
    `;
     const [rows] = await pool.query(sql);
    return rows;
  },

  // Registra a ENTRADA
  async registrarEntrada(dados) {
    const { placa, modelo, cor } = dados;
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Passo 1: Insere ou atualiza o veículo na tabela `veiculos`
      const veiculoSQL = 'INSERT INTO veiculos (placa, modelo, cor) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE modelo = ?, cor = ?';
      await conn.query(veiculoSQL, [placa, modelo, cor, modelo, cor]);

      // Passo 2: Cria um novo registro de entrada na tabela `registros`
      const registroSQL = 'INSERT INTO registros (veiculo_placa, horario_entrada) VALUES (?, NOW())';
      await conn.query(registroSQL, [placa]);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      console.error(error);
      return false;
    } finally {
      conn.release();
    }
  },

  // Registra a SAÍDA
  async registrarSaida(placa) {
    const sql = 'UPDATE registros SET horario_saida = NOW() WHERE veiculo_placa = ? AND horario_saida IS NULL';
    const [result] = await pool.query(sql, [placa]);
    return result.affectedRows > 0;
  },
  
  // CORREÇÃO DEFINITIVA: Bloqueia/Desbloqueia o veículo na tabela principal
  async alternarBloqueio(placa) {
    const sql = 'UPDATE veiculos SET bloqueado = NOT bloqueado WHERE placa = ?';
    const [result] = await pool.query(sql, [placa]);
    return result.affectedRows > 0;
  }
};


module.exports = Veiculo;