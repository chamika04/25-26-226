import './App.css';
import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import HospitalBed from './components/Hospital_Bed';

function App() {
  const [route, setRoute] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="App">
      {route.startsWith('#/hospital-bed') ? <HospitalBed /> : <Landing />}
    </div>
  );
}

export default App;
