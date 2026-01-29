import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientDetail } from './pages/ClientDetail';
import { Chantiers } from './pages/Chantiers';
import { ChantierDetail } from './pages/ChantierDetail';
import { Devis } from './pages/Devis';
import { DevisBuilder } from './pages/DevisBuilder';
import { Factures } from './pages/Factures';
import { Interventions } from './pages/Interventions';
import { Login } from './pages/Login';
import { SignerDevis } from './pages/SignerDevis';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/signer/:token" element={<SignerDevis />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="chantiers" element={<Chantiers />} />
          <Route path="chantiers/:id" element={<ChantierDetail />} />
          <Route path="devis" element={<Devis />} />
          <Route path="devis/nouveau" element={<DevisBuilder />} />
          <Route path="devis/:id" element={<DevisBuilder />} />
          <Route path="factures" element={<Factures />} />
          <Route path="factures/:id" element={<Factures />} />
          <Route path="interventions" element={<Interventions />} />
          <Route path="interventions/:id" element={<Interventions />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
