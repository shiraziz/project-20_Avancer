import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
//import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface OrderStats {
  total_orders: number;
  pending_orders: number;
  validated_orders: number;
  rejected_orders: number;
  total_revenue: number;
  average_order_value: number;
}

interface StoreStats {
  store_id: string;
  store_name: string;
  total_orders: number;
  total_revenue: number;
}

export default function Reports() {
  const role = 'admin';
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total_orders: 0,
    pending_orders: 0,
    validated_orders: 0,
    rejected_orders: 0,
    total_revenue: 0,
    average_order_value: 0
  });
  const [storeStats, setStoreStats] = useState<StoreStats[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (role === 'admin') {
      fetchStats();
    }
  }, [role, dateRange]);

  const fetchStats = async () => {
    // try {
    //   // Fetch basic order statistics
    //   const { data: ordersData, error: ordersError } = await supabase
    //     .from('orders')
    //     .select('id, status, unit_price, quantity, shipping_fee, discount')
    //     .gte('created_at', dateRange.start)
    //     .lte('created_at', dateRange.end);

    //   if (ordersError) throw ordersError;

    //   if (ordersData) {
    //     const stats = {
    //       total_orders: ordersData.length,
    //       pending_orders: ordersData.filter(o => o.status === 'pending').length,
    //       validated_orders: ordersData.filter(o => o.status === 'validated').length,
    //       rejected_orders: ordersData.filter(o => o.status === 'rejected').length,
    //       total_revenue: ordersData.reduce((sum, order) => 
    //         sum + (order.unit_price * order.quantity + (order.shipping_fee || 0) - (order.discount || 0)), 0),
    //       average_order_value: 0
    //     };
        
    //     stats.average_order_value = stats.total_orders > 0 ? 
    //       stats.total_revenue / stats.total_orders : 0;

    //     setOrderStats(stats);
    //   }

    //   // Fetch store statistics
    //   const { data: storesData, error: storesError } = await supabase
    //     .from('stores')
    //     .select(`
    //       id,
    //       name,
    //       orders!inner(
    //         id,
    //         unit_price,
    //         quantity,
    //         shipping_fee,
    //         discount,
    //         created_at
    //       )
    //     `)
    //     .gte('orders.created_at', dateRange.start)
    //     .lte('orders.created_at', dateRange.end);

    //   if (storesError) throw storesError;

    //   if (storesData) {
    //     const storeStats = storesData.map(store => ({
    //       store_id: store.id,
    //       store_name: store.name,
    //       total_orders: store.orders.length,
    //       total_revenue: store.orders.reduce((sum, order) => 
    //         sum + (order.unit_price * order.quantity + (order.shipping_fee || 0) - (order.discount || 0)), 0)
    //     }));

    //     setStoreStats(storeStats);
    //   }
    // } catch (error) {
    //   console.error('Error fetching stats:', error);
    //   toast.error('Erreur lors du chargement des statistiques');
    // }
  };

  const exportStats = () => {
    const orderStatsSheet = XLSX.utils.json_to_sheet([{
      'Total des commandes': orderStats.total_orders,
      'Commandes en attente': orderStats.pending_orders,
      'Commandes validées': orderStats.validated_orders,
      'Commandes rejetées': orderStats.rejected_orders,
      'Revenu total': orderStats.total_revenue.toFixed(2) + ' €',
      'Valeur moyenne des commandes': orderStats.average_order_value.toFixed(2) + ' €'
    }]);

    const storeStatsSheet = XLSX.utils.json_to_sheet(
      storeStats.map(store => ({
        'Boutique': store.store_name,
        'Nombre de commandes': store.total_orders,
        'Revenu total': store.total_revenue.toFixed(2) + ' €'
      }))
    );
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, orderStatsSheet, 'Statistiques Générales');
    XLSX.utils.book_append_sheet(wb, storeStatsSheet, 'Statistiques par Boutique');
    
    XLSX.writeFile(wb, `rapport_${dateRange.start}_${dateRange.end}.xlsx`);
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
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BarChart className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Rapports et Statistiques</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Du:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Au:</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={exportStats}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Commandes</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total des commandes:</span>
                  <span className="font-semibold">{orderStats.total_orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">En attente:</span>
                  <span className="font-semibold">{orderStats.pending_orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Validées:</span>
                  <span className="font-semibold">{orderStats.validated_orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Rejetées:</span>
                  <span className="font-semibold">{orderStats.rejected_orders}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-900 mb-4">Revenus</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-700">Revenu total:</span>
                  <span className="font-semibold">{orderStats.total_revenue.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Valeur moyenne:</span>
                  <span className="font-semibold">{orderStats.average_order_value.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques par Boutique</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Boutique
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commandes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenu Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {storeStats.map((store) => (
                    <tr key={store.store_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {store.store_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.total_orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.total_revenue.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}