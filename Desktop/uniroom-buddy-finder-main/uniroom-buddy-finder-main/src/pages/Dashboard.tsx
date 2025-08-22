import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MapPin, GraduationCap, Users, Filter, User, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from '../services/api';

const Dashboard = () => {
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Mock data para demonstração
  const mockUsers = [
    {
      id: 1,
      name: 'Cristiano Ronaldo',
      city: 'São Paulo',
      university: 'FGV',
      course: 'Economia',
      type: 'procura_apartamento',
      initials: 'CR7'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      city: 'Rio de Janeiro',
      university: 'UFRJ',
      course: 'Medicina',
      type: 'procura_pessoa',
      initials: 'CS'
    },
    {
      id: 3,
      name: 'Maria Oliveira',
      city: 'Belo Horizonte',
      university: 'UFMG',
      course: 'Direito',
      type: 'procura_apartamento',
      initials: 'MO'
    },
    {
      id: 4,
      name: 'João Pereira',
      city: 'São Paulo',
      university: 'UNICAMP',
      course: 'Computação',
      type: 'procura_pessoa',
      initials: 'JP'
    },
    { id: 5,
      name: 'Marina Silva',
      city: 'Porto Alegre',
      university: 'PUCRS',
      course: 'Arquitetura',
      type: 'procura_apartamento',
      initials: 'MS'
    },
    {
      id: 6,
      name: 'Lucas Lima',
      city: 'Curitiba',
      university: 'PUC-PR',
      course: 'Engenharia Civil',
      type: 'procura_apartamento',
      initials: 'LL'
    }
  ];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get('/users');
        setUsers(response.data as any[]);
      } catch (error) {
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  const allUsers = [...mockUsers, ...users];

  const filteredUsers = allUsers.filter(user => {
    const cityMatch = searchCity === '' || user.city?.toLowerCase().includes(searchCity.toLowerCase());
    const typeMatch = searchType === 'all' || user.type === searchType;
    return cityMatch && typeMatch;
  });

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">UniRoom</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Meu Perfil
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros de busca */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Encontrar Companheiros de Apartamento
            </CardTitle>
            <CardDescription>
              Use os filtros abaixo para encontrar pessoas compatíveis em sua região
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <Input
                  placeholder="Digite a cidade"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de busca
                </label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="procura_apartamento">Procura apartamento</SelectItem>
                    <SelectItem value="procura_pessoa">Procura pessoa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de usuários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.course}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={user.type === 'procura_apartamento' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {user.type === 'procura_apartamento' ? 'Procura Apt' : 'Procura Pessoa'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{user.city}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>{user.university}</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate("/contato", { state: { user } })}
                  >
                    Entrar em contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca para encontrar mais pessoas.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
