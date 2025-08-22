# UniRoom Buddy Finder - Backend API

## Funcionalidades

### Autenticação & Usuários
-  Registro de usuários com validação completa
-  Login/Logout com JWT
-  Perfis detalhados com preferências de estilo de vida
-  Sistema de compatibilidade baseado em algoritmo
-  Upload de avatar (futura implementação)

### Sistema de Matching
- Algoritmo de compatibilidade baseado em múltiplos fatores
- Sistema de likes/dislikes
- Matches mútuos automáticos
- Filtros avançados de busca

### Mensagens em Tempo Real
- Sistema de chat entre matches
- WebSocket para mensagens em tempo real
- Status de leitura e entrega
- Upload de arquivos em mensagens (futura implementação)

### Dashboard & Estatísticas
- Estatísticas de matches
- Contadores de mensagens não lidas
-  Análise de compatibilidade

## Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Banco de dados
- **Socket.IO** - Comunicação em tempo real
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados
- **multer** - Upload de arquivos
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Segurança
- **morgan** - Logging

## Instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd backend-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/uniroom-buddy-finder
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5000000
UPLOAD_PATH=uploads/
```

4. **Inicie o MongoDB**
```bash
# No Windows com MongoDB Community
net start MongoDB

# Ou usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Execute o servidor**
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

## Estrutura do Banco de Dados

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  university: string
  course: string
  graduationYear: number
  age: number
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  bio?: string
  interests: string[]
  lifestyle: {
    sleepSchedule: 'early-bird' | 'night-owl' | 'flexible'
    cleanliness: 'very-clean' | 'clean' | 'moderate' | 'relaxed'
    socialLevel: 'very-social' | 'social' | 'moderate' | 'private'
    studyHabits: 'very-quiet' | 'quiet' | 'moderate' | 'flexible'
    smokingDrinking: 'never' | 'occasionally' | 'regularly'
  }
  location: {
    city: string
    state: string
    country: string
    preferredAreas?: string[]
  }
  budget: {
    min: number
    max: number
    currency: string
  }
  preferences: {
    genderPreference: 'same' | 'different' | 'no-preference'
    ageRange: { min: number, max: number }
    maxRoommates: number
    petFriendly: boolean
    smokingOk: boolean
    drinkingOk: boolean
  }
  // Arrays de referências
  likedUsers: ObjectId[]
  dislikedUsers: ObjectId[]
  matchedUsers: ObjectId[]
}
```

## Rotas da API

### Autenticação (`/api/auth`)
```
POST   /register     - Registrar novo usuário
POST   /login        - Login
GET    /logout       - Logout
GET    /me           - Obter usuário atual
PUT    /updatedetails - Atualizar dados do usuário
PUT    /updatepassword - Atualizar senha
```

### Usuários (`/api/users`)
```
GET    /             - Listar usuários com filtros
GET    /matches      - Obter matches potenciais
GET    /:id          - Obter usuário específico
POST   /:id/like     - Curtir usuário
POST   /:id/dislike  - Rejeitar usuário
```

### Matches (`/api/matches`)
```
GET    /             - Listar matches do usuário
GET    /stats        - Estatísticas de matches
GET    /:id          - Obter match específico
PUT    /:id          - Atualizar match (decline/unmatch)
```

### Mensagens (`/api/messages`)
```
GET    /unread-count                    - Contador de não lidas
PUT    /:id/read                        - Marcar como lida
DELETE /:id                            - Deletar mensagem
GET    /matches/:matchId/messages       - Obter mensagens do match
POST   /matches/:matchId/messages       - Enviar mensagem
```

## Algoritmo de Compatibilidade

O sistema calcula a compatibilidade baseado em 5 fatores principais:

1. **Estilo de Vida (30%)** - Horário de sono, limpeza, nível social, hábitos de estudo, fumo/bebida
2. **Interesses (20%)** - Interesses em comum
3. **Orçamento (20%)** - Sobreposição de faixas de orçamento
4. **Localização (15%)** - Mesma cidade/áreas preferidas
5. **Preferências (15%)** - Compatibilidade de idade e gênero

Resultado: Score de 0-100% de compatibilidade.

## 🧪 Dados de Teste

Para popular o banco com dados de exemplo:

```bash
npm run seed
```

Isso criará 5 usuários de exemplo com perfis completos para teste.

## Scripts Disponíveis

```bash
npm start          # Iniciar servidor de produção
npm run dev        # Servidor de desenvolvimento com hot reload
npm run build      # Compilar TypeScript
npm run seed       # Popular banco com dados de teste
```

## Como Usar

1. **Inicie o MongoDB**
2. **Execute `npm run dev`**
3. **Acesse http://localhost:3001/health para testar**
4. **Use `npm run seed` para dados de teste**
5. **Configure o frontend para apontar para http://localhost:3001**

---
