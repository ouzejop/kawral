import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
    const [chatOpen, setChatOpen] = useState(false);

    const toggleChat = () => setChatOpen(!chatOpen);

    return (
        <div style={{ background: 'linear-gradient(to bottom, #f0f9f4 0%, #ffffff 100%)', minHeight: '100vh' }}>
            {/* Navigation */}
            <Header />

            {/* Hero Section */}
            <section className="hero-modern">
                <div className="hero-overlay"></div>
                <div className="hero-content-modern">
                    <div className="hero-text-modern">
                        <div className="hero-badge">
                            <i className="fas fa-leaf"></i>
                            <span>Intelligence Artificielle pour l'Environnement</span>
                        </div>
                        <h1>
                            Surveillez, prévoyez et <span className="highlight">agissez</span> pour protéger nos terres
                        </h1>
                        <p>
                            Kawral AI utilise l'intelligence artificielle et l'imagerie satellite pour surveiller en temps réel la désertification et l'avancée de la mer au Sénégal, offrant des solutions concrètes pour préserver notre environnement.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/carte" className="btn-primary-modern">
                                Accéder à la plateforme
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                            <button className="btn-secondary-modern">En savoir plus</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notre Mission Section */}
            <section className="mission-section">
                <div className="section-container">
                    <h2 className="section-title">Notre Mission</h2>
                    <p className="section-subtitle">
                        Kawral AI combine technologie et engagement environnemental pour protéger le Sénégal contre la désertification et l'érosion côtière grâce à l'IA.
                    </p>

                    <div className="mission-grid">
                        <div className="mission-card">
                            <div className="mission-icon green">
                                <i className="fas fa-brain"></i>
                            </div>
                            <h3>Intelligence Artificielle</h3>
                            <p>Algorithmes avancés pour analyser les images satellites et prédire l'évolution environnementale</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon green">
                                <i className="fas fa-leaf"></i>
                            </div>
                            <h3>Surveillance Végétation</h3>
                            <p>Suivi en temps réel de la couverture végétale et détection précoce de la désertification</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon green">
                                <i className="fas fa-water"></i>
                            </div>
                            <h3>Protection Côtière</h3>
                            <p>Monitoring de l'érosion côtière et prévision de l'avancée de la mer</p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-icon green">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>Analyses Prédictives</h3>
                            <p>Modèles prédictifs pour anticiper les zones à risque et orienter les actions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Aperçu Rapide Section */}
            <section className="overview-section">
                <div className="section-container">
                    <h2 className="section-title">Aperçu Rapide</h2>
                    <p className="section-subtitle">
                        Découvrez un résumé de nos données environnementales. Connectez-vous pour accéder aux analyses détaillées et aux cartes interactives.
                    </p>

                    <div className="overview-grid">
                        <div className="overview-card">
                            <div className="overview-header">
                                <span className="overview-label">Zones reboisées</span>
                                <i className="fas fa-tree overview-icon-small green"></i>
                            </div>
                            <div className="overview-value">2,450 ha</div>
                            <div className="overview-badge positive">+12% ce mois</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-header">
                                <span className="overview-label">Zones à risque</span>
                                <i className="fas fa-exclamation-triangle overview-icon-small orange"></i>
                            </div>
                            <div className="overview-value">340 ha</div>
                            <div className="overview-badge negative">-8% ce mois</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-header">
                                <span className="overview-label">Taux de végétation</span>
                                <i className="fas fa-seedling overview-icon-small green"></i>
                            </div>
                            <div className="overview-value">68%</div>
                            <div className="overview-badge positive">+5% ce mois</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nos Partenaires Section */}
            <section className="partners-section">
                <div className="section-container">
                    <h2 className="section-title">Nos Partenaires</h2>
                    <p className="section-subtitle">
                        Kawral AI est soutenu par un réseau d'institutions, d'universités et d'ONG engagées pour la protection de l'environnement au Sénégal.
                    </p>

                    <div className="partners-grid">
                        <div className="partner-card">
                            <div className="partner-icon green">
                                <i className="fas fa-building"></i>
                            </div>
                            <div className="partner-info">
                                <h3>Ministère de l'Environnement</h3>
                                <p>Institution</p>
                            </div>
                        </div>
                        <div className="partner-card">
                            <div className="partner-icon cyan">
                                <i className="fas fa-graduation-cap"></i>
                            </div>
                            <div className="partner-info">
                                <h3>Université Cheikh Anta Diop</h3>
                                <p>Recherche</p>
                            </div>
                        </div>
                        <div className="partner-card">
                            <div className="partner-icon green">
                                <i className="fas fa-leaf"></i>
                            </div>
                            <div className="partner-info">
                                <h3>ONG Environnement Sénégal</h3>
                                <p>ONG</p>
                            </div>
                        </div>
                        <div className="partner-card">
                            <div className="partner-icon green">
                                <i className="fas fa-globe"></i>
                            </div>
                            <div className="partner-info">
                                <h3>Programme des Nations Unies</h3>
                                <p>International</p>
                            </div>
                        </div>
                        <div className="partner-card">
                            <div className="partner-icon cyan">
                                <i className="fas fa-graduation-cap"></i>
                            </div>
                            <div className="partner-info">
                                <h3>Centre de Recherche Océanique</h3>
                                <p>Recherche</p>
                            </div>
                        </div>
                        <div className="partner-card">
                            <div className="partner-icon green">
                                <i className="fas fa-leaf"></i>
                            </div>
                            <div className="partner-info">
                                <h3>WWF Sénégal</h3>
                                <p>ONG</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chatbot */}
            <div className="chatbot">
                <button className="chatbot-toggle" onClick={toggleChat}>
                    <i className="fa-solid fa-comments"></i>
                </button>
                <div className={`chatbot-window ${chatOpen ? 'show' : ''}`}>
                    <div className="chatbot-header">
                        <div className="chatbot-info">
                            <div className="chatbot-avatar">
                                <i className="fa-solid fa-comments"></i>
                            </div>
                            <div className="chatbot-title">
                                <h3>KawralBot</h3>
                                <p>Assistant IA</p>
                            </div>
                        </div>
                        <button className="close-chat" onClick={toggleChat}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        <div className="message">
                            Bonjour! Je suis KawralBot, votre assistant environnemental. Comment puis-je vous aider aujourd'hui?
                        </div>
                    </div>
                    <div className="chatbot-input">
                        <input type="text" placeholder="Posez votre question..." />
                        <button className="send-btn">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <div className="logo-icon">K</div>
                            <span>Kawral AI</span>
                        </div>
                        <p className="footer-description">
                            Protéger le Sénégal contre la désertification et l'érosion côtière grâce à l'intelligence artificielle.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Navigation</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Accueil</Link></li>
                            <li><Link to="/about">À propos</Link></li>
                            <li><Link to="/partenaires">Partenaires</Link></li>
                            <li><Link to="/connexion">Connexion</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Légal</h4>
                        <ul className="footer-links">
                            <li><a href="#">Politique de données</a></li>
                            <li><a href="#">Mentions légales</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <ul className="footer-contact">
                            <li>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Dakar, Sénégal</span>
                            </li>
                            <li>
                                <i className="fas fa-envelope"></i>
                                <span>contact@greenguard.sn</span>
                            </li>
                            <li>
                                <i className="fas fa-phone"></i>
                                <span>+221 33 123 45 67</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2025 Kawral AI. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
