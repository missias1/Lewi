import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ pontuacao }) {
  return (
    <header>
      <div className="logo-container">
        <h1>Lewi</h1>
        <p>Elevando seu aprendizado</p>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Temático</Link>
          </li>
          <li>
            <Link to="/personalizado">Personalizado</Link>
          </li>
        </ul>
      </nav>

      <p className="pontuacao">Pontuação: {pontuacao}</p>
    </header>
  );
}

export default Header;