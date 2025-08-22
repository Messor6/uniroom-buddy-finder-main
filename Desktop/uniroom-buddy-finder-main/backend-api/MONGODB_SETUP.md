# 🗄️ Configuração do MongoDB

## 📦 Instalação do MongoDB

### Opção 1: MongoDB Community (Recomendado para desenvolvimento)

1. **Download:**
   - Acesse: https://www.mongodb.com/try/download/community
   - Escolha Windows
   - Baixe o instalador (.msi)

2. **Instalação:**
   - Execute o instalador
   - Escolha "Complete" installation
   - Marque "Install MongoDB as a Service"
   - Marque "Install MongoDB Compass" (interface gráfica)

3. **Verificar instalação:**
```bash
# Abra um novo terminal e teste:
mongod --version
mongo --version
```

### Opção 2: MongoDB via Docker (Mais rápido)

```bash
# Instalar Docker Desktop primeiro: https://www.docker.com/products/docker-desktop

# Baixar e executar MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Verificar se está rodando
docker ps

# Para parar
docker stop mongodb

# Para iniciar novamente
docker start mongodb
```

### Opção 3: MongoDB Atlas (Cloud - Gratuito)

1. **Criar conta:**
   - Acesse: https://www.mongodb.com/atlas
   - Crie uma conta gratuita

2. **Criar cluster:**
   - Escolha "Create a FREE Shared Cluster"
   - Selecione uma região próxima
   - Clique "Create Cluster"

3. **Configurar acesso:**
   - Vá em "Database Access" → "Add New Database User"
   - Crie um usuário e senha
   - Vá em "Network Access" → "Add IP Address" → "Allow Access from Anywhere"

4. **Obter string de conexão:**
   - Clique "Connect" no seu cluster
   - Escolha "Connect your application"
   - Copie a connection string

5. **Atualizar .env:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uniroom-buddy-finder
```

## 🚀 Iniciando o MongoDB Local

### Windows (Instalação Community)

```bash
# Iniciar como serviço
net start MongoDB

# Ou iniciar manualmente
mongod

# Para parar
net stop MongoDB
```

### Docker

```bash
# Iniciar container
docker start mongodb

# Ou criar novo se não existir
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Ver logs
docker logs mongodb

# Conectar ao mongo shell
docker exec -it mongodb mongo
```

## 🧪 Testando a Conexão

```bash
# Testar conexão local
mongo

# Ou usando mongosh (versão mais nova)
mongosh

# Comandos básicos para testar:
show dbs
use uniroom-buddy-finder
show collections
```

## 🔧 Configuração para o Projeto

### 1. Com MongoDB Local
```env
# .env
MONGODB_URI=mongodb://localhost:27017/uniroom-buddy-finder
```

### 2. Com Docker
```env
# .env
MONGODB_URI=mongodb://localhost:27017/uniroom-buddy-finder
```

### 3. Com MongoDB Atlas
```env
# .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uniroom-buddy-finder
```

## 🌱 Populando com Dados de Teste

Após o MongoDB estar rodando:

```bash
cd backend-api
npm run seed
```

Isso criará 5 usuários de exemplo para testar.

## 🎯 Interface Gráfica (Opcional)

### MongoDB Compass
- Vem com a instalação Community
- URL de conexão: `mongodb://localhost:27017`
- Permite visualizar dados graficamente

### MongoDB Atlas Interface
- Interface web automática
- Acesse pelo painel do Atlas

## 🆘 Problemas Comuns

### 1. "connect ECONNREFUSED"
- MongoDB não está rodando
- Verificar se o serviço está ativo: `net start MongoDB`

### 2. "Authentication failed"
- Verificar usuário/senha no Atlas
- Verificar string de conexão

### 3. "Network timeout"
- Verificar Network Access no Atlas
- Verificar firewall local

### 4. Port 27017 já em uso
```bash
# Ver o que está usando a porta
netstat -ano | findstr :27017

# Matar processo se necessário
taskkill /PID <PID_NUMBER> /F
```

## 📋 Checklist de Configuração

- [ ] MongoDB instalado ou Docker configurado
- [ ] Serviço MongoDB rodando
- [ ] Conexão testada
- [ ] .env configurado com URI correta
- [ ] Backend conectando ao banco
- [ ] Dados de teste criados (`npm run seed`)

## 🎉 Teste Final

```bash
# 1. Verificar se MongoDB está rodando
mongo --eval "db.runCommand('ping')"

# 2. Iniciar backend
npm run dev

# 3. Popular dados
npm run seed

# 4. Testar API
curl http://localhost:3001/health
```

---

**Escolha a opção que preferir e siga o guia! O Docker é mais rápido para desenvolvimento. 🐳**
