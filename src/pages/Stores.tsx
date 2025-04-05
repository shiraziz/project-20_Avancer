import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
//import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Store as StoreIcon, Plus, Trash2, ArrowLeft } from 'lucide-react'; // Ajouter ArrowLeft pour l'icône de retour
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Importer Link pour la navigation

interface Store {
  id: string;
  name: string;
  owner_id: string;
}

export default function Stores() {
  const role = 'admin'; // Simuler le rôle (à remplacer par useAuth si nécessaire)
  const [stores, setStores] = useState<Store[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    // Simuler une requête API
    setTimeout(() => {
      const mockStores: Store[] = [
        { id: '1', name: 'Boutique A', owner_id: 'user1' },
        { id: '2', name: 'Boutique B', owner_id: 'user2' },
      ];
      setStores(mockStores);
    }, 1000);
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim()) {
      toast.error('Le nom de la boutique ne peut pas être vide');
      return;
    }

    // Simuler la création d'une boutique
    const newStore: Store = {
      id: String(Date.now()), // Générer un ID unique
      name: storeName,
      owner_id: 'user1', // Simuler un propriétaire
    };

    setStores((prevStores) => [...prevStores, newStore]);
    toast.success('Boutique créée avec succès');
    setShowModal(false);
    setStoreName('');
  };

  const handleDeleteStore = async (storeId: string) => {
    // Demander une confirmation avant la suppression
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette boutique ?');
    if (!confirmDelete) return;

    // Simuler la suppression d'une boutique
    setStores((prevStores) => prevStores.filter((store) => store.id !== storeId));
    toast.success('Boutique supprimée avec succès');
  };

  if (role !== 'admin') {
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
              {/* Bouton Retour à /dash */}
              <Link
                to="/dash"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </Link>
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Boutiques</h2>
            </div>
            <button
              onClick={() => setShowModal(true)} // Activer la modale
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Boutique
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StoreIcon className="h-6 w-6 text-blue-500" />
                    <h3 className="ml-2 text-lg font-medium text-gray-900">{store.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900">Créer une nouvelle boutique</h3>
            <form onSubmit={handleCreateStore} className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nom de la boutique</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)} // Fermer la modale
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}