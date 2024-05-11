import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LewiTematica from './Paginas/LewiTematica';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LewiTematica />} />
      </Routes>
    </Router>

  );
};

export default App;
