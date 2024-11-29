import { useState, useEffect } from 'react';
import './Relatorios.css';

const API_URL_PESQUISAS = 'http://localhost:3000/pesquisas';
const API_URL_USUARIOS = 'http://localhost:3000/usuarios';

const Relatorios = () => {
  const [pesquisas, setPesquisas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pesquisasResponse, usuariosResponse] = await Promise.all([
          fetch(API_URL_PESQUISAS),
          fetch(API_URL_USUARIOS)
        ]);

        if (!pesquisasResponse.ok || !usuariosResponse.ok) {
          throw new Error('Falha ao buscar dados');
        }

        const pesquisasData = await pesquisasResponse.json();
        const usuariosData = await usuariosResponse.json();

        setPesquisas(pesquisasData);
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError('Falha ao carregar os dados. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calcularEstatisticas = (pesquisa) => {
    const totalRespostas = usuarios.filter(user => 
      user.respostas && user.respostas.some(r => r.pesquisaId === pesquisa.id)
    ).length;

    const estatisticasPorPergunta = pesquisa.perguntas.map(pergunta => {
      const respostas = usuarios.flatMap(user => 
        user.respostas ? user.respostas
          .filter(r => r.pesquisaId === pesquisa.id)
          .flatMap(r => r.respostasPerguntas)
          .filter(rp => rp.perguntaId === pergunta.id)
        : []
      );

      const contagemAlternativas = pergunta.alternativas.map(alt => ({
        id: alt.id,
        texto: alt.texto,
        contagem: respostas.filter(r => r.alternativaEscolhida === alt.id).length
      }));

      const alternativaMaisEscolhida = contagemAlternativas.reduce((prev, current) => 
        (prev.contagem > current.contagem) ? prev : current
      );

      return {
        perguntaId: pergunta.id,
        descricao: pergunta.descricao,
        alternativaMaisEscolhida,
        contagemAlternativas
      };
    });

    return { totalRespostas, estatisticasPorPergunta };
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="relatorios-container">
      <h1>Relatórios de Pesquisas</h1>
      {pesquisas.map(pesquisa => {
        const { totalRespostas, estatisticasPorPergunta } = calcularEstatisticas(pesquisa);
        return (
          <div key={pesquisa.id} className="pesquisa-relatorio">
            <h2>{pesquisa.titulo}</h2>
            <p><strong>Descrição:</strong> {pesquisa.descricao}</p>
            
            <h3>Estatísticas por Pergunta:</h3>
            {estatisticasPorPergunta.map(estatistica => (
              <div key={estatistica.perguntaId} className="pergunta-estatistica">
                <h4>{estatistica.descricao}</h4>
                <p><strong>Alternativa mais escolhida:</strong> {estatistica.alternativaMaisEscolhida.texto} ({estatistica.alternativaMaisEscolhida.contagem} vezes)</p>
                <h5>Contagem de todas as alternativas:</h5>
                <ul>
                  {estatistica.contagemAlternativas.map(alt => (
                    <li key={alt.id}>{alt.texto}: {alt.contagem}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Relatorios;