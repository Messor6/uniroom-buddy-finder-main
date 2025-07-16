import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Save, User, MapPin, GraduationCap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    name: user?.name || 'Ayrton Schmitz',
    email: user?.email || 'ayrtonSchmitz@posfullstack.com',
    city: user?.city || 'Porto Alegre',
    university: user?.university || 'PUCRS',
    course: user?.course || 'Pós-graduação em Desenvolvimento Full Stack',
    year: user?.year || '1',
    searchType: 'procura_pessoa',
    description: 'Estudante de pós gradução procurando pessoa para dividir apartamento próximo à PUCRS. Sou organizado, não fumo e gosto de estudar em casa.',
    budget: '800'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Implementar salvamento via API quando Supabase for conectado
    console.log('Salvando perfil:', formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-indigo-600">Meu Perfil</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Avatar e informações básicas */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl font-semibold">
                    JS
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{formData.name}</CardTitle>
                <CardDescription>{formData.email}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{formData.city}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span>{formData.university}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{formData.course} - {formData.year}º ano</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Editar Perfil</CardTitle>
                <CardDescription>
                  Mantenha suas informações atualizadas para encontrar os melhores companheiros
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Informações Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Informações Acadêmicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informações Acadêmicas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade da universidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="university">Universidade</Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="course">Curso</Label>
                      <Input
                        id="course"
                        value={formData.course}
                        onChange={(e) => handleInputChange('course', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="year">Ano/Período</Label>
                      <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1º ano</SelectItem>
                          <SelectItem value="2">2º ano</SelectItem>
                          <SelectItem value="3">3º ano</SelectItem>
                          <SelectItem value="4">4º ano</SelectItem>
                          <SelectItem value="5">5º ano</SelectItem>
                          <SelectItem value="pos">Pós-graduação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Preferências de Moradia */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Preferências de Moradia</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="searchType">O que você procura?</Label>
                      <Select value={formData.searchType} onValueChange={(value) => handleInputChange('searchType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="procura_pessoa">Procuro pessoa para dividir</SelectItem>
                          <SelectItem value="procura_apartamento">Procuro apartamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="budget">Orçamento (R$)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="Ex: 800"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Conte um pouco sobre você e o que procura..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
