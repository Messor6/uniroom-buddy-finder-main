import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Users, MapPin, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar autenticação via API quando Supabase for conectado
    console.log('Login/Cadastro:', { email, password, name, isLogin });
    // Por enquanto, redirecionar para a página principal
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Seção de Apresentação */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
              Uni<span className="text-indigo-600">Room</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Encontre o companheiro de apartamento perfeito para sua jornada universitária
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Conecte-se com estudantes</h3>
                <p className="text-gray-600 text-sm">Encontre pessoas compatíveis para dividir apartamento</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <div className="p-3 bg-purple-100 rounded-full">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Busca por localização</h3>
                <p className="text-gray-600 text-sm">Filtre por cidade e proximidade da universidade</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
              <div className="p-3 bg-blue-100 rounded-full">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Perfil universitário</h3>
                <p className="text-gray-600 text-sm">Compartilhe informações sobre seu curso e universidade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Login/Cadastro */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/70 backdrop-blur-md">
            <CardHeader className="space-y-4 text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin 
                  ? 'Faça login para encontrar seu companheiro de apartamento' 
                  : 'Crie sua conta e comece a procurar'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Digite seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/50"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5"
                >
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </Button>
              </form>
              
              <Separator className="my-4" />
              
              <div className="text-center">
                <button
                  onClick={() => {
                    if (isLogin) {
                      // Se for login, vai para a tela de cadastro
                      navigate("/register", { state: { user: { name, email } } });
                    } else {
                      // Se for cadastro, volta para login
                      setIsLogin(true);
                    }
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  {isLogin 
                    ? 'Não tem conta? Cadastre-se' 
                    : 'Já tem conta? Faça login'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
