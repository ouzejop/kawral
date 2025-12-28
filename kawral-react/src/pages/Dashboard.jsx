import React, { useEffect, useRef } from 'react';
import Chatbot from '../components/Chatbot';

const Dashboard = () => {
    const timeChartRef = useRef(null);
    const riskChartRef = useRef(null);

    useEffect(() => {
        // Initialize charts
        if (window.Chart) {
            const timeCtx = document.getElementById('dashboardTimeChart').getContext('2d');
            const riskCtx = document.getElementById('dashboardRiskChart').getContext('2d');

            // Destroy existing charts if any (to prevent duplicates on re-render)
            if (timeChartRef.current) timeChartRef.current.destroy();
            if (riskChartRef.current) riskChartRef.current.destroy();

            timeChartRef.current = new window.Chart(timeCtx, {
                type: 'line',
                data: {
                    labels: ['2020', '2021', '2022', '2023', '2024'],
                    datasets: [{
                        label: 'NDVI Moyen',
                        data: [0.52, 0.50, 0.48, 0.46, 0.45],
                        borderColor: '#16a34a',
                        tension: 0.4
                    }, {
                        label: 'Érosion (km)',
                        data: [120, 128, 135, 142, 152],
                        borderColor: '#dc2626',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            riskChartRef.current = new window.Chart(riskCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Critique', 'Élevé', 'Moyen', 'Faible'],
                    datasets: [{
                        data: [15, 25, 35, 25],
                        backgroundColor: ['#dc2626', '#f97316', '#facc15', '#16a34a']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        return () => {
            if (timeChartRef.current) timeChartRef.current.destroy();
            if (riskChartRef.current) riskChartRef.current.destroy();
        };
    }, []);

    return (
        <section className="page-section active" id="dashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: '#0f766e', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard Environnemental</h1>
                    <p style={{ color: '#14b8a6', fontSize: '1.1rem' }}>Surveillance de l'érosion côtière et de la désertification au Sénégal</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary">
                        <i className="fas fa-download"></i>
                        Exporter
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-file-pdf"></i>
                        Rapport PDF
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div>
                            <div className="stat-title">NDVI Moyen National</div>
                            <div className="stat-value">0.45</div>
                            <div className="stat-change negative">
                                <i className="fas fa-arrow-down"></i> -13% vs 2023
                            </div>
                        </div>
                        <div className="stat-icon green">
                            <i className="fas fa-seedling"></i>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div>
                            <div className="stat-title">Érosion Côtière</div>
                            <div className="stat-value">152 km</div>
                            <div className="stat-change negative">
                                <i className="fas fa-arrow-up"></i> +20% depuis 2020
                            </div>
                        </div>
                        <div className="stat-icon red">
                            <i className="fas fa-water"></i>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div>
                            <div className="stat-title">Zones à Risque</div>
                            <div className="stat-value">23</div>
                            <div className="stat-change negative">
                                <i className="fas fa-triangle-exclamation"></i> 8 critiques
                            </div>
                        </div>
                        <div className="stat-icon yellow">
                            <i className="fas fa-map-marked-alt"></i>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div>
                            <div className="stat-title">Surface Désertifiée</div>
                            <div className="stat-value">8,450 km²</div>
                            <div className="stat-change negative">
                                <i className="fas fa-arrow-up"></i> +5% cette année
                            </div>
                        </div>
                        <div className="stat-icon blue">
                            <i className="fas fa-mountain"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Analyse Temporelle</h2>
                    </div>
                    <div className="chart-container">
                        <canvas id="dashboardTimeChart"></canvas>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Répartition des Risques</h2>
                    </div>
                    <div className="chart-container">
                        <canvas id="dashboardRiskChart"></canvas>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Zones Critiques</h2>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Région</th>
                            <th>Type de Risque</th>
                            <th>Niveau</th>
                            <th>NDVI</th>
                            <th>Évolution</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="dashboardCriticalZonesTable">
                        <tr style={{ cursor: 'pointer' }}>
                            <td><strong>Saint-Louis</strong></td>
                            <td>Érosion côtière</td>
                            <td><span className="status-badge danger">Élevé</span></td>
                            <td>0.42</td>
                            <td style={{ color: '#dc2626', fontWeight: 600 }}>-18%</td>
                            <td><button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Détails</button></td>
                        </tr>
                        <tr style={{ cursor: 'pointer' }}>
                            <td><strong>Louga</strong></td>
                            <td>Désertification</td>
                            <td><span className="status-badge danger">Élevé</span></td>
                            <td>0.38</td>
                            <td style={{ color: '#dc2626', fontWeight: 600 }}>-15%</td>
                            <td><button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Détails</button></td>
                        </tr>
                        <tr style={{ cursor: 'pointer' }}>
                            <td><strong>Matam</strong></td>
                            <td>Désertification</td>
                            <td><span className="status-badge danger">Élevé</span></td>
                            <td>0.35</td>
                            <td style={{ color: '#dc2626', fontWeight: 600 }}>-20%</td>
                            <td><button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Détails</button></td>
                        </tr>
                        <tr style={{ cursor: 'pointer' }}>
                            <td><strong>Langue de Barbarie</strong></td>
                            <td>Érosion côtière</td>
                            <td><span className="status-badge danger">Élevé</span></td>
                            <td>0.40</td>
                            <td style={{ color: '#dc2626', fontWeight: 600 }}>-12%</td>
                            <td><button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Détails</button></td>
                        </tr>
                        <tr style={{ cursor: 'pointer' }}>
                            <td><strong>Dakar</strong></td>
                            <td>Érosion côtière</td>
                            <td><span className="status-badge warning">Moyen</span></td>
                            <td>0.48</td>
                            <td style={{ color: '#dc2626', fontWeight: 600 }}>-8%</td>
                            <td><button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Détails</button></td>
                        </tr>
                        <tr style={{ cursor: 'pointer' }}>
                            <td><strong>Delta Saloum</strong></td>
                            <td>Salinisation</td>
                            <td><span className="status-badge warning">Moyen</span></td>
                            <td>0.45</td>
                            <td style={{ color: '#dc2626', fontWeight: 600 }}>-10%</td>
                            <td><button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Détails</button></td>
                        </tr>
                        <tr style={{ cursor: 'pointer' }}>
                            <td><strong>Ferlo Nord</strong></td>
                            <td>Désertification</td>
                            <td><span className="status-badge danger">Élevé</span></td>
                            <td>0.36</td>
                            <td style={{ color: '#dc2626', fontWeight: 600 }}>-17%</td>
                            <td><button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Détails</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <div className="card-header">
                    <h2 className="card-title">Recommandations Prioritaires</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ color: '#0f766e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fas fa-seedling"></i> Louga - Reboisement Urgent
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Planter 50,000 acacias résistants</span>
                            </li>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Construire 200 demi-lunes</span>
                            </li>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Former 150 agriculteurs locaux</span>
                            </li>
                        </ul>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ color: '#0891b2', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fas fa-water"></i> Saint-Louis - Protection Côtière
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#0891b2', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Installer 3km de digues naturelles</span>
                            </li>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#0891b2', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Planter 10,000 palétuviers</span>
                            </li>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#0891b2', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Renforcer 5km de berges</span>
                            </li>
                        </ul>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ color: '#0f766e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fas fa-mountain"></i> Matam - Anti-désertification
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Créer 100 hectares d'agroforesterie</span>
                            </li>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Construire cordons pierreux</span>
                            </li>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Restaurer pâturages dégradés</span>
                            </li>
                        </ul>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ color: '#f59e0b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fas fa-tint"></i> Delta Saloum - Salinisation
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Restaurer mangroves (50 hectares)</span>
                            </li>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Créer bassins eau douce</span>
                            </li>
                            <li style={{ padding: '0.4rem 0', display: 'flex', alignItems: 'flexStart', gap: '0.5rem' }}>
                                <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                <span>Adapter cultures au sel</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Chatbot with AI Analysis */}
            <Chatbot title="Analyse IA" subtitle="Assistant Environnemental">
                <div className="ai-analysis-section">
                    <div className="analysis-header">
                        <i className="fas fa-satellite"></i>
                        <span>Source: Images satellites Sentinel-2</span>
                    </div>
                    <p className="analysis-description">
                        L'analyse par intelligence artificielle identifie les zones de végétation en déclin et les zones côtières à risque d'érosion basée sur les données historiques et les tendances actuelles.
                    </p>

                    <div className="alert-box-ai">
                        <div className="alert-title-ai">
                            <i className="fas fa-exclamation-triangle"></i>
                            Zone critique détectée
                        </div>
                        <div className="alert-content-ai">
                            <strong>Saint-Louis:</strong> Érosion côtière critique - 5m/an
                        </div>
                    </div>

                    <div className="alert-box-ai">
                        <div className="alert-title-ai">
                            <i className="fas fa-exclamation-triangle"></i>
                            Zone critique détectée
                        </div>
                        <div className="alert-content-ai">
                            <strong>Louga:</strong> Diminution NDVI de 15% sur 6 mois
                        </div>
                    </div>

                    <div className="alert-box-ai">
                        <div className="alert-title-ai">
                            <i className="fas fa-exclamation-triangle"></i>
                            Zone critique détectée
                        </div>
                        <div className="alert-content-ai">
                            <strong>Matam:</strong> Avancée du désert de 2km/an
                        </div>
                    </div>
                </div>
            </Chatbot>
        </section>
    );
};

export default Dashboard;
