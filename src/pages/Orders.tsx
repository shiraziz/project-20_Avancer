import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import de Link pour la navigation
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const states = ['État 1', 'État 2', 'État 3']; // Remplacez par vos états
const municipalities = ['Municipalité 1', 'Municipalité 2', 'Municipalité 3']; // Remplacez par vos municipalités

interface Order {
  clientName: string;
  primaryPhone: string;
  secondaryPhone?: string;
  state: string;
  municipality: string;
  address: string;
  note?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  deliveryFee?: number;
  discount?: number;
  reference?: string;
  pickupPoint?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clientName, setClientName] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [state, setState] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [deliveryFee, setDeliveryFee] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [reference, setReference] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');
  const [total, setTotal] = useState<number>(0); // État pour le total
  const [showPopup, setShowPopup] = useState(false); // État pour afficher/cacher la popup

  // Calcul du total lorsque la quantité ou le prix unitaire change
  useEffect(() => {
    if (quantity && unitPrice) {
      setTotal(Number(quantity) * Number(unitPrice));
    } else {
      setTotal(0);
    }
  }, [quantity, unitPrice]);

  // Télécharger un modèle Excel
  const downloadExcelTemplate = () => {
    const headers = [
      'Nom du client',
      'Téléphone',
      'Téléphone 2',
      'État',
      'Municipalité',
      'Adresse',
      'Note',
      'Produit (SKU)',
      'Quantité',
      'Prix unitaire',
      'Frais de livraison',
      'Remise',
      'Référence',
      'Arrêt bureau',
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Commandes');
    XLSX.writeFile(wb, 'Modele_Commandes.xlsx');
  };

  // Lire et traiter le fichier Excel téléversé
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Ignorer la première ligne (en-têtes)
        const ordersFromExcel = json.slice(1).map((row: any) => ({
          clientName: row[0],
          primaryPhone: row[1],
          secondaryPhone: row[2],
          state: row[3],
          municipality: row[4],
          address: row[5],
          note: row[6],
          sku: row[7],
          quantity: Number(row[8]),
          unitPrice: Number(row[9]),
          deliveryFee: Number(row[10]) || undefined,
          discount: Number(row[11]) || undefined,
          reference: row[12],
          pickupPoint: row[13],
        }));

        setOrders(ordersFromExcel);
        toast.success('Fichier Excel importé avec succès !');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      clientName,
      primaryPhone,
      secondaryPhone,
      state,
      municipality,
      address,
      note,
      sku,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      deliveryFee: deliveryFee ? Number(deliveryFee) : undefined,
      discount: discount ? Number(discount) : undefined,
      reference,
      pickupPoint,
    };

    setOrders([...orders, newOrder]);
    toast.success('Commande enregistrée avec succès !');
    resetForm();
    setShowPopup(false); // Fermer la popup après l'enregistrement
  };

  const resetForm = () => {
    setClientName('');
    setPrimaryPhone('');
    setSecondaryPhone('');
    setState('');
    setMunicipality('');
    setAddress('');
    setNote('');
    setSku('');
    setQuantity('');
    setUnitPrice('');
    setDeliveryFee('');
    setDiscount('');
    setReference('');
    setPickupPoint('');
    setTotal(0); // Réinitialiser le total
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/dash"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300"
        >
          Retour au tableau de bord
        </Link>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowPopup(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Nouvelle Commande
          </button>
          <button
            onClick={downloadExcelTemplate}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            Télécharger le modèle Excel
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
          />
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-6xl mx-4 overflow-y-auto max-h-screen">
            <h2 className="text-xl font-bold mb-4 text-center">Gestion de Commande</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Colonne 1 : Informations du client */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom du client *</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone *</label>
                    <input
                      type="tel"
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone 2 (optionnel)</label>
                    <input
                      type="tel"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">État *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un état</option>
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Municipalité *</label>
                    <select
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une municipalité</option>
                      {municipalities.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Colonne 2 : Détails de la commande */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Produit (SKU) *</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantité *</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix unitaire *</label>
                    <input
                      type="number"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total</label>
                    <input
                      type="text"
                      value={`${total.toFixed(2)} €`}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-gray-100 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Colonne 3 : Options supplémentaires */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frais de livraison (optionnel)</label>
                    <input
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Remise (optionnel)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Référence (optionnel)</label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Arrêt bureau (optionnel)</label>
                    <input
                      type="text"
                      value={pickupPoint}
                      onChange={(e) => setPickupPoint(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Note (optionnel)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  Enregistrer la commande
                </button>
              </div>
            </form>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-bold">Commandes en cours</h3>
        <ul className="mt-4">
          {orders.map((order, index) => (
            <li key={index} className="border rounded-md p-4 mb-2">
              <p><strong>Client :</strong> {order.clientName}</p>
              <p><strong>Téléphone :</strong> {order.primaryPhone}</p>
              <p><strong>Produit (SKU) :</strong> {order.sku}</p>
              <p><strong>Quantité :</strong> {order.quantity}</p>
              <p><strong>Prix unitaire :</strong> {order.unitPrice}€</p>
              <p><strong>Total :</strong> {(order.quantity * order.unitPrice).toFixed(2)}€</p>
              <p><strong>État :</strong> {order.state}</p>
              <p><strong>Municipalité :</strong> {order.municipality}</p>
              <p><strong>Adresse :</strong> {order.address}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Orders;