import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Dados estáticos para login - múltiplos usuários
const VALID_CREDENTIALS = [
  {
    email: 'user@test.com',
    password: '123456'
  },
  {
    email: 'admin@test.com',
    password: '123456'
  },
  {
    email: 'maria@test.com',
    password: '123456'
  }
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(state => state.user);

  // Verificar se usuário já está logado
  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de senha
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validações
    const newErrors: { email?: string; password?: string } = {};
    
    if (!validateEmail(email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Verificar credenciais estáticas
    const validUser = VALID_CREDENTIALS.find(cred => 
      cred.email === email && cred.password === password
    );
    
    if (!validUser) {
      setErrors({ 
        email: 'Credenciais inválidas',
        password: 'Credenciais inválidas'
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simular delay de autenticação
    setTimeout(() => {
      dispatch(login({ email }));
      navigate('/home');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Playlist Manager</h1>
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="Email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder="Senha"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-help">
          <p><strong>Usuários disponíveis para teste:</strong></p>
          <div className="credentials-list">
            <div>
              <strong>👤 Usuário 1:</strong> user@test.com | 123456
            </div>
            <div>
              <strong>👨‍💼 Admin:</strong> admin@test.com | 123456
            </div>
            <div>
              <strong>👩 Maria:</strong> maria@test.com | 123456
            </div>
          </div>
          <p><small>Cada usuário terá suas próprias playlists!</small></p>
        </div>
      </div>
    </div>
  );
};

export default Login;