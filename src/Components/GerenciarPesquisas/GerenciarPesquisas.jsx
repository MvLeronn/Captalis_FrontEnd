import { useState, useEffect } from 'react';
import { BsFillTrashFill, BsFillPencilFill, BsPlusCircle } from "react-icons/bs";
import Modal from './Modal';
import "./GerenciarPesquisas.css";

const url = "http://localhost:3000/pesquisas";

const GerenciarPesquisas = () => {
  const [pesquisas, setPesquisas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pesquisaAtual, setPesquisaAtual] = useState(null);

  useEffect(() => {
    fetchPesquisas();
  }, []);

  const fetchPesquisas = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Falha ao buscar pesquisas');
      }
      const data = await response.json();
      setPesquisas(data);
    } catch (error) {
      console.error('Erro ao buscar pesquisas:', error);
    }
  };

  const abrirModal = (pesquisa = null) => {
    setPesquisaAtual(pesquisa || { titulo: '', descricao: '', perguntas: [] });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPesquisaAtual(null);
  };

  const salvarPesquisa = async (pesquisa) => {
    try {
      const method = pesquisa.id ? 'PUT' : 'POST';
      const urlWithId = pesquisa.id ? `${url}/${pesquisa.id}` : url;
      
      const response = await fetch(urlWithId, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pesquisa),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar pesquisa');
      }

      await fetchPesquisas(); // Recarrega a lista de pesquisas
      fecharModal();
    } catch (error) {
      console.error('Erro ao salvar pesquisa:', error);
    }
  };

  const excluirPesquisa = async (id) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir pesquisa');
      }

      await fetchPesquisas(); // Recarrega a lista de pesquisas
    } catch (error) {
      console.error('Erro ao excluir pesquisa:', error);
    }
  };

  return (
    <div className="gerenciar-pesquisas">
      <h1>Gerenciar Pesquisas</h1>
      <button className="btn-adicionar" onClick={() => abrirModal()}>
        <BsPlusCircle /> Adicionar Pesquisa
      </button>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pesquisas.map((pesquisa) => (
              <tr key={pesquisa.id}>
                <td>{pesquisa.titulo}</td>
                <td>{pesquisa.descricao}</td>
                <td>
                  <span className="actions">
                    <BsFillPencilFill className="edit" onClick={() => abrirModal(pesquisa)} />
                    <BsFillTrashFill className="delete" onClick={() => excluirPesquisa(pesquisa.id)} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalAberto && (
        <Modal
          pesquisa={pesquisaAtual}
          onClose={fecharModal}
          onSave={salvarPesquisa}
        />
      )}
    </div>
  );
};

export default GerenciarPesquisas;