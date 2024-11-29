import { FaUser, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/logo.svg';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (username && password) {
            try {
                // Fazendo uma requisição GET para obter os usuários do db.json
                const response = await fetch('data/db.json'); // Substitua pelo caminho correto do seu db.json
                const data = await response.json();

                // Verifica se a requisição foi bem-sucedida
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Encontrar o usuário com base no email e senha
                const usuarioEncontrado = data.usuarios.find(user => user.email === username && user.password === password);

                if (usuarioEncontrado) {
                    // Armazena o ID do usuário e o tipo de usuário no localStorage
                    localStorage.setItem("userId", usuarioEncontrado.id);
                    localStorage.setItem("userType", usuarioEncontrado.tipo);

                    // Redireciona para o dashboard com base no tipo de usuário
                    if (usuarioEncontrado.tipo === "admin") {
                        navigate("/dashboard/gerenciar-pesquisas");
                    } else {
                        navigate("/dashboard/visao-geral");
                    }
                } else {
                    alert("E-mail ou senha inválidos.");
                }
            } catch (error) {
                console.error("Error fetching the user data:", error);
                alert("Erro ao tentar fazer login. Tente novamente mais tarde.");
            }
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src={logo} alt="Logo da Captalis" />
                <p>Metrificando felicidade.</p>
            </div>
            <div className="login-right">
                <form onSubmit={handleSubmit} className="login-form">
                    <h1>Logar</h1>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="E-mail"
                            name="email" 
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Senha"
                            name="password" 
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FaLock className="icon" />
                    </div>
                    <div className="recall-forget">
                        <label>
                            <input type="checkbox"/>
                            Lembre de mim?
                        </label>
                        <a href="#">Esqueceu a senha?</a>
                    </div>
                    <button type="submit">Entrar</button>
                    <div className="signup-link">
                        <p>Não tem uma conta? <a href="#">Crie aqui</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
