import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import Modal from './Modal';
import "./MinhasPesquisas.css";

const API_URL_PESQUISAS = 'http://localhost:3000/pesquisas';
const API_URL_USUARIOS = 'http://localhost:3000/usuarios';

const MinhasPesquisas = () => {
  const [pesquisas, setPesquisas] = useState([]);
  const [userRespostas, setUserRespostas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [pesquisaAtualId, setPesquisaAtualId] = useState(null);
  const { userId } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pesquisasResponse, usuariosResponse] = await Promise.all([
          fetch(API_URL_PESQUISAS),
          fetch(`${API_URL_USUARIOS}/${userId}`)
        ]);

        if (!pesquisasResponse.ok || !usuariosResponse.ok) {
          throw new Error('Falha ao buscar dados');
        }

        const pesquisasData = await pesquisasResponse.json();
        const userData = await usuariosResponse.json();

        setPesquisas(pesquisasData);
        setUserRespostas(userData.respostas || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const abrirModal = useCallback((pesquisaId) => {
    setPesquisaAtualId(pesquisaId);
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setPesquisaAtualId(null);
  }, []);

  const atualizarRespostas = useCallback(async (pesquisaId, respostasPerguntas) => {
    try {
      const novaResposta = {
        pesquisaId,
        respostasPerguntas
      };

      const updatedRespostas = [...userRespostas, novaResposta];

      const response = await fetch(`${API_URL_USUARIOS}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ respostas: updatedRespostas }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar respostas');
      }

      setUserRespostas(updatedRespostas);
    } catch (error) {
      console.error("Erro ao atualizar respostas:", error);
    }
  }, [userId, userRespostas]);

  if (isLoading) {
    return (
      <div className="minhas-pesquisas-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  const pesquisaAtual = pesquisas.find(p => p.id === pesquisaAtualId);
  const respostasAtuais = userRespostas.find(r => r.pesquisaId === pesquisaAtualId);

  return (
    <div className="minhas-pesquisas-container">
      <h1>Minhas Pesquisas</h1>
      {pesquisas.length === 0 ? (
        <p className="no-pesquisas">Você ainda não tem pesquisas disponíveis.</p>
      ) : (
        <div>
          {pesquisas.map((pesquisa) => {
            const respondida = userRespostas.some(r => r.pesquisaId === pesquisa.id);
            return (
              <div key={pesquisa.id} className="pesquisa-item">
                <div className="pesquisa-info">
                  <h2>{pesquisa.titulo}</h2>
                  <p>{pesquisa.descricao}</p>
                  <div className="pesquisa-meta">
                    <ClipboardList size={16} />
                    <span>{pesquisa.perguntas.length} pergunta(s)</span>
                  </div>
                  <div className={`pesquisa-status ${respondida ? 'finalizada' : 'em-andamento'}`}>
                    {respondida ? 'Finalizada' : 'Em andamento'}
                  </div>
                </div>
                <button className="ver-detalhes-btn" onClick={() => abrirModal(pesquisa.id)}>
                  {respondida ? "Ver respostas" : "Responder"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modalAberto && pesquisaAtual && (
        <Modal 
          pesquisa={pesquisaAtual} 
          respostasAtuais={respostasAtuais}
          onClose={fecharModal} 
          onSave={atualizarRespostas}
        />
      )}
    </div>
  );
};

export default MinhasPesquisas;