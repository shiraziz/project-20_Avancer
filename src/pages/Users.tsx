import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  nom: string;
  login: string;
  tel: string;
}

export default function Orders() {
  const role = 'employee'; // Simuler le rôle (à remplacer par useAuth si nécessaire)
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Pour les champs de création et de modification
  const [nom, setNom] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [tel, setTel] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setTimeout(() => {
      const mockOrders: Order[] = [
        { id: '1', nom: 'Ali', login: "LoginAli", tel: '986532' },
        { id: '2', nom: 'Imed', login: "LoginImed", tel: '784512' },
        { id: '3', nom: 'Mohamed', login: "LoginMohamed", tel: '976431' },
      ];
      setOrders(mockOrders);
    }, 1000);
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?');
    if (!confirmDelete) return;

    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    toast.success('Commande supprimée avec succès');
  };

  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setNom(order.nom);
    setLogin(order.login);
    setTel(order.tel);
    setEditModalOpen(true);
  };

  const handleCreateOrder = () => {
    setCreateModalOpen(true);
    setNom('');
    setLogin('');
    setPassword('');
    setTel('');
  };

  const handleSaveOrder = () => {
    // Logique pour ajouter une commande
    const newOrder = { id: Math.random().toString(), nom, login, tel };
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setCreateModalOpen(false);
    toast.success('Commande ajoutée avec succès');
  };

  const handleUpdateOrder = () => {
    if (currentOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === currentOrder.id
            ? { ...order, nom, login, tel }
            : order
        )
      );
      setEditModalOpen(false);
      toast.success('Commande modifiée avec succès');
    }
  };

  const handleCancelModal = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
  };

  if (role !== 'employee') {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-red-600">Accès non autorisé</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/dash"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                <ArrowLeft className="h-8 w-8" />
              </Link>
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
              onClick={handleCreateOrder}
            >
              Ajouter une commande
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.login}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.tel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Ajouter une commande</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Login</label>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="text"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancelModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modification */}
      {isEditModalOpen && currentOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Modifier la commande</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Login</label>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="text"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancelModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleUpdateOrder}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
