import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LewiTematica from './Paginas/LewiTematica';
import LewiPersonalizada from './Paginas/LewiPersonalizada';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LewiTematica />} />
        <Route path="/personalizado" element={<LewiPersonalizada />} />
      </Routes>
    </Router>

  );
};

export default App;
