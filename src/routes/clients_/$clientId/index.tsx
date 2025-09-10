import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Layout } from '../../../components/Layout';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { clientSchema, type ClientFormData } from '../../../lib/schemas';
import { clientsApi } from '../../../lib/api';

export const Route = createFileRoute('/clients_/$clientId/')({
  component: EditClientPage,
});

function EditClientPage() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    const loadClient = async () => {
      try {
        const response = await clientsApi.getById(clientId);
        reset(response);
      } catch (error) {
        console.error('Error loading client:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadClient();
  }, [clientId, reset]);

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    try {
      const response = await clientsApi.update(clientId, data);
      navigate({ to: '/clients' });
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepBlur = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setValue('rua', data.logradouro);
          setValue('bairro', data.bairro);
          setValue('cidade', data.localidade);
          setValue('estado', data.uf);
        }
      } catch (error) {
        console.error('Error fetching CEP:', error);
      }
    }
  };

  if (isLoadingData) {
    return (
      <ProtectedRoute requireRole="admin">
        <Layout>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ECDC4]"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireRole="admin">
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/clients' })}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Tabs defaultValue="dados-cadastrais" className="p-6">
              <TabsList>
                <TabsTrigger value="dados-cadastrais">Dados Cadastrais</TabsTrigger>
                <TabsTrigger value="informacoes-internas">Informações Internas</TabsTrigger>
                <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit(onSubmit)}>
                <TabsContent value="dados-cadastrais">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Cadastrais</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Nome na fachada"
                          placeholder="Digite o nome na fachada"
                          error={errors.nomeFachada?.message}
                          {...register('nomeFachada')}
                        />
                        <Input
                          label="CNPJ"
                          placeholder="00.000.000/0000-00"
                          error={errors.cnpj?.message}
                          {...register('cnpj')}
                        />
                        <div className="md:col-span-2">
                          <Input
                            label="Razão Social"
                            placeholder="Digite a razão social"
                            error={errors.razaoSocial?.message}
                            {...register('razaoSocial')}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input
                          label="CEP"
                          placeholder="00000-000"
                          error={errors.cep?.message}
                          {...register('cep')}
                          onBlur={(e) => handleCepBlur(e.target.value.replace(/\D/g, ''))}
                        />
                        <div className="md:col-span-2">
                          <Input
                            label="Rua"
                            placeholder="Digite a rua"
                            error={errors.rua?.message}
                            {...register('rua')}
                          />
                        </div>
                        <Input
                          label="Número"
                          placeholder="Digite o número"
                          error={errors.numero?.message}
                          {...register('numero')}
                        />
                        <Input
                          label="Bairro"
                          placeholder="Digite o bairro"
                          error={errors.bairro?.message}
                          {...register('bairro')}
                        />
                        <Input
                          label="Complemento"
                          placeholder="Apto, sala, etc."
                          error={errors.complemento?.message}
                          {...register('complemento')}
                        />
                        <Input
                          label="Cidade"
                          placeholder="Digite a cidade"
                          error={errors.cidade?.message}
                          {...register('cidade')}
                        />
                        <Input
                          label="Estado"
                          placeholder="UF"
                          error={errors.estado?.message}
                          {...register('estado')}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate({ to: '/clients' })}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        <Save size={16} className="mr-2" />
                        {isLoading ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="informacoes-internas">
                  <div className="text-center py-12 text-gray-500">
                    <p>Funcionalidade em desenvolvimento</p>
                  </div>
                </TabsContent>

                <TabsContent value="usuarios">
                  <div className="text-center py-12 text-gray-500">
                    <p>Funcionalidade em desenvolvimento</p>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
