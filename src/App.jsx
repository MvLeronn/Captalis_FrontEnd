import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import MinhasPesquisas from './Components/MinhasPesquisas/MinhasPesquisas';
import VisaoGeral from './Components/VisaoGeral/VisaoGeral';
import Relatorios from './Components/Relatorios/Relatorios';
import GerenciarPesquisas from './Components/GerenciarPesquisas/GerenciarPesquisas'
import Usuarios from './Components/Usuarios/Usuarios'
import Ajuda from './Components/Ajuda/Ajuda';

function App() {
    return (
        <Router>
            <div className='App'>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />}>
                        {/* Defina as rotas aninhadas aqui */}
                        <Route path="visao-geral" element={<VisaoGeral />} />
                        <Route path="minhaspesquisas" element={<MinhasPesquisas />} />
                        <Route path="relatorios" element={<Relatorios />} />
                        <Route path="gerenciar-pesquisas" element={<GerenciarPesquisas />} />
                        <Route path="usuarios" element={<Usuarios />} />
                        <Route path="ajuda" element={<Ajuda />} />
                        {/* Adicione outras rotas aqui, se necessário */}
                    </Route>

                </Routes>
            </div>
        </Router>
    );
}

export default App;