# 🔗 Guia de Integração Frontend-Backend

## 📋 Configuração Inicial

### 1. Configurar a URL da API no Frontend

```javascript
// config/api.js ou constants.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  SOCKET_URL: 'http://localhost:3001',
  VERSION: 'v1'
};
```

### 2. Instalar Dependências no Frontend

```bash
# Para React/Next.js
npm install axios socket.io-client

# Para outros frameworks
npm install fetch socket.io-client
```

## 🔐 Sistema de Autenticação

### Serviço de Autenticação

```javascript
// services/authService.js
import axios from 'axios';
import { API_CONFIG } from '../config/api';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para adicionar token automaticamente
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para lidar com respostas
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Registrar usuário
  async register(userData) {
    try {
      const response = await this.api.post('/auth/register', userData);
      
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro no registro');
    }
  }

  // Login
  async login(email, password) {
    try {
      const response = await this.api.post('/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro no login');
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const response = await this.api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      throw new Error('Erro ao obter usuário');
    }
  }

  // Verificar se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  // Obter token
  getToken() {
    return localStorage.getItem('auth_token');
  }

  // Obter usuário do localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
```

## 👥 Serviço de Usuários

```javascript
// services/userService.js
import authService from './authService';

class UserService {
  constructor() {
    this.api = authService.api;
  }

  // Obter usuários com filtros
  async getUsers(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await this.api.get(`/users?${params}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar usuários');
    }
  }

  // Obter matches potenciais
  async getPotentialMatches() {
    try {
      const response = await this.api.get('/users/matches');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar matches');
    }
  }

  // Curtir usuário
  async likeUser(userId) {
    try {
      const response = await this.api.post(`/users/${userId}/like`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao curtir usuário');
    }
  }

  // Rejeitar usuário
  async dislikeUser(userId) {
    try {
      const response = await this.api.post(`/users/${userId}/dislike`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao rejeitar usuário');
    }
  }

  // Obter perfil de usuário
  async getUserProfile(userId) {
    try {
      const response = await this.api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar perfil');
    }
  }

  // Atualizar perfil
  async updateProfile(userData) {
    try {
      const response = await this.api.put('/auth/updatedetails', userData);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar perfil');
    }
  }
}

export default new UserService();
```

## 💕 Serviço de Matches

```javascript
// services/matchService.js
import authService from './authService';

class MatchService {
  constructor() {
    this.api = authService.api;
  }

  // Obter meus matches
  async getMyMatches(page = 1, limit = 10) {
    try {
      const response = await this.api.get(`/matches?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar matches');
    }
  }

  // Obter match específico
  async getMatch(matchId) {
    try {
      const response = await this.api.get(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar match');
    }
  }

  // Desfazer match
  async unmatch(matchId) {
    try {
      const response = await this.api.put(`/matches/${matchId}`, {
        action: 'unmatch'
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao desfazer match');
    }
  }

  // Obter estatísticas
  async getStats() {
    try {
      const response = await this.api.get('/matches/stats');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar estatísticas');
    }
  }
}

export default new MatchService();
```

## 💬 Serviço de Mensagens + WebSocket

```javascript
// services/messageService.js
import authService from './authService';
import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/api';

class MessageService {
  constructor() {
    this.api = authService.api;
    this.socket = null;
    this.messageListeners = [];
  }

  // Conectar ao WebSocket
  connect() {
    if (this.socket?.connected) return;

    this.socket = io(API_CONFIG.SOCKET_URL, {
      auth: {
        token: authService.getToken()
      }
    });

    this.socket.on('connect', () => {
      console.log('🔌 Conectado ao WebSocket');
      
      // Entrar na sala do usuário
      const user = authService.getUser();
      if (user) {
        this.socket.emit('join-room', `user_${user._id}`);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado do WebSocket');
    });

    // Escutar novas mensagens
    this.socket.on('new-message', (data) => {
      this.messageListeners.forEach(listener => {
        listener('new-message', data);
      });
    });

    // Escutar mensagens lidas
    this.socket.on('message-read', (data) => {
      this.messageListeners.forEach(listener => {
        listener('message-read', data);
      });
    });

    // Escutar novos matches
    this.socket.on('new-match', (data) => {
      this.messageListeners.forEach(listener => {
        listener('new-match', data);
      });
    });
  }

  // Desconectar WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Adicionar listener para eventos
  addMessageListener(callback) {
    this.messageListeners.push(callback);
  }

  // Remover listener
  removeMessageListener(callback) {
    this.messageListeners = this.messageListeners.filter(
      listener => listener !== callback
    );
  }

  // Entrar em uma sala de chat
  joinChatRoom(matchId) {
    if (this.socket) {
      this.socket.emit('join-room', matchId);
    }
  }

  // Obter mensagens de um match
  async getMessages(matchId, page = 1, limit = 50) {
    try {
      const response = await this.api.get(
        `/messages/matches/${matchId}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar mensagens');
    }
  }

  // Enviar mensagem
  async sendMessage(matchId, content, messageType = 'text') {
    try {
      const response = await this.api.post(`/messages/matches/${matchId}/messages`, {
        content,
        messageType
      });

      // Também enviar via WebSocket para tempo real
      if (this.socket) {
        this.socket.emit('send-message', {
          roomId: matchId,
          content,
          sender: authService.getUser()?._id
        });
      }

      return response.data;
    } catch (error) {
      throw new Error('Erro ao enviar mensagem');
    }
  }

  // Marcar mensagem como lida
  async markAsRead(messageId) {
    try {
      const response = await this.api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao marcar como lida');
    }
  }

  // Obter contagem de não lidas
  async getUnreadCount() {
    try {
      const response = await this.api.get('/messages/unread-count');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao carregar contagem');
    }
  }
}

export default new MessageService();
```

## 🎛️ Hook React para Autenticação

```javascript
// hooks/useAuth.js (para React)
import { useState, useEffect, createContext, useContext } from 'react';
import authService from '../services/authService';
import messageService from '../services/messageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Conectar ao WebSocket quando autenticado
        messageService.connect();
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.data);
      setIsAuthenticated(true);
      messageService.connect();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.data);
      setIsAuthenticated(true);
      messageService.connect();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    messageService.disconnect();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
```

## 📱 Exemplo de Componentes React

### Componente de Login

```jsx
// components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Redirecionar para dashboard
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login - UniRoom Buddy Finder</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default Login;
```

### Componente de Matches

```jsx
// components/MatchList.jsx
import React, { useState, useEffect } from 'react';
import userService from '../services/userService';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await userService.getPotentialMatches();
      setMatches(response.data);
    } catch (error) {
      console.error('Erro ao carregar matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (userId) => {
    try {
      const response = await userService.likeUser(userId);
      
      if (response.isMatch) {
        alert('É um match! 🎉');
      }
      
      // Remover da lista
      setMatches(matches.filter(match => match._id !== userId));
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const handleDislike = async (userId) => {
    try {
      await userService.dislikeUser(userId);
      setMatches(matches.filter(match => match._id !== userId));
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
    }
  };

  if (loading) return <div>Carregando matches...</div>;

  return (
    <div className="match-list">
      <h2>Matches Potenciais</h2>
      
      {matches.map((match) => (
        <div key={match._id} className="match-card">
          <img src={match.avatar || '/default-avatar.png'} alt={match.name} />
          
          <div className="match-info">
            <h3>{match.name}, {match.age}</h3>
            <p>{match.course} - {match.university}</p>
            <p>{match.location.city}, {match.location.state}</p>
            <p>Compatibilidade: {match.compatibilityScore}%</p>
            
            {match.bio && <p className="bio">{match.bio}</p>}
            
            <div className="interests">
              {match.interests.map((interest, index) => (
                <span key={index} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="actions">
            <button 
              className="dislike-btn"
              onClick={() => handleDislike(match._id)}
            >
              ❌
            </button>
            <button 
              className="like-btn"
              onClick={() => handleLike(match._id)}
            >
              ❤️
            </button>
          </div>
        </div>
      ))}
      
      {matches.length === 0 && (
        <p>Nenhum match disponível no momento.</p>
      )}
    </div>
  );
};

export default MatchList;
```

### Componente de Chat

```jsx
// components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import messageService from '../services/messageService';
import { useAuth } from '../hooks/useAuth';

const Chat = ({ matchId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();
    
    // Entrar na sala do chat
    messageService.joinChatRoom(matchId);
    
    // Escutar novas mensagens
    const handleNewMessage = (event, data) => {
      if (event === 'new-message' && data.matchId === matchId) {
        setMessages(prev => [...prev, data.message]);
      }
    };
    
    messageService.addMessageListener(handleNewMessage);
    
    return () => {
      messageService.removeMessageListener(handleNewMessage);
    };
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await messageService.getMessages(matchId);
      setMessages(response.data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      await messageService.sendMessage(matchId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  if (loading) return <div>Carregando chat...</div>;

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${
              message.sender._id === user._id ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
              {message.sender._id === user._id && (
                <span className={`read-status ${message.isRead ? 'read' : 'unread'}`}>
                  {message.isRead ? '✓✓' : '✓'}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          maxLength={1000}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;
```

## 🚀 Inicialização do App

```jsx
// App.jsx
import React from 'react';
import { AuthProvider } from './hooks/useAuth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MatchList from './components/MatchList';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/matches" 
              element={
                <ProtectedRoute>
                  <MatchList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat/:matchId" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## ✅ Checklist de Integração

### 1. Configuração Base
- [ ] Instalar dependências (`axios`, `socket.io-client`)
- [ ] Configurar URLs da API
- [ ] Configurar interceptors do Axios
- [ ] Configurar CORS no backend (já feito)

### 2. Autenticação
- [ ] Implementar serviço de autenticação
- [ ] Criar contexto/hook de autenticação
- [ ] Implementar rotas protegidas
- [ ] Gerenciar tokens no localStorage

### 3. WebSocket
- [ ] Conectar ao Socket.IO
- [ ] Implementar listeners de mensagens
- [ ] Gerenciar conexão/desconexão
- [ ] Implementar eventos em tempo real

### 4. Funcionalidades
- [ ] Sistema de matches (like/dislike)
- [ ] Chat em tempo real
- [ ] Perfis de usuários
- [ ] Dashboard/estatísticas

## 🔧 Comandos para Testar

```bash
# 1. Certificar que o backend está rodando
cd backend-api
npm run dev

# 2. Popular com dados de teste
npm run seed

# 3. Testar endpoints manualmente
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao.silva@email.com","password":"Password123"}'
```

## 🎯 Próximos Passos

1. **Implementar os serviços** no seu frontend
2. **Configurar roteamento** e autenticação
3. **Testar funcionalidades** uma por uma
4. **Implementar interface** de usuário
5. **Testar WebSocket** para chat em tempo real

---

**O backend está 100% pronto para integração! 🚀**
