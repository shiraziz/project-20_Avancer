import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { BarChart, Users, Store, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
 // const { role } = useAuth();

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-10 w-10 text-blue-500" />
            <h2 className="ml-4 text-xl font-semibold text-gray-900">Commandes</h2>
          </div>
          <Link
            to="/affectOrder"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Gérer les commandes
          </Link>
        </div>

        {'admin' === 'admin' && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Store className="h-10 w-10 text-green-500" />
                <h2 className="ml-4 text-xl font-semibold text-gray-900">Boutiques</h2>
              </div>
              <Link
                to="/stores"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Gérer les boutiques
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-10 w-10 text-purple-500" />
                <h2 className="ml-4 text-xl font-semibold text-gray-900">Employeurs</h2>
              </div>
              <Link
                to="/users"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Gérer les employeurs
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart className="h-10 w-10 text-orange-500" />
                <h2 className="ml-4 text-xl font-semibold text-gray-900">Rapports</h2>
              </div>
              <Link
                to="/reports"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                Voir les rapports
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}