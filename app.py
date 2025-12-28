"""
Backend Flask pour Kawral AI - Intégration Google Earth Engine
Calcul des indices environnementaux et analyse des risques
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import ee
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Initialisation de Google Earth Engine
try:
    ee.Initialize()
except Exception as e:
    # Pour l'authentification, utilisez: ee.Authenticate()
    print(f"Erreur d'initialisation EE: {e}")

# Configuration des régions
SENEGAL_BOUNDS = ee.Geometry.Rectangle([-17.5, 12.3, -11.4, 16.7])

# Zones côtières à risque
COASTAL_ZONES = {
    'Saint-Louis': ee.Geometry.Point([-16.2630, 15.9516]).buffer(5000),
    'Mbour': ee.Geometry.Point([-16.9622, 14.4530]).buffer(5000),
    'Rufisque': ee.Geometry.Point([-17.1300, 14.7156]).buffer(5000)
}

# Zones de désertification
DESERTIFICATION_ZONES = {
    'Louga': ee.Geometry.Point([-15.4700, 15.3500]).buffer(10000),
    'Matam': ee.Geometry.Point([-13.4900, 15.5700]).buffer(10000),
    'Ferlo': ee.Geometry.Point([-14.2500, 14.8500]).buffer(15000)
}


def calculate_ndvi(image):
    """Calcule l'indice NDVI"""
    return image.normalizedDifference(['B8', 'B4']).rename('NDVI')


def calculate_ndwi(image):
    """Calcule l'indice NDWI"""
    return image.normalizedDifference(['B3', 'B8']).rename('NDWI')


def calculate_lst(image):
    """Calcule la température de surface (LST)"""
    # Sélection de la bande thermique (B10 pour Landsat 8)
    thermal = image.select('B10')
    
    # Conversion en température Celsius
    lst = thermal.multiply(0.00341802).add(149.0).subtract(273.15)
    return lst.rename('LST')


def get_sentinel2_data(start_date, end_date, region):
    """Récupère les données Sentinel-2"""
    collection = (ee.ImageCollection('COPERNICUS/S2_SR')
                 .filterBounds(region)
                 .filterDate(start_date, end_date)
                 .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                 .map(lambda img: img.clip(region)))
    
    return collection


def get_landsat8_data(start_date, end_date, region):
    """Récupère les données Landsat 8 pour LST"""
    collection = (ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
                 .filterBounds(region)
                 .filterDate(start_date, end_date)
                 .filter(ee.Filter.lt('CLOUD_COVER', 20))
                 .map(lambda img: img.clip(region)))
    
    return collection


def get_climate_data(start_date, end_date, region):
    """Récupère les données climatiques ERA5"""
    collection = (ee.ImageCollection('ECMWF/ERA5/DAILY')
                 .filterBounds(region)
                 .filterDate(start_date, end_date)
                 .select(['temperature_2m', 'total_precipitation']))
    
    return collection


def calculate_desertification_risk(ndvi_mean, ndwi_mean, lst_mean, precip_mean):
    """
    Calcule le score de risque de désertification (0-10)
    Basé sur:
    - NDVI faible = végétation dégradée
    - NDWI faible = faible humidité
    - LST élevé = température élevée
    - Précipitations faibles
    """
    risk_score = 0.0
    
    # NDVI : plus c'est bas, plus le risque est élevé
    if ndvi_mean < 0.2:
        risk_score += 3.5
    elif ndvi_mean < 0.35:
        risk_score += 2.5
    elif ndvi_mean < 0.5:
        risk_score += 1.5
    
    # NDWI : faible humidité = risque élevé
    if ndwi_mean < 0.1:
        risk_score += 2.5
    elif ndwi_mean < 0.25:
        risk_score += 1.5
    elif ndwi_mean < 0.4:
        risk_score += 0.5
    
    # LST : température élevée = risque élevé
    if lst_mean > 35:
        risk_score += 2.5
    elif lst_mean > 30:
        risk_score += 1.5
    elif lst_mean > 25:
        risk_score += 0.5
    
    # Précipitations : faibles précipitations = risque élevé
    if precip_mean < 200:
        risk_score += 1.5
    elif precip_mean < 400:
        risk_score += 0.5
    
    return min(10.0, risk_score)


@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')


@app.route('/api/ee-map')
def get_ee_map():
    """Retourne l'URL des tuiles Earth Engine"""
    try:
        year = int(request.args.get('year', 2024))
        risk_type = request.args.get('risk_type', 'all')
        
        # Dates
        start_date = f'{year}-01-01'
        end_date = f'{year}-12-31'
        
        # Récupération des données Sentinel-2
        s2_collection = get_sentinel2_data(start_date, end_date, SENEGAL_BOUNDS)
        
        if s2_collection.size().getInfo() == 0:
            return jsonify({'error': 'Pas de données disponibles'}), 404
        
        # Calcul du composite médian
        composite = s2_collection.median()
        
        # Calcul NDVI
        ndvi = calculate_ndvi(composite)
        
        # Visualisation
        if risk_type == 'desertification':
            # Palette de couleurs pour la désertification
            vis_params = {
                'min': 0,
                'max': 0.8,
                'palette': ['#d32f2f', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50']
            }
            map_id = ndvi.getMapId(vis_params)
        elif risk_type == 'mer':
            # Visualisation RGB pour zones côtières
            vis_params = {
                'bands': ['B4', 'B3', 'B2'],
                'min': 0,
                'max': 3000,
                'gamma': 1.4
            }
            map_id = composite.getMapId(vis_params)
        else:
            # Visualisation par défaut
            vis_params = {
                'bands': ['B4', 'B3', 'B2'],
                'min': 0,
                'max': 3000
            }
            map_id = composite.getMapId(vis_params)
        
        return jsonify({
            'tile_url': map_id['tile_fetcher'].url_format,
            'year': year,
            'risk_type': risk_type
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_zone():
    """Analyse une zone spécifique"""
    try:
        data = request.json
        year = int(data.get('year', 2024))
        risk_type = data.get('risk_type', 'all')
        bounds = data.get('bounds')
        
        # Création de la géométrie de la zone
        if bounds:
            region = ee.Geometry.Rectangle([
                bounds['_southWest']['lng'],
                bounds['_southWest']['lat'],
                bounds['_northEast']['lng'],
                bounds['_northEast']['lat']
            ])
        else:
            region = SENEGAL_BOUNDS
        
        # Dates
        start_date = f'{year}-01-01'
        end_date = f'{year}-12-31'
        
        # Récupération des données Sentinel-2
        s2_collection = get_sentinel2_data(start_date, end_date, region)
        composite = s2_collection.median()
        
        # Calcul des indices
        ndvi = calculate_ndvi(composite)
        ndwi = calculate_ndwi(composite)
        
        # Récupération des données Landsat pour LST
        l8_collection = get_landsat8_data(start_date, end_date, region)
        if l8_collection.size().getInfo() > 0:
            l8_composite = l8_collection.median()
            lst = calculate_lst(l8_composite)
        else:
            lst = ee.Image.constant(30)
        
        # Récupération des données climatiques
        climate = get_climate_data(start_date, end_date, region)
        
        # Calcul des statistiques
        ndvi_stats = ndvi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region,
            scale=100,
            maxPixels=1e9
        ).getInfo()
        
        ndwi_stats = ndwi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region,
            scale=100,
            maxPixels=1e9
        ).getInfo()
        
        lst_stats = lst.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region,
            scale=100,
            maxPixels=1e9
        ).getInfo()
        
        # Récupération des précipitations moyennes
        if climate.size().getInfo() > 0:
            precip = climate.select('total_precipitation').mean()
            precip_stats = precip.reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=region,
                scale=1000,
                maxPixels=1e9
            ).getInfo()
            precip_mean = precip_stats.get('total_precipitation', 300) * 365
        else:
            precip_mean = 300
        
        # Extraction des valeurs
        ndvi_mean = ndvi_stats.get('NDVI', 0.4)
        ndwi_mean = ndwi_stats.get('NDWI', 0.2)
        lst_mean = lst_stats.get('LST', 30)
        
        # Calcul du score de risque
        risk_score = calculate_desertification_risk(
            ndvi_mean, ndwi_mean, lst_mean, precip_mean
        )
        
        return jsonify({
            'ndvi': ndvi_mean,
            'ndwi': ndwi_mean,
            'lst': lst_mean,
            'precipitation': precip_mean,
            'risk_score': risk_score,
            'year': year,
            'analysis_date': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/coastal-erosion/<zone>')
def get_coastal_erosion(zone):
    """Analyse l'érosion côtière pour une zone spécifique"""
    try:
        if zone not in COASTAL_ZONES:
            return jsonify({'error': 'Zone non trouvée'}), 404
        
        region = COASTAL_ZONES[zone]
        
        # Analyse multi-temporelle
        years = [2010, 2015, 2020, 2024]
        erosion_data = []
        
        for year in years:
            start_date = f'{year}-01-01'
            end_date = f'{year}-12-31'
            
            # Récupération des données
            collection = get_sentinel2_data(start_date, end_date, region)
            
            if collection.size().getInfo() > 0:
                composite = collection.median()
                
                # Calcul du MNDWI (Modified NDWI pour détecter l'eau)
                mndwi = composite.normalizedDifference(['B3', 'B11']).rename('MNDWI')
                
                # Statistiques
                stats = mndwi.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=region,
                    scale=10,
                    maxPixels=1e9
                ).getInfo()
                
                erosion_data.append({
                    'year': year,
                    'mndwi': stats.get('MNDWI', 0),
                    'water_extent': stats.get('MNDWI', 0) > 0.3
                })
        
        return jsonify({
            'zone': zone,
            'erosion_data': erosion_data,
            'trend': 'increasing' if len(erosion_data) > 1 and 
                    erosion_data[-1]['mndwi'] > erosion_data[0]['mndwi'] else 'stable'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/reforestation-zones')
def get_reforestation_zones():
    """Identifie les zones favorables au reboisement"""
    try:
        year = int(request.args.get('year', 2024))
        start_date = f'{year}-01-01'
        end_date = f'{year}-12-31'
        
        results = []
        
        for zone_name, region in DESERTIFICATION_ZONES.items():
            # Récupération des données
            s2_collection = get_sentinel2_data(start_date, end_date, region)
            
            if s2_collection.size().getInfo() > 0:
                composite = s2_collection.median()
                
                # Calcul des indices
                ndvi = calculate_ndvi(composite)
                ndwi = calculate_ndwi(composite)
                
                # Statistiques
                ndvi_stats = ndvi.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=region,
                    scale=100,
                    maxPixels=1e9
                ).getInfo()
                
                ndwi_stats = ndwi.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=region,
                    scale=100,
                    maxPixels=1e9
                ).getInfo()
                
                ndvi_mean = ndvi_stats.get('NDVI', 0)
                ndwi_mean = ndwi_stats.get('NDWI', 0)
                
                # Score de priorité (NDVI bas mais NDWI acceptable = bon potentiel)
                priority_score = 0
                if 0.2 < ndvi_mean < 0.4:  # Dégradé mais récupérable
                    priority_score += 5
                if ndwi_mean > 0.15:  # Humidité suffisante
                    priority_score += 3
                if ndwi_mean > 0.25:
                    priority_score += 2
                
                results.append({
                    'zone': zone_name,
                    'ndvi': ndvi_mean,
                    'ndwi': ndwi_mean,
                    'priority_score': min(10, priority_score),
                    'area_ha': region.area().divide(10000).getInfo()
                })
        
        # Tri par score de priorité
        results.sort(key=lambda x: x['priority_score'], reverse=True)
        
        return jsonify({'zones': results, 'year': year})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/time-series')
def get_time_series():
    """Récupère les séries temporelles pour une zone"""
    try:
        zone_type = request.args.get('zone_type', 'desertification')
        zone_name = request.args.get('zone_name', 'Louga')
        
        # Sélection de la région
        if zone_type == 'desertification' and zone_name in DESERTIFICATION_ZONES:
            region = DESERTIFICATION_ZONES[zone_name]
        elif zone_type == 'coastal' and zone_name in COASTAL_ZONES:
            region = COASTAL_ZONES[zone_name]
        else:
            region = SENEGAL_BOUNDS
        
        # Années à analyser
        years = range(2015, 2025)
        time_series = []
        
        for year in years:
            start_date = f'{year}-01-01'
            end_date = f'{year}-12-31'
            
            # Récupération des données
            collection = get_sentinel2_data(start_date, end_date, region)
            
            if collection.size().getInfo() > 0:
                composite = collection.median()
                ndvi = calculate_ndvi(composite)
                
                stats = ndvi.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=region,
                    scale=100,
                    maxPixels=1e9
                ).getInfo()
                
                time_series.append({
                    'year': year,
                    'ndvi': stats.get('NDVI', None)
                })
        
        return jsonify({
            'zone': zone_name,
            'type': zone_type,
            'time_series': time_series
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)