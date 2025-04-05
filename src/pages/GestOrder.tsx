import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, ArrowLeft } from 'lucide-react'; // Ajouter ArrowLeft pour l'icône de retour
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Importer Link pour la navigation

interface Order {
  id: string;
  product: string;
  quantity: number;
  status: 'pending' | 'validated' | 'invalidated';
}

export default function GestOrders() {
  const role = 'employee'; // Simuler le rôle (à remplacer par useAuth si nécessaire)
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // Simuler une requête API
    setTimeout(() => {
      const mockOrders: Order[] = [
        { id: '1', product: 'Produit A', quantity: 2, status: 'pending' },
        { id: '2', product: 'Produit B', quantity: 1, status: 'pending' },
        { id: '3', product: 'Produit C', quantity: 3, status: 'pending' },
      ];
      setOrders(mockOrders);
    }, 1000);
  };

  const handleValidateOrder = async (orderId: string) => {
    const confirmValidate = window.confirm('Êtes-vous sûr de vouloir valider cette commande ?');
    if (!confirmValidate) return;

    // Simuler la validation d'une commande
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'validated' } : order
      )
    );
    toast.success('Commande validée avec succès');
  };

  const handleInvalidateOrder = async (orderId: string) => {
    const confirmInvalidate = window.confirm('Êtes-vous sûr de vouloir invalider cette commande ?');
    if (!confirmInvalidate) return;

    // Simuler l'invalidation d'une commande
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'invalidated' } : order
      )
    );
    toast.success('Commande invalidée avec succès');
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
              {/* Bouton de retour à /dash */}
              <Link
                to="/dash"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                <ArrowLeft className="h-8 w-8" /> {/* Taille et couleur de l'icône */}
              </Link>
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Commandes</h2>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'validated'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status === 'pending'
                        ? 'En attente'
                        : order.status === 'validated'
                        ? 'Validée'
                        : 'Invalidée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleValidateOrder(order.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleInvalidateOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}