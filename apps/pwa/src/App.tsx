import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ThemeProvider } from './components/ThemeProvider';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientDetail } from './pages/ClientDetail';
import { Chantiers } from './pages/Chantiers';
import { ChantierDetail } from './pages/ChantierDetail';
import { Devis } from './pages/Devis';
import { DevisBuilder } from './pages/DevisBuilder';
import { Factures } from './pages/Factures';
import { Interventions } from './pages/Interventions';
import { Calendar } from './pages/Calendar';
import { Absences } from './pages/Absences';
import { Analytics } from './pages/Analytics';
import { FinanceReports } from './pages/FinanceReports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { SignerDevis } from './pages/SignerDevis';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedClientRoute } from './components/auth/ProtectedClientRoute';
import { ClientLogin } from './pages/client/ClientLogin';
import { ClientVerify } from './pages/client/ClientVerify';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { ClientDevisList } from './pages/client/ClientDevisList';
import { ClientFacturesList } from './pages/client/ClientFacturesList';
import { ClientChantiersList } from './pages/client/ClientChantiersList';
import { ClientChantierDetail } from './pages/client/ClientChantierDetail';
import { ClientMessages } from './pages/client/ClientMessages';
import { ClientConversation } from './pages/client/ClientConversation';
import ScanPage from './pages/scan';

function App() {
  return (
    <ThemeProvider>
      <OfflineIndicator variant="banner" />
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/signer/:token" element={<SignerDevis />} />

        {/* Routes portail client */}
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/verify/:token" element={<ClientVerify />} />
        <Route
          path="/client/dashboard"
          element={
            <ProtectedClientRoute>
              <ClientDashboard />
            </ProtectedClientRoute>
          }
        />
        <Route
          path="/client/devis"
          element={
            <ProtectedClientRoute>
              <ClientDevisList />
            </ProtectedClientRoute>
          }
        />
        <Route
          path="/client/factures"
          element={
            <ProtectedClientRoute>
              <ClientFacturesList />
            </ProtectedClientRoute>
          }
        />
        <Route
          path="/client/chantiers"
          element={
            <ProtectedClientRoute>
              <ClientChantiersList />
            </ProtectedClientRoute>
          }
        />
        <Route
          path="/client/chantiers/:id"
          element={
            <ProtectedClientRoute>
              <ClientChantierDetail />
            </ProtectedClientRoute>
          }
        />
        <Route
          path="/client/messages"
          element={
            <ProtectedClientRoute>
              <ClientMessages />
            </ProtectedClientRoute>
          }
        />
        <Route
          path="/client/messages/:id"
          element={
            <ProtectedClientRoute>
              <ClientConversation />
            </ProtectedClientRoute>
          }
        />
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
          <Route path="calendar" element={<Calendar />} />
          <Route path="absences" element={<Absences />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/finance" element={<FinanceReports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="scan" element={<ScanPage />} />
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
    </ThemeProvider>
  );
}

export default App;
