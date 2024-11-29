import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BsX } from 'react-icons/bs';

const Modal = ({ pesquisa, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: pesquisa?.id || null,
    titulo: pesquisa?.titulo || '',
    descricao: pesquisa?.descricao || '',
    finalizada: pesquisa?.finalizada || false,
    perguntas: pesquisa?.perguntas || []
  });

  useEffect(() => {
    if (pesquisa) {
      setFormData({
        id: pesquisa.id,
        titulo: pesquisa.titulo,
        descricao: pesquisa.descricao,
        finalizada: pesquisa.finalizada,
        perguntas: pesquisa.perguntas || []
      });
    }
  }, [pesquisa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePerguntaChange = (index, field, value) => {
    const novasPerguntas = [...formData.perguntas];
    novasPerguntas[index][field] = value;
    setFormData({ ...formData, perguntas: novasPerguntas });
  };

  const handleAlternativaChange = (perguntaIndex, alternativaIndex, value) => {
    const novasPerguntas = [...formData.perguntas];
    novasPerguntas[perguntaIndex].alternativas[alternativaIndex].texto = value;
    setFormData({ ...formData, perguntas: novasPerguntas });
  };

  const adicionarAlternativa = (perguntaIndex) => {
    const novasPerguntas = [...formData.perguntas];
    const novaAlternativa = {
      id: novasPerguntas[perguntaIndex].alternativas.length + 1,
      texto: ''
    };
    novasPerguntas[perguntaIndex].alternativas.push(novaAlternativa);
    setFormData({ ...formData, perguntas: novasPerguntas });
  };

  const adicionarPergunta = () => {
    const novaPergunta = {
      id: formData.perguntas.length + 1,
      descricao: '',
      alternativaEscolhida: null,
      alternativas: []
    };
    setFormData({
      ...formData,
      perguntas: [...formData.perguntas, novaPergunta]
    });
  };

  const removerPergunta = (perguntaIndex) => {
    const novasPerguntas = formData.perguntas.filter((_, index) => index !== perguntaIndex);
    setFormData({ ...formData, perguntas: novasPerguntas });
  };

  const removerAlternativa = (perguntaIndex, alternativaIndex) => {
    const novasPerguntas = [...formData.perguntas];
    novasPerguntas[perguntaIndex].alternativas = novasPerguntas[perguntaIndex].alternativas.filter((_, index) => index !== alternativaIndex);
    setFormData({ ...formData, perguntas: novasPerguntas });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{pesquisa ? 'Editar Pesquisa' : 'Criar Nova Pesquisa'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título:</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descricao">Descrição:</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Perguntas:</label>
            {formData.perguntas.map((pergunta, perguntaIndex) => (
              <div key={perguntaIndex} className="pergunta-container">
                <div className="pergunta-header">
                  <input
                    type="text"
                    value={pergunta.descricao}
                    onChange={(e) => handlePerguntaChange(perguntaIndex, "descricao", e.target.value)}
                    placeholder="Digite a pergunta"
                    className="pergunta-input"
                  />
                  <button
                    type="button"
                    onClick={() => removerPergunta(perguntaIndex)}
                    className="btn-remover"
                  >
                    <BsX />
                  </button>
                </div>
                {pergunta.alternativas.map((alt, altIndex) => (
                  <div key={altIndex} className="alternativa-container">
                    <input
                      type="text"
                      value={alt.texto}
                      onChange={(e) => handleAlternativaChange(perguntaIndex, altIndex, e.target.value)}
                      placeholder="Digite a alternativa"
                      className="alternativa-input"
                    />
                    <button
                      type="button"
                      onClick={() => removerAlternativa(perguntaIndex, altIndex)}
                      className="btn-remover-alternativa"
                    >
                      <BsX />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => adicionarAlternativa(perguntaIndex)}
                  className="btn-adicionar-alternativa"
                >
                  Adicionar Alternativa
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={adicionarPergunta}
              className="btn-adicionar-pergunta"
            >
              Adicionar Pergunta
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-salvar">Salvar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

Modal.propTypes = {
  pesquisa: PropTypes.shape({
    id: PropTypes.number,
    titulo: PropTypes.string,
    descricao: PropTypes.string,
    finalizada: PropTypes.bool,
    perguntas: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      descricao: PropTypes.string,
      alternativaEscolhida: PropTypes.number,
      alternativas: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        texto: PropTypes.string
      }))
    }))
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Modal;