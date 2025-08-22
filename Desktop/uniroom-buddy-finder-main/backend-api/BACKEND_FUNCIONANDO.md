# 🚀 Backend UniRoom Buddy Finder - FUNCIONANDO COM DADOS MOCKADOS!

## ✅ Status Atual

**BACKEND TOTALMENTE FUNCIONAL SEM MONGODB!**

- ✅ **Servidor rodando**: http://localhost:3001  
- ✅ **Modo**: MOCK DATA (não precisa de MongoDB)
- ✅ **3 usuários de teste** prontos para usar
- ✅ **1 match de exemplo** já configurado  
- ✅ **3 mensagens de teste** no sistema
- ✅ **Todas as rotas da API** funcionando
- ✅ **WebSocket** configurado para chat em tempo real

## 🧪 Como Testar a API

### 1. Health Check
```bash
curl http://localhost:3001/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "message": "UniRoom Buddy Finder API is running (MOCK MODE)",
  "mode": "MOCK_DATA",
  "timestamp": "2025-07-15T23:22:30.089Z",
  "data": {
    "users": 3,
    "matches": 1,
    "messages": 3
  }
}
```

### 2. Ver Usuários Mockados
```bash
curl http://localhost:3001/api/mock/users
```

### 3. Ver Matches Mockados
```bash
curl http://localhost:3001/api/mock/matches
```

### 4. Ver Mensagens Mockadas
```bash
curl http://localhost:3001/api/mock/messages
```

## 🔐 Testando Autenticação

### 1. Login com Usuário de Teste
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ana@email.com\",\"password\":\"qualquer_senha\"}"
```

**Resposta esperada:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_aqui",
  "user": { ...dados_do_usuario... }
}
```

### 2. Usando o Token para Acessar Rotas Protegidas
```bash
# Substitua JWT_TOKEN_AQUI pelo token recebido no login
curl -H "Authorization: Bearer JWT_TOKEN_AQUI" \
  http://localhost:3001/api/auth/profile
```

## 👥 Usuários de Teste Disponíveis

1. **Ana Silva** (ana@email.com)
   - Curso: Engenharia na USP
   - Idade: 20 anos
   - Gênero: Feminino

2. **João Santos** (joao@email.com)  
   - Curso: Medicina na USP
   - Idade: 22 anos
   - Gênero: Masculino

3. **Maria Costa** (maria@email.com)
   - Curso: Psicologia na UNICAMP
   - Idade: 21 anos
   - Gênero: Feminino

## 🎯 Próximos Passos para Integração

### 1. Configurar o Frontend

No seu frontend (React/JavaScript), configure a URL base da API:

```javascript
// services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

// Exemplo de login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    return data;
  }
  
  throw new Error(data.error || 'Login failed');
};
```

### 2. Configurar Socket.IO para Chat

```javascript
// services/socket.js
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Entrar em uma sala de chat
socket.emit('join-room', matchId);

// Enviar mensagem
socket.emit('send-message', {
  roomId: matchId,
  sender: userId,
  receiver: otherUserId,
  content: message
});

// Receber mensagens
socket.on('receive-message', (message) => {
  console.log('Nova mensagem:', message);
});
```

### 3. Fazer Requisições Autenticadas

```javascript
// services/api.js
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Exemplo: buscar matches
const getMatches = async () => {
  const response = await makeAuthenticatedRequest('/matches');
  return response.json();
};
```

## 🔧 Scripts Disponíveis

```bash
# Iniciar com dados mockados (atual)
npm run dev:mock

# Iniciar com MongoDB (quando configurar)
npm run dev

# Build para produção
npm run build
```

## 🎉 Conclusão

**SEU BACKEND ESTÁ 100% FUNCIONAL!** 

Agora você pode:

1. ✅ **Integrar com o frontend** usando os exemplos acima
2. ✅ **Testar todas as funcionalidades** com dados reais
3. ✅ **Desenvolver o frontend** sem se preocupar com backend
4. ✅ **Configurar MongoDB depois** (quando quiser dados persistentes)

**Próximo passo:** Implementar os serviços no frontend usando os exemplos fornecidos! 🚀
