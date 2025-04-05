import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Check, X, Pencil, ArrowLeft } from 'lucide-react'; // Ajouter Pencil pour l'icône de stylo
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  product: string;
  quantity: number;
  status: 'pending' | 'validated' | 'invalidated' | 'assigned';
  employee?: string;
  isChecked?: boolean; // Pour gérer la sélection des commandes
}

export default function AffectOrders() {
  const role = 'employee'; // Simuler le rôle (à remplacer par useAuth si nécessaire)
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Gestion de l'ouverture du pop-up
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null); // Employé sélectionné
  const [employees, setEmployees] = useState<string[]>([]); // Liste des employés

  useEffect(() => {
    fetchOrders();
    fetchEmployees();
  }, []);

  const fetchOrders = async () => {
    // Simuler une requête API pour récupérer les commandes
    setTimeout(() => {
      const mockOrders: Order[] = [
        { id: '1', product: 'Produit A', quantity: 2, status: 'pending' },
        { id: '2', product: 'Produit B', quantity: 1, status: 'pending' },
        { id: '3', product: 'Produit C', quantity: 3, status: 'pending' },
      ];
      setOrders(mockOrders);
    }, 1000);
  };

  const fetchEmployees = async () => {
    // Simuler la récupération des employés
    const mockEmployees = ['Employé A', 'Employé B', 'Employé C'];
    setEmployees(mockEmployees);
  };

  const handleAffecterClick = () => {
    const selectedOrders = orders.filter(order => order.isChecked); // Filtrer les commandes sélectionnées
    if (selectedOrders.length === 0) {
      toast.error('Il faut choisir la commande à affecter');
      return;
    }
    setIsModalOpen(true); // Ouvre le pop-up
  };

  const handleEmployeeSelect = (employee: string) => {
    setSelectedEmployee(employee); // Stocke l'employé sélectionné
    setIsModalOpen(false); // Ferme le pop-up

    // Appliquer la sélection de l'employé uniquement à la commande sélectionnée
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.isChecked) {
          return { ...order, status: 'assigned', employee }; // Applique l'employé uniquement à la commande sélectionnée
        }
        return order; // Ne modifie pas les autres commandes
      })
    );
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, isChecked: e.target.checked } : order
      )
    );
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
              <h2 className="text-xl font-semibold text-gray-900">Affectation des Commandes</h2>
            </div>
            <button
              onClick={handleAffecterClick}
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
            >
              Affecter à
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">À l'employeur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.status === 'assigned' ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {order.employee}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pas encore
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.status === 'assigned' ? (
                      <button
                        onClick={() => {
                          setSelectedEmployee(order.employee ?? null); // Remplir l'employé actuel
                          setIsModalOpen(true); // Ouvrir le pop-up pour modifier l'affectation
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    ) : (
                      <input
                        type="checkbox"
                        checked={order.isChecked}
                        onChange={(e) => handleCheckboxChange(e, order.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Choisir un employé</h3>
            <ul className="space-y-2">
              {employees.map((employee, index) => (
                <li
                  key={index}
                  className="p-3 cursor-pointer rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => handleEmployeeSelect(employee)}
                >
                  <span className="text-gray-700">{employee}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={() => setIsModalOpen(false)} // Ferme le pop-up
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
