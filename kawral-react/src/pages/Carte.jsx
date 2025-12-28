import React, { useEffect, useState, useRef } from 'react';
import Chatbot from '../components/Chatbot';

import desertificationData from '../data/senegal_desertification_2025.json';

const Carte = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersClusterGroupRef = useRef(null);
    const [currentYear, setCurrentYear] = useState('2024');
    const [currentLayer, setCurrentLayer] = useState('desert');
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
    const [layerDropdownOpen, setLayerDropdownOpen] = useState(false);
    const [comparisonType, setComparisonType] = useState('reboisement');
    const [selectedZone, setSelectedZone] = useState(null);

    const zonesData = {
        reboisement: [
            { name: "Fleuve Sénégal", coords: [16.0179, -16.4897], risk: "good", info: "Potentiel élevé de reboisement", color: "#66bb6a", value: "Élevé" },
            { name: "Lac de Guiers", coords: [15.8000, -15.8000], risk: "medium", info: "Potentiel modéré de reboisement", color: "#ffa726", value: "Modéré" },
            { name: "Delta du Saloum", coords: [13.8000, -16.5000], risk: "high", info: "Potentiel faible - zone aride", color: "#d32f2f", value: "Faible" },
            { name: "Région de Ziguinchor", coords: [12.5836, -16.2730], risk: "good", info: "Excellent potentiel de reboisement", color: "#66bb6a", value: "Excellent" }
        ],
        // Desert data is now loaded from JSON
        desert: [],
        erosion: [
            { name: "Saint-Louis", coords: [16.0179, -16.4897], risk: "high", info: "Érosion côtière critique - 5m/an", color: "#d32f2f", value: "5m/an" },
            { name: "Langue de Barbarie", coords: [16.0500, -16.5100], risk: "high", info: "Risque d'inondation élevé", color: "#d32f2f", value: "Critique" },
            { name: "Région de Dakar", coords: [14.7167, -17.4677], risk: "medium", info: "Surveillance côtière nécessaire", color: "#ffa726", value: "2m/an" },
            { name: "Cap Skirring", coords: [12.3967, -16.7497], risk: "medium", info: "Érosion modérée - 1.5m/an", color: "#ffa726", value: "1.5m/an" }
        ]
    };

    const comparisonData = {
        reboisement: {
            title: "Potentiel Reboisement",
            data: [
                { year: "2023", value: "Potentiel: Modéré", class: "yellow" },
                { year: "2024", value: "Potentiel: Élevé", class: "green" }
            ]
        },
        erosion: {
            title: "Érosion",
            data: [
                { year: "2023", value: "Érosion: 2.1m/an", class: "yellow" },
                { year: "2024", value: "Érosion: 3.2m/an", class: "yellow" }
            ]
        }
    };

    useEffect(() => {
        if (!mapInstanceRef.current && window.L) {
            mapInstanceRef.current = window.L.map('map').setView([14.4974, -14.4524], 7);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(mapInstanceRef.current);
        }

        if (mapInstanceRef.current) {
            updateMapMarkers();
        }

        return () => {
            // Cleanup if needed
        };
    }, [currentLayer, currentYear]);

    // Function to cluster zones into weighted markers with improved categorization
    const clusterZones = (zones, maxMarkers = 15) => {
        if (zones.length <= maxMarkers) return zones;

        // Simple grid-based clustering
        const clusters = [];
        const gridSize = Math.ceil(Math.sqrt(maxMarkers));

        // Find bounds
        const lats = zones.map(z => z.coordonnees.latitude);
        const lngs = zones.map(z => z.coordonnees.longitude);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const latStep = (maxLat - minLat) / gridSize;
        const lngStep = (maxLng - minLng) / gridSize;

        // Create grid cells
        const grid = {};
        zones.forEach(zone => {
            const latIdx = Math.floor((zone.coordonnees.latitude - minLat) / latStep);
            const lngIdx = Math.floor((zone.coordonnees.longitude - minLng) / lngStep);
            const key = `${latIdx}_${lngIdx}`;

            if (!grid[key]) {
                grid[key] = [];
            }
            grid[key].push(zone);
        });

        // Create weighted markers for each cell
        Object.values(grid).forEach(cellZones => {
            if (cellZones.length === 0) return;

            // Calculate weighted center
            const avgLat = cellZones.reduce((sum, z) => sum + z.coordonnees.latitude, 0) / cellZones.length;
            const avgLng = cellZones.reduce((sum, z) => sum + z.coordonnees.longitude, 0) / cellZones.length;

            // Calculate average indices
            const avgNDVI = cellZones.reduce((sum, z) => sum + z.indices.ndvi, 0) / cellZones.length;
            const avgBSI = cellZones.reduce((sum, z) => sum + z.indices.bsi, 0) / cellZones.length;
            const avgProb = cellZones.reduce((sum, z) => sum + (z.probabilite.a_risque || 0), 0) / cellZones.length;
            const avgProbNormal = cellZones.reduce((sum, z) => sum + (z.probabilite.normal || 0), 0) / cellZones.length;
            const avgProbDesert = cellZones.reduce((sum, z) => sum + (z.probabilite.desertifie || 0), 0) / cellZones.length;

            // Improved categorization based on multiple factors
            let status = 'À risque';

            // Zone normale/stable: NDVI élevé (>0.4), faible probabilité de risque (<0.5), faible BSI
            if (avgNDVI > 0.4 && avgProb < 0.5 && avgBSI < 0.2) {
                status = 'Normal';
            }
            // Zone désertifiée: NDVI très faible (<0.15) OU probabilité désertifié élevée (>0.3) OU BSI très élevé (>0.4)
            else if (avgNDVI < 0.15 || avgProbDesert > 0.3 || avgBSI > 0.4) {
                status = 'Désertifié';
            }
            // Zone à risque: cas intermédiaires
            else {
                status = 'À risque';
            }

            clusters.push({
                coordonnees: { latitude: avgLat, longitude: avgLng },
                statut: status,
                count: cellZones.length,
                zones: cellZones,
                indices: {
                    ndvi: avgNDVI.toFixed(3),
                    bsi: avgBSI.toFixed(3)
                },
                probabilite: {
                    a_risque: avgProb,
                    normal: avgProbNormal,
                    desertifie: avgProbDesert
                }
            });
        });

        return clusters;
    };

    const updateMapMarkers = () => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear existing layers (except tile layer)
        map.eachLayer((layer) => {
            if (layer instanceof window.L.Marker || layer instanceof window.L.Circle || layer instanceof window.L.MarkerClusterGroup) {
                map.removeLayer(layer);
            }
        });

        // Clear cluster group reference if it exists
        if (markersClusterGroupRef.current) {
            map.removeLayer(markersClusterGroupRef.current);
            markersClusterGroupRef.current = null;
        }

        if (currentLayer === 'desert') {
            // Cluster desertification data into 15 weighted markers with improved categorization
            const clusteredZones = clusterZones(desertificationData.zones_a_risque, 15);

            clusteredZones.forEach(cluster => {
                let labelText = '';
                let descText = '';
                let color = '';

                if (cluster.statut === 'Désertifié') {
                    labelText = 'zone désertifiée';
                    descText = 'végétation diminuée';
                    color = '#d32f2f';
                } else if (cluster.statut === 'Normal') {
                    labelText = 'zone normale';
                    descText = 'végétation stable';
                    color = '#66bb6a';
                } else {
                    labelText = 'zone à risque';
                    descText = 'végétation très faible';
                    color = '#ffa726';
                }

                const iconHtml = `<div style="
                    background: white;
                    border: 2px solid ${color};
                    border-radius: 5px;
                    padding: 3px 6px;
                    font-family: 'Segoe UI', sans-serif;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    white-space: nowrap;
                    min-width: 85px;
                ">
                    <div style="
                        font-weight: bold;
                        font-size: 10px;
                        color: #333;
                        margin-bottom: 1px;
                    ">${labelText}</div>
                    <div style="
                        font-size: 8px;
                        color: #666;
                    ">${descText}</div>
                </div>`;

                const customIcon = window.L.divIcon({
                    html: iconHtml,
                    className: 'custom-marker',
                    iconSize: [90, 30],
                    iconAnchor: [45, 15]
                });

                const marker = window.L.marker([cluster.coordonnees.latitude, cluster.coordonnees.longitude], { icon: customIcon }).addTo(map);

                // Update AI analysis on marker click
                marker.on('click', () => {
                    setSelectedZone(cluster);
                });

                marker.bindPopup(`
                    <div style="font-family: 'Segoe UI', sans-serif; min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; color: #1b5e20; font-size: 1.1em; font-weight: 700;">Zone groupée (${cluster.count} zones)</h3>
                        <p style="margin: 4px 0; color: #555; font-size: 0.9em;"><strong>Statut:</strong> <span style="color: ${color}; font-weight: bold;">${cluster.statut}</span></p>
                        <p style="margin: 4px 0; color: #555; font-size: 0.9em;"><strong>Probabilité à risque:</strong> ${(cluster.probabilite.a_risque * 100).toFixed(1)}%</p>
                        <p style="margin: 4px 0; color: #555; font-size: 0.9em;"><strong>Probabilité normale:</strong> ${(cluster.probabilite.normal * 100).toFixed(1)}%</p>
                        <p style="margin: 4px 0; color: #555; font-size: 0.9em;"><strong>NDVI moyen:</strong> ${cluster.indices.ndvi}</p>
                        <p style="margin: 4px 0; color: #555; font-size: 0.9em;"><strong>BSI moyen:</strong> ${cluster.indices.bsi}</p>
                        <p style="margin: 4px 0 0 0; color: #888; font-size: 0.8em;">Cliquez pour voir l'analyse IA</p>
                    </div>
                `);
            });
        } else {
            // Standard markers for other layers
            const layersToDisplay = currentLayer === 'all'
                ? ['reboisement', 'erosion']
                : [currentLayer];

            layersToDisplay.forEach(layerKey => {
                const zones = zonesData[layerKey];
                if (!zones) return;

                zones.forEach(zone => {
                    let labelText = '';
                    let descText = '';

                    if (zone.risk === 'high') {
                        labelText = 'zone à risque';
                        descText = layerKey === 'reboisement' ? 'potentiel faible' : 'érosion critique';
                    } else if (zone.risk === 'medium') {
                        labelText = 'zone modérée';
                        descText = layerKey === 'reboisement' ? 'potentiel modéré' : 'érosion modérée';
                    } else {
                        labelText = 'zone normale';
                        descText = layerKey === 'reboisement' ? 'potentiel élevé' : 'état stable';
                    }

                    const iconHtml = `<div style="
                        background: white;
                        border: 2px solid ${zone.color};
                        border-radius: 5px;
                        padding: 3px 6px;
                        font-family: 'Segoe UI', sans-serif;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        white-space: nowrap;
                        min-width: 85px;
                    ">
                        <div style="
                            font-weight: bold;
                            font-size: 10px;
                            color: #333;
                            margin-bottom: 1px;
                        ">${labelText}</div>
                        <div style="
                            font-size: 8px;
                            color: #666;
                        ">${descText}</div>
                    </div>`;

                    const customIcon = window.L.divIcon({
                        html: iconHtml,
                        className: 'custom-marker',
                        iconSize: [90, 30],
                        iconAnchor: [45, 15]
                    });

                    const marker = window.L.marker(zone.coords, { icon: customIcon }).addTo(map);

                    marker.bindPopup(`
                        <div style="font-family: 'Segoe UI', sans-serif; min-width: 200px;">
                            <h3 style="margin: 0 0 12px 0; color: #1b5e20; font-size: 1.2em; font-weight: 700;">${zone.name}</h3>
                            <p style="margin: 8px 0; color: #555; font-size: 0.95em;"><strong>Statut:</strong> ${zone.info}</p>
                            <p style="margin: 8px 0; color: #555; font-size: 0.95em;"><strong>Valeur:</strong> ${zone.value}</p>
                            <p style="margin: 8px 0; color: #555; font-size: 0.95em;"><strong>Niveau de risque:</strong> 
                                <span style="color: ${zone.color}; font-weight: bold;">
                                    ${zone.risk === 'high' ? 'Élevé' : zone.risk === 'medium' ? 'Moyen' : 'Bon état'}
                                </span>
                            </p>
                            <p style="margin: 8px 0 0 0; color: #888; font-size: 0.85em;">Année: ${currentYear}</p>
                        </div>
                    `);
                });
            });
        }
    };

    const togglePredictions = () => {
        alert('Prédictions IA activées: Affichage des zones à risque futur basé sur les tendances actuelles');
    };

    const generateReport = () => {
        alert('Rapport généré avec succès!\\n\\nContenu:\\n- Analyse des zones à risque\\n- Évolution temporelle\\n- Recommandations');
    };

    const layerNames = {
        'reboisement': 'Potentiel Reboisement',
        'desert': 'Désertification',
        'erosion': 'Érosion côtière',
        'all': 'Tous'
    };

    const layerIcons = {
        'reboisement': 'fa-tree',
        'desert': 'fa-mountain',
        'erosion': 'fa-water',
        'all': 'fa-layer-group'
    };

    return (
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ color: '#1b5e20', fontSize: '2.5em', marginBottom: '10px', fontWeight: 700 }}>Carte & Analyse IA</h1>
                    <p className="subtitle">Visualisez les données satellites et les prédictions de notre intelligence artificielle</p>
                </div>
                <button className="btn btn-primary" onClick={generateReport} style={{ padding: '15px 30px', fontSize: '1em' }}>
                    <i className="fas fa-chart-line"></i>
                    <span style={{ marginLeft: '10px' }}>Générer un rapport</span>
                </button>
            </header>

            <div style={{ display: 'flex', gap: '25px', marginBottom: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div className="card" style={{ flex: '1', minWidth: '0' }}>
                    <div className="filters">
                        <div className={`dropdown ${yearDropdownOpen ? 'show' : ''}`} onClick={() => setYearDropdownOpen(!yearDropdownOpen)}>
                            <div className="filter-btn">
                                <i className="far fa-calendar-alt"></i>
                                <span>{currentYear}</span>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="dropdown-content">
                                {['2024', '2023', '2022', '2021', '2020'].map(year => (
                                    <div
                                        key={year}
                                        className={`dropdown-item ${currentYear === year ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); setCurrentYear(year); setYearDropdownOpen(false); }}
                                    >
                                        {currentYear === year && <i className="fas fa-check"></i>} {year}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`dropdown ${layerDropdownOpen ? 'show' : ''}`} onClick={() => setLayerDropdownOpen(!layerDropdownOpen)}>
                            <div className="filter-btn">
                                <i className={`fas ${layerIcons[currentLayer]}`}></i>
                                <span>{layerNames[currentLayer]}</span>
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="dropdown-content">
                                {Object.keys(layerNames).map(layer => (
                                    <div
                                        key={layer}
                                        className={`dropdown-item ${currentLayer === layer ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); setCurrentLayer(layer); setLayerDropdownOpen(false); }}
                                    >
                                        {currentLayer === layer && <i className="fas fa-check"></i>} {layerNames[layer]}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="filter-btn" style={{ padding: '5px 10px', minWidth: '200px' }}>
                            <i className="fas fa-search" style={{ color: '#64748b' }}></i>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    width: '100%',
                                    color: '#2d3748',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>

                        <div className="filter-btn" onClick={togglePredictions}>
                            <i className="fas fa-brain"></i>
                            <span>Prédictions IA</span>
                        </div>
                    </div>


                    <div id="map"></div>

                    <div className="legend">
                        <div className="legend-title">Légende</div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: '#d32f2f' }}></div>
                            <span>Risque élevé</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: '#ffa726' }}></div>
                            <span>Risque moyen</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: '#66bb6a' }}></div>
                            <span>Bon état</span>
                        </div>
                    </div>

                </div>

                <div className="right-panel" style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '350px', flexShrink: '0' }}>
                    <div className="card analysis-panel">
                        <h3>
                            <i className="fas fa-brain"></i>
                            <span>Analyse IA</span>
                        </h3>
                        <p className="analysis-text"><strong>Source:</strong> Images satellites Sentinel-2</p>
                        <p className="analysis-text">L'analyse par intelligence artificielle identifie les zones de végétation en déclin et les zones côtières à risque d'érosion basée sur les données historiques et les tendances actuelles.</p>

                        {selectedZone ? (
                            <div className="alert-box">
                                <div className="alert-title">Zone sélectionnée</div>
                                <div className="alert-content">
                                    <p style={{ margin: '4px 0', fontSize: '0.9em' }}><strong>Statut:</strong> <span style={{ color: selectedZone.statut === 'Désertifié' ? '#d32f2f' : selectedZone.statut === 'Normal' ? '#66bb6a' : '#ffa726', fontWeight: 'bold' }}>{selectedZone.statut}</span></p>
                                    <p style={{ margin: '4px 0', fontSize: '0.9em' }}><strong>Zones groupées:</strong> {selectedZone.count}</p>
                                    <p style={{ margin: '4px 0', fontSize: '0.9em' }}><strong>Probabilité à risque:</strong> {(selectedZone.probabilite.a_risque * 100).toFixed(1)}%</p>
                                    <p style={{ margin: '4px 0', fontSize: '0.9em' }}><strong>Probabilité normale:</strong> {(selectedZone.probabilite.normal * 100).toFixed(1)}%</p>
                                    <p style={{ margin: '4px 0', fontSize: '0.9em' }}><strong>NDVI moyen:</strong> {selectedZone.indices.ndvi}</p>
                                    <p style={{ margin: '4px 0', fontSize: '0.9em' }}><strong>BSI moyen:</strong> {selectedZone.indices.bsi}</p>
                                    <p style={{ margin: '4px 0', fontSize: '0.9em' }}><strong>Coordonnées:</strong> {selectedZone.coordonnees.latitude.toFixed(4)}°N, {selectedZone.coordonnees.longitude.toFixed(4)}°W</p>
                                </div>
                            </div>
                        ) : (
                            <div className="alert-box">
                                <div className="alert-title">Zone détectée</div>
                                <div className="alert-content">
                                    {currentLayer !== 'all' && zonesData[currentLayer]?.find(z => z.risk === 'high')
                                        ? `${zonesData[currentLayer].find(z => z.risk === 'high').name}: ${zonesData[currentLayer].find(z => z.risk === 'high').info}`
                                        : "Cliquez sur un marqueur pour voir les détails de la zone."}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="chart-container">
                            <div className="chart-title">Évolution Désertification (6 mois)</div>
                            <div className="chart">
                                <div className="y-axis">
                                    <span>100</span>
                                    <span>75</span>
                                    <span>50</span>
                                    <span>25</span>
                                    <span>0</span>
                                </div>
                                <div className="chart-line">
                                    <svg viewBox="0 0 300 200" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style={{ stopColor: '#4caf50', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#2e7d32', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
                                        <polyline
                                            fill="none"
                                            stroke="url(#lineGradient)"
                                            strokeWidth="4"
                                            points="0,100 50,140 100,120 150,90 200,85 250,105 300,110"
                                        />
                                        <circle cx="0" cy="100" r="5" fill="#2e7d32" />
                                        <circle cx="50" cy="140" r="5" fill="#2e7d32" />
                                        <circle cx="100" cy="120" r="5" fill="#2e7d32" />
                                        <circle cx="150" cy="90" r="5" fill="#2e7d32" />
                                        <circle cx="200" cy="85" r="5" fill="#2e7d32" />
                                        <circle cx="250" cy="105" r="5" fill="#2e7d32" />
                                        <circle cx="300" cy="110" r="5" fill="#2e7d32" />
                                    </svg>
                                </div>
                            </div>
                            <div className="chart-labels">
                                <span>Jan</span>
                                <span>Fév</span>
                                <span>Mar</span>
                                <span>Avr</span>
                                <span>Mai</span>
                                <span>Jun</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="comparison-section">
                <h2 className="section-title" style={{ fontSize: '2em', color: '#1b5e20', marginBottom: '30px', fontWeight: 700 }}>Comparaisons temporelles</h2>

                <div className="tabs">
                    {['reboisement', 'erosion'].map(type => (
                        <div
                            key={type}
                            className={`tab ${comparisonType === type ? 'active' : ''}`}
                            onClick={() => setComparisonType(type)}
                        >
                            {comparisonData[type].title}
                        </div>
                    ))}
                </div>

                <div className="comparison-grid">
                    {comparisonData[comparisonType].data.map((item, index) => (
                        <div key={index} className={`comparison-card ${item.class}`}>
                            <div className="comparison-year">{item.year}</div>
                            <div className="comparison-value">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chatbot with Map Analysis */}
            <Chatbot title="Analyse Cartographique" subtitle="Assistant IA">
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
                            Zone détectée - {layerNames[currentLayer]}
                        </div>
                        <div className="alert-content-ai">
                            {currentLayer !== 'all' && zonesData[currentLayer]?.find(z => z.risk === 'high')
                                ? `${zonesData[currentLayer].find(z => z.risk === 'high').name}: ${zonesData[currentLayer].find(z => z.risk === 'high').info}`
                                : "Aucune zone critique détectée dans cette vue."}
                        </div>
                    </div>

                    <div className="alert-box-ai" style={{ background: '#e0f2fe', borderLeft: '3px solid #0891b2' }}>
                        <div className="alert-title-ai" style={{ color: '#0891b2' }}>
                            <i className="fas fa-info-circle"></i>
                            Couche active
                        </div>
                        <div className="alert-content-ai">
                            <strong>Année:</strong> {currentYear}<br />
                            <strong>Type:</strong> {layerNames[currentLayer]}
                        </div>
                    </div>
                </div>
            </Chatbot>
        </div>
    );
};

export default Carte;
