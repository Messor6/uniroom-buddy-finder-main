# 🧪 Exemplos de Teste da API

## 📋 Testando Endpoints com cURL

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Registrar Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Usuario",
    "email": "teste@email.com",
    "password": "Password123",
    "university": "Universidade Teste",
    "course": "Engenharia",
    "graduationYear": 2025,
    "age": 21,
    "gender": "male",
    "bio": "Estudante buscando colega de quarto",
    "interests": ["programação", "jogos", "filmes"],
    "lifestyle": {
      "sleepSchedule": "night-owl",
      "cleanliness": "clean",
      "socialLevel": "moderate",
      "studyHabits": "quiet",
      "smokingDrinking": "occasionally"
    },
    "location": {
      "city": "São Paulo",
      "state": "SP",
      "country": "Brasil"
    },
    "budget": {
      "min": 800,
      "max": 1500,
      "currency": "BRL"
    }
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "password": "Password123"
  }'
```

### 4. Obter Perfil (com token)
```bash
# Substitua SEU_TOKEN pelo token recebido no login
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 5. Obter Matches Potenciais
```bash
curl -X GET http://localhost:3001/api/users/matches \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 6. Curtir Usuário
```bash
# Substitua USER_ID pelo ID do usuário
curl -X POST http://localhost:3001/api/users/USER_ID/like \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🎯 Testando com JavaScript (Console do Browser)

### 1. Configurar Base
```javascript
const API_BASE = 'http://localhost:3001/api';
let authToken = '';

// Função helper para requisições
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }
  
  return data;
}
```

### 2. Testar Login
```javascript
async function testLogin() {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'joao.silva@email.com',
        password: 'Password123'
      })
    });
    
    authToken = response.token;
    console.log('✅ Login realizado:', response);
    return response;
  } catch (error) {
    console.error('❌ Erro no login:', error);
  }
}

// Executar
testLogin();
```

### 3. Testar Matches
```javascript
async function testMatches() {
  try {
    const response = await apiRequest('/users/matches');
    console.log('✅ Matches encontrados:', response);
    return response;
  } catch (error) {
    console.error('❌ Erro ao carregar matches:', error);
  }
}

// Executar após login
testMatches();
```

### 4. Testar Like
```javascript
async function testLike(userId) {
  try {
    const response = await apiRequest(`/users/${userId}/like`, {
      method: 'POST'
    });
    console.log('✅ Like enviado:', response);
    
    if (response.isMatch) {
      console.log('🎉 É um match!');
    }
    
    return response;
  } catch (error) {
    console.error('❌ Erro ao curtir:', error);
  }
}

// Executar com ID de usuário
// testLike('USER_ID_AQUI');
```

## 🔧 Testando com Postman

### 1. Criar Collection
1. Abra o Postman
2. Crie uma nova Collection "UniRoom API"
3. Adicione as seguintes requisições:

### 2. Environment Variables
```json
{
  "api_url": "http://localhost:3001/api",
  "auth_token": ""
}
```

### 3. Requisições Base

**Health Check:**
- Method: GET
- URL: `http://localhost:3001/health`

**Register:**
- Method: POST
- URL: `{{api_url}}/auth/register`
- Body (JSON):
```json
{
  "name": "Teste Postman",
  "email": "postman@test.com",
  "password": "Password123",
  "university": "Universidade Teste",
  "course": "Engenharia",
  "graduationYear": 2025,
  "age": 22,
  "gender": "male",
  "interests": ["teste", "postman"],
  "lifestyle": {
    "sleepSchedule": "flexible",
    "cleanliness": "clean",
    "socialLevel": "moderate",
    "studyHabits": "quiet",
    "smokingDrinking": "never"
  },
  "location": {
    "city": "São Paulo",
    "state": "SP",
    "country": "Brasil"
  },
  "budget": {
    "min": 1000,
    "max": 2000,
    "currency": "BRL"
  }
}
```

**Login:**
- Method: POST
- URL: `{{api_url}}/auth/login`
- Body (JSON):
```json
{
  "email": "joao.silva@email.com",
  "password": "Password123"
}
```
- Tests (para salvar token):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("auth_token", response.token);
}
```

**Get Profile:**
- Method: GET
- URL: `{{api_url}}/auth/me`
- Headers: `Authorization: Bearer {{auth_token}}`

## 🚀 Script de Teste Completo

```javascript
// testApi.js - Execute no console do browser
class APITester {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
    this.token = '';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      }
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`❌ Erro em ${endpoint}:`, error.message);
      throw error;
    }
  }

  async testLogin() {
    console.log('🔐 Testando login...');
    
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'joao.silva@email.com',
        password: 'Password123'
      })
    });

    this.token = response.token;
    console.log('✅ Login bem-sucedido!');
    return response;
  }

  async testProfile() {
    console.log('👤 Testando perfil...');
    
    const response = await this.request('/auth/me');
    console.log('✅ Perfil carregado:', response.data.name);
    return response;
  }

  async testMatches() {
    console.log('💕 Testando matches...');
    
    const response = await this.request('/users/matches');
    console.log(`✅ ${response.count} matches encontrados`);
    return response;
  }

  async testLike(userId) {
    console.log(`❤️ Curtindo usuário ${userId}...`);
    
    const response = await this.request(`/users/${userId}/like`, {
      method: 'POST'
    });

    if (response.isMatch) {
      console.log('🎉 É um match!');
    } else {
      console.log('✅ Like enviado');
    }
    
    return response;
  }

  async testMyMatches() {
    console.log('📋 Testando meus matches...');
    
    const response = await this.request('/matches');
    console.log(`✅ ${response.count} matches ativos`);
    return response;
  }

  async testStats() {
    console.log('📊 Testando estatísticas...');
    
    const response = await this.request('/matches/stats');
    console.log('✅ Estatísticas:', response.data);
    return response;
  }

  async runAllTests() {
    try {
      await this.testLogin();
      await this.testProfile();
      const matches = await this.testMatches();
      
      if (matches.data.length > 0) {
        // Testar like no primeiro match
        await this.testLike(matches.data[0]._id);
      }
      
      await this.testMyMatches();
      await this.testStats();
      
      console.log('🎯 Todos os testes concluídos com sucesso!');
    } catch (error) {
      console.error('💥 Falha nos testes:', error);
    }
  }
}

// Usar:
const tester = new APITester();
tester.runAllTests();
```

## 📱 Exemplo React Hook de Teste

```jsx
// hooks/useAPITest.js
import { useState } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

export const useAPITest = () => {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, success, data = null, error = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      data,
      error,
      timestamp: new Date().toISOString()
    }]);
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      // Teste 1: Login
      const loginResponse = await authService.login(
        'joao.silva@email.com', 
        'Password123'
      );
      addResult('Login', true, loginResponse);

      // Teste 2: Perfil
      const profile = await authService.getCurrentUser();
      addResult('Get Profile', true, profile);

      // Teste 3: Matches
      const matches = await userService.getPotentialMatches();
      addResult('Get Matches', true, matches);

      // Teste 4: Like (se houver matches)
      if (matches.data.length > 0) {
        const likeResponse = await userService.likeUser(matches.data[0]._id);
        addResult('Like User', true, likeResponse);
      }

    } catch (error) {
      addResult('Test Failed', false, null, error.message);
    } finally {
      setTesting(false);
    }
  };

  return {
    testResults,
    testing,
    runTests
  };
};
```

## 🎯 Como Usar

1. **Certifique-se que o backend está rodando:**
```bash
cd backend-api
npm run dev
```

2. **Popule com dados de teste:**
```bash
npm run seed
```

3. **Teste usando qualquer método acima:**
   - cURL no terminal
   - JavaScript no console do browser
   - Postman
   - Hook React customizado

4. **Credenciais de teste disponíveis:**
   - Email: `joao.silva@email.com`
   - Senha: `Password123`

---

**API totalmente testável e pronta para integração! 🚀**
