import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <header className="header-modern">
            <Link to="/" className="logo">
                <div className="logo-icon">K</div>
                <span>Kawral AI</span>
            </Link>

            <nav className="header-nav">
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${isActive('/')}`}>
                        <i className="fa-solid fa-house"></i>
                        <span>Accueil</span>
                    </Link>
                    <Link to="/carte" className={`nav-link ${isActive('/carte')}`}>
                        <i className="fa-solid fa-map"></i>
                        <span>Carte</span>
                    </Link>
                    <Link to="/donnees" className={`nav-link ${isActive('/donnees')}`}>
                        <i className="fa-solid fa-database"></i>
                        <span>Données</span>
                    </Link>

                    <div className="dropdown-container">
                        <button
                            className={`nav-link dropdown-trigger ${dropdownOpen ? 'active' : ''}`}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                        >
                            <span>Plus</span>
                            <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                        </button>
                        <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                            <Link to="/suivi" className="dropdown-item">Suivi citoyen</Link>
                            <Link to="/recommandations" className="dropdown-item">Recommandations</Link>
                            <Link to="/about" className="dropdown-item">À propos</Link>
                        </div>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn-connexion">Connexion</button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
