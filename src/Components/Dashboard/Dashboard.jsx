import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { FaChartPie, FaClipboardList, FaTasks, FaChartBar, FaUsers, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState('visao-geral');
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState(""); // Novo estado para o ID do usuário
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedUserId = localStorage.getItem("userId"); // Pega o ID do usuário

    if (storedUserType) {
      setUserType(storedUserType);
    }
    if (storedUserId) {
      setUserId(storedUserId); // Armazena o ID do usuário no estado
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userId"); // Limpa o ID do usuário ao sair
    navigate('/'); // Navega para a página inicial
  };

  // Itens de menu para cada tipo de usuário
  const allMenuItems = [
    { name: 'Visão Geral', icon: FaChartPie, route: 'visao-geral', roles: ['user'] },
    { name: 'Minhas Pesquisas', icon: FaClipboardList, route: 'minhaspesquisas', roles: ['user'] },
    { name: 'Gerenciar Pesquisas', icon: FaTasks, route: 'gerenciar-pesquisas', roles: ['admin'] },
    { name: 'Relatórios', icon: FaChartBar, route: 'relatorios', roles: ['admin'] },
    { name: 'Usuários', icon: FaUsers, route: 'usuarios', roles: ['admin'] },
    { name: 'Ajuda', icon: FaQuestionCircle, route: 'ajuda', roles: ['user'] },
  ];

  // Filtra itens de menu com base no tipo de usuário
  const menuItems = allMenuItems.filter(item => item.roles.includes(userType));

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.route}
              className={activeItem === item.route ? 'active' : ''}
              onClick={() => setActiveItem(item.route)}
            >
              <item.icon />
              {item.name}
            </Link>
          ))}
          <button onClick={handleLogout}>
            <FaSignOutAlt />
            Sair
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-card">
        <Outlet context={{ userId }} /> {/* Renderiza o componente da rota ativa */}
        </div>
      </main>
    </div>
  );
}
