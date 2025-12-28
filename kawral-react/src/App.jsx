import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Carte from './pages/Carte';
import Home from './pages/Home';

// Placeholder components
const Placeholder = ({ title }) => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">{title}</h2>
    </div>
    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
      <i className="fas fa-tools" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
      <p>Cette page est en cours de migration.</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carte" element={<Carte />} />
          <Route path="/donnees" element={<Placeholder title="Données" />} />
          <Route path="/erosion" element={<Placeholder title="Érosion Côtière" />} />
          <Route path="/desertification" element={<Placeholder title="Désertification" />} />
          <Route path="/vegetation" element={<Placeholder title="Végétation" />} />
          <Route path="/recommandations" element={<Placeholder title="Recommandations" />} />
          <Route path="/suivi" element={<Placeholder title="Suivi Citoyen" />} />
          <Route path="/rapports" element={<Placeholder title="Rapports" />} />
          <Route path="/parametres" element={<Placeholder title="Paramètres" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
