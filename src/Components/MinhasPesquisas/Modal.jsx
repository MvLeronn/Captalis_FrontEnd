import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import "./Modal.css";

const Modal = ({ pesquisa, respostasAtuais, onClose, onSave }) => {
  const [respostas, setRespostas] = useState(
    respostasAtuais
      ? respostasAtuais.respostasPerguntas.reduce((acc, resposta) => {
          acc[resposta.perguntaId] = resposta.alternativaEscolhida;
          return acc;
        }, {})
      : {}
  );

  const handleRespostaChange = useCallback((perguntaId, alternativaId) => {
    if (!respostasAtuais) {
      setRespostas(prevRespostas => ({
        ...prevRespostas,
        [perguntaId]: alternativaId
      }));
    }
  }, [respostasAtuais]);

  const handleFinalizar = async () => {
    const respostasPerguntas = Object.entries(respostas).map(([perguntaId, alternativaId]) => ({
      perguntaId: parseInt(perguntaId),
      alternativaEscolhida: alternativaId
    }));
    await onSave(pesquisa.id, respostasPerguntas);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{pesquisa.titulo}</h2>
        <p>{pesquisa.descricao}</p>

        <div>
          <h3>Perguntas:</h3>
          {pesquisa.perguntas.map((pergunta) => (
            <div key={pergunta.id} className="pergunta-container">
              <p><strong>{pergunta.descricao}</strong></p>
              <div className="alternativas-container">
                {pergunta.alternativas.map((alternativa) => (
                  <label key={alternativa.id} className="alternativa-label">
                    <input
                      type="radio"
                      name={`pergunta-${pesquisa.id}-${pergunta.id}`}
                      value={alternativa.id}
                      checked={respostas[pergunta.id] === alternativa.id}
                      onChange={() => handleRespostaChange(pergunta.id, alternativa.id)}
                      disabled={respostasAtuais !== undefined}
                    />
                    {alternativa.texto}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          {!respostasAtuais && (
            <button onClick={handleFinalizar} className="finalizar-btn">
              Enviar Respostas
            </button>
          )}
          <button onClick={onClose} className="fechar-btn">
            {respostasAtuais ? "Fechar" : "Cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  pesquisa: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    descricao: PropTypes.string.isRequired,
    perguntas: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      descricao: PropTypes.string.isRequired,
      alternativas: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        texto: PropTypes.string.isRequired
      })).isRequired
    })).isRequired
  }).isRequired,
  respostasAtuais: PropTypes.shape({
    pesquisaId: PropTypes.string.isRequired,
    respostasPerguntas: PropTypes.arrayOf(PropTypes.shape({
      perguntaId: PropTypes.number.isRequired,
      alternativaEscolhida: PropTypes.shape({
        id: PropTypes.number.isRequired,
        texto: PropTypes.string.isRequired
      }).isRequired
    })).isRequired
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default Modal;