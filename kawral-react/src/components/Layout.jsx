import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">K</div>
                        <span className="logo-text">Kawral AI</span>
                    </div>
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <div className="section-title">Principal</div>
                        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
                            <i className="fas fa-home"></i>
                            <span className="nav-text">Tableau de bord</span>
                        </Link>
                        <Link to="/carte" className={`nav-item ${isActive('/carte')}`}>
                            <i className="fas fa-map"></i>
                            <span className="nav-text">Carte interactive</span>
                        </Link>
                        <Link to="/donnees" className={`nav-item ${isActive('/donnees')}`}>
                            <i className="fas fa-database"></i>
                            <span className="nav-text">Données</span>
                        </Link>
                    </div>

                    <div className="nav-section">
                        <div className="section-title">Analyses</div>
                        <Link to="/erosion" className={`nav-item ${isActive('/erosion')}`}>
                            <i className="fas fa-water"></i>
                            <span className="nav-text">Érosion côtière</span>
                        </Link>
                        <Link to="/desertification" className={`nav-item ${isActive('/desertification')}`}>
                            <i className="fas fa-mountain"></i>
                            <span className="nav-text">Désertification</span>
                        </Link>
                        <Link to="/vegetation" className={`nav-item ${isActive('/vegetation')}`}>
                            <i className="fas fa-seedling"></i>
                            <span className="nav-text">Végétation</span>
                        </Link>
                    </div>

                    <div className="nav-section">
                        <div className="section-title">Actions</div>
                        <Link to="/recommandations" className={`nav-item ${isActive('/recommandations')}`}>
                            <i className="fas fa-lightbulb"></i>
                            <span className="nav-text">Recommandations</span>
                        </Link>
                        <Link to="/suivi" className={`nav-item ${isActive('/suivi')}`}>
                            <i className="fas fa-chart-line"></i>
                            <span className="nav-text">Suivi citoyen</span>
                        </Link>
                        <Link to="/rapports" className={`nav-item ${isActive('/rapports')}`}>
                            <i className="fas fa-file-alt"></i>
                            <span className="nav-text">Rapports</span>
                        </Link>
                    </div>

                    <div className="nav-section">
                        <div className="section-title">Paramètres</div>
                        <Link to="/parametres" className={`nav-item ${isActive('/parametres')}`}>
                            <i className="fas fa-cog"></i>
                            <span className="nav-text">Paramètres</span>
                        </Link>
                        <div className="nav-item">
                            <i className="fas fa-question-circle"></i>
                            <span className="nav-text">Aide</span>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Top Bar */}
                <div className={`top-bar ${location.pathname === '/carte' ? 'map-mode' : ''}`}>
                    {location.pathname !== '/carte' && (
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Rechercher une zone, une région..." id="searchInput" />
                        </div>
                    )}

                    <div className="top-bar-actions">
                        <button className="notification-btn">
                            <i className="fas fa-bell"></i>
                            <span className="notification-badge"></span>
                        </button>
                        <button className="user-btn">
                            <i className="fas fa-user"></i>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
