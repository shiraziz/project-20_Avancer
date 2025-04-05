import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Users, Package, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children?: React.ReactNode;
}
function getCookie(name: string){
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export default function Layout({ children }: LayoutProps) {
  
  // const { signOut, role } = useAuth();
   const navigate = useNavigate();
    const role=getCookie("role")
  const handleSignOut = async () => {
    // await signOut();
     navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
          {role === 'administrateur' && (
            <div className="flex">
            
                    <Link
                      to="/dash"
                      className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
                    >
                      <Store className="h-6 w-6 mr-2" />
                      <span className="font-medium">Gestion des Commandes</span>
                    </Link>
                    </div>
                  )}
                  {role != 'administrateur' && (
                    <div className="flex">
                    <Link
                      to="#"
                      className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
                    >
                      <Store className="h-6 w-6 mr-2" />
                      <span className="font-medium">Gestion des Commandes</span>
                    </Link>
                    </div>
                  )}
            {role === 'administrateur' && (
            <div className="flex items-center space-x-4">
              <Link to="/orders" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                <Package className="h-5 w-5" />
              </Link>
                  <Link to="/stores" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    <Store className="h-5 w-5" />
                  </Link>
                  <Link to="/users" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    <Users className="h-5 w-5" />
                  </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
            )}
            {role != 'administrateur' && (
            <div className="flex items-center space-x-4">
              <Link to="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                <Package className="h-5 w-5" />
              </Link>
                  <Link to="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    <Store className="h-5 w-5" />
                  </Link>
                  <Link to="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    <Users className="h-5 w-5" />
                  </Link>
                
             
              
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}