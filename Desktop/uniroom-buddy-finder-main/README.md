## UniRoom Buddy Finder

## Sobre o Projeto

O **UniRoom Buddy Finder** é uma aplicação web desenvolvida para ajudar estudantes universitários a encontrarem colegas de quarto compatíveis. O sistema utiliza um algoritmo de compatibilidade baseado em preferências pessoais, hábitos de estudo e estilo de vida.

### Objetivos
- Facilitar a busca por colegas de quarto compatíveis
- Reduzir conflitos de convivência através de matching inteligente
- Proporcionar uma interface moderna e intuitiva
- Garantir segurança e privacidade dos usuários

## Funcionalidades

### Implementadas
- **Sistema de Autenticação** - Registro e login seguros
- **Perfil Personalizado** - Informações detalhadas do usuário
- **Algoritmo de Compatibilidade** - Matching baseado em preferências
- **Sistema de Mensagens** - Chat em tempo real entre matches
- **Interface Responsiva** - Compatível com desktop e mobile


### Desenvolvimento futuro
- **Geolocalização** - Busca por proximidade
- **Sistema de Avaliações** - Feedback entre usuários
- **Dashboard Analytics** - Estatísticas de compatibilidade

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **shadcn/ui** - Componentes UI elegantes
- **Tailwind CSS** - Estilização utilitária
- **React Query** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários performáticos

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **TypeScript** - Tipagem para JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Socket.io** - Comunicação em tempo real
- **JWT** - Autenticação stateless
- **bcrypt** - Hash de senhas

### DevOps & Deploy
- **GitHub** - Controle de versão
- **Vercel** - Deploy frontend
- **MongoDB Atlas** - Banco de dados cloud

## Deploy

### Aplicação Online
**Link de Acesso Principal:** https://uniroom-buddy-finder-main.vercel.app/
**Link de Acesso Secundário:** https://uniroom-buddy-finder-main-m3q8ymlxs-ayrtons-projects-050d3ee1.vercel.app

### Deploy Automático
- **Frontend:** Vercel (deploy automático via GitHub)
- **Backend:** Modo mock para demonstração
- **Database:** MongoDB local/Atlas

## Executando Localmente

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- MongoDB (opcional - tem modo mock)

### 1. Clone o repositório
```bash
git clone https://github.com/Messor6/uniroom-buddy-finder-main.git
cd uniroom-buddy-finder-main
```

### 2. Backend (API)
```bash
cd backend-api
npm install
npm run dev:mock  # Modo mock (sem MongoDB)
# ou
npm run dev       # Modo completo (com MongoDB)
```

### 3. Frontend
```bash
cd uniroom-buddy-finder-main
npm install
npm run dev
```

### 4. Acesse a aplicação
- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:3001

## Estrutura do Projeto

```
uniroom-buddy-finder-main/
├──  backend-api/                 # Backend Node.js + TypeScript
│   ├──  src/
│   │   ├──  controllers/         # Controladores da API
│   │   ├──  models/             # Modelos de dados
│   │   ├──  routes/             # Rotas da API
│   │   ├──  middleware/         # Middlewares
│   │   ├──  services/           # Lógica de negócio
│   │   └──  data/               # Dados mock
│   ├──  package.json
│   └──  tsconfig.json
├──  uniroom-buddy-finder-main/   # Frontend React + Vite
│   ├──  src/
│   │   ├──  components/         # Componentes React
│   │   ├──  pages/              # Páginas da aplicação
│   │   ├──  services/           # Serviços API
│   │   ├──  hooks/              # Custom hooks
│   │   └──  lib/                # Utilitários
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   └── 📄 tailwind.config.ts
└── 📄 README.md
```

## 🔧 Configuração de Ambiente

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/uniroom-buddy-finder
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_REACT_APP_API_URL=http://localhost:3001/api
```

## Algoritmo de Compatibilidade

O sistema utiliza um algoritmo proprietário que considera:

- **Hábitos de Estudo** (35%)
  - Horários preferenciais
  - Ambiente de estudo
  - Nível de concentração

- **Estilo de Vida** (30%)
  - Horários de sono
  - Práticas de limpeza
  - Vida social

- **Preferências Pessoais** (25%)
  - Hobbies e interesses
  - Tolerância a ruído
  - Uso de espaços compartilhados

- **Compatibilidade Financeira** (10%)
  - Faixa de orçamento
  - Divisão de gastos

## Contexto Acadêmico

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) de Pós-Graduação, demonstrando:

- **Arquitetura Full-Stack** moderna
- **Boas práticas** de desenvolvimento
- **Design Patterns** e Clean Code
- **Deploy** em ambiente de produção
- **Documentação** técnica completa

## Autor

**Ayrton Schmitz**
- GitHub: [@Messor6](https://github.com/Messor6)

## Licença

Este projeto é desenvolvido para fins acadêmicos e está disponível sob a licença MIT.


 **Dica:** Para testar a aplicação, use um e-mail como hgl@teste.com e digite qualquer senha ou crie uma nova conta.
