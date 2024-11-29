import { useState, useEffect } from 'react';
import "./Usuarios.css";

const API_URL_USUARIOS = 'http://localhost:3000/usuarios';

const Usuarios = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tipo: 'user'
  });
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL_USUARIOS);
      if (!response.ok) {
        throw new Error('Falha ao buscar usuários');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setMessage('Erro ao carregar usuários. Por favor, tente novamente.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.email || !formData.password) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const newUser = {
        ...formData,
        id: `user${Date.now()}`, // Generate a unique ID
      };

      // Add 'respostas' array only for non-admin users
      if (formData.tipo === 'user') {
        newUser.respostas = [];
      }

      const response = await fetch(API_URL_USUARIOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar usuário');
      }

      const result = await response.json();
      setMessage('Usuário criado com sucesso!');
      setFormData({ email: '', password: '', tipo: 'user' });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setMessage('Erro ao criar usuário. Por favor, tente novamente.');
    }
  };

  return (
    <div className="usuario-container">
      <h2>Gerenciar Usuários</h2>
      {message && <p className={message.includes('sucesso') ? 'success-message' : 'error-message'}>{message}</p>}
      <form onSubmit={handleSubmit} className="create-user-form">
        <h3>Criar novo usuário</h3>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tipo">Tipo de usuário:</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
          >
            <option value="user">Colaborador</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Criar Usuário</button>
      </form>

      <div className="user-list">
        <h3>Usuários Existentes</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>E-mail</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.tipo === 'admin' ? 'Admin' : 'Colaborador'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;