import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "./VisaoGeral.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const API_URL_PESQUISAS = 'http://localhost:3000/pesquisas';
const API_URL_USUARIOS = 'http://localhost:3000/usuarios';

const VisaoGeral = () => {
  const [pesquisasPorEstado, setPesquisasPorEstado] = useState({
    emAndamento: 0,
    finalizada: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pesquisasResponse, usuarioResponse] = await Promise.all([
          fetch(API_URL_PESQUISAS),
          fetch(`${API_URL_USUARIOS}/${userId}`)
        ]);

        if (!pesquisasResponse.ok || !usuarioResponse.ok) {
          throw new Error('Falha ao buscar dados');
        }

        const pesquisas = await pesquisasResponse.json();
        const usuario = await usuarioResponse.json();

        const estados = pesquisas.reduce((acc, pesquisa) => {
          const resposta = usuario.respostas.find(r => r.pesquisaId === pesquisa.id);
          if (resposta && resposta.respostasPerguntas.length === pesquisa.perguntas.length) {
            acc.finalizada += 1;
          } else {
            acc.emAndamento += 1;
          }
          return acc;
        }, { emAndamento: 0, finalizada: 0 });

        setPesquisasPorEstado(estados);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const data = {
    labels: ['Em Andamento', 'Finalizada'],
    datasets: [
      {
        label: 'Estado das Pesquisas',
        data: [
          pesquisasPorEstado.emAndamento,
          pesquisasPorEstado.finalizada
        ],
        backgroundColor: [
          'rgba(255, 239, 124, 0.8)',  // Amarelo mais claro
          'rgba(92, 184, 92, 0.8)',     // Verde mais claro
      ],
      borderColor: [
          'rgba(255, 239, 124, 1)',     // Amarelo sólido mais claro
          'rgba(92, 184, 92, 1)',        // Verde sólido mais claro
      ],      
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000',
          font: {
            size: 16,
            weight: 500
          },
        },
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: '#000',
        font: {
          size: 16,
          weight: 'bold',
        },
        formatter: (value) => {
          return value > 0 ? value : '';
        },
      },
    },
  };

  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="visao-geral-container">
      <h1>Visão Geral</h1>
      <div className="content-container">
        <div className='grafico-container'>
          <h2>Estado das Pesquisas</h2>
          <Pie data={data} options={options} />
        </div>
        <div className="avisos">
          <h2>Avisos</h2>
          {pesquisasPorEstado.emAndamento > 0 ? (
            <p>Você tem {pesquisasPorEstado.emAndamento} pesquisa(s) em andamento.</p>
          ) : (
            <p>Você não possui nenhum aviso. Todas as pesquisas estão finalizadas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaoGeral;