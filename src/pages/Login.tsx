import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, LogIn, UserPlus } from 'lucide-react'; // Import des icônes
import toast from 'react-hot-toast';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('employe'); // État pour le rôle
  const [isLogin, setIsLogin] = useState(true); // Pour basculer entre connexion et enregistrement
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(role);
    document.cookie="role="+role;
    try {
      if (isLogin) {
        // Simuler une connexion
        const storedUser = localStorage.getItem('user');
        console.log(storedUser);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.email === email && user.password === password) {
            if(role=='administrateur')
            {
              navigate('/dash');
            }
            else if(role=='responsable_commande')
            {
              navigate('/orders');
            }
            else if(role=='employe')
            {
              navigate('/gestOrder');
            }
           // toast.success(`Connexion réussie ! Vous êtes connecté en tant que ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}.`);
           toast.success(`Connexion réussie ! Vous êtes connecté en tant que ${role.charAt(0).toUpperCase() + role.slice(1)}.`);

          } else {
            toast.error('Email ou mot de passe incorrect.');
          }
        } else {
          toast.error('Aucun utilisateur trouvé.');
        }
      } else {
        // Simuler un enregistrement
        if (password !== confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas.');
          return;
        }
        const user = { email, password, name }; // Inclure le rôle
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Compte créé avec succès !');
        setIsLogin(true); // Basculer vers le formulaire de connexion après l'enregistrement
      }
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Store className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-sans">
          {isLogin ? 'Connexion' : 'Enregistrement'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* Afficher le rôle uniquement lors de la connexion */}
            {isLogin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Rôle
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="employe">Employé</option>
                    <option value="responsable_commande">Responsable de commande</option>
                    <option value="administrateur">Administrateur</option>
                  </select>
                  <p className="mt-2 text-xs text-gray-500">
                    Sélectionnez votre rôle dans l'organisation.
                  </p>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                {isLogin ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Se connecter
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    S'enregistrer
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-all duration-300"
              >
                {isLogin ? (
                  <>
                    <UserPlus className="h-4 w-4 inline-block mr-1" />
                    Créer un nouveau compte
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 inline-block mr-1" />
                    Déjà un compte ? Se connecter
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}