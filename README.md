# 🌍 AI-KAWRAL CÔTIER  
## Prédiction de l’érosion côtière par Intelligence Artificielle

AI-KAWRAL CÔTIER est un système d’intelligence artificielle conçu pour surveiller, analyser et prédire l’érosion du littoral sénégalais à partir de données satellites et climatiques.

Ce projet vise à fournir un outil d’aide à la décision pour les acteurs publics (ministères, collectivités) et les organisations environnementales.

---

## 🚀 Objectifs

- Surveiller l’évolution du littoral à partir de données satellites
- Identifier les zones à risque d’érosion
- Prédire l’évolution de l’érosion sur un horizon temporel
- Aider à l’optimisation des décisions et des investissements environnementaux

---

## 🧠 Approche technique

Le projet repose sur une combinaison de **Machine Learning** et de **Deep Learning** :

### 🔹 1. Collecte et traitement des données
- Données satellites : Sentinel-2 (ESA)
- Données climatiques : ERA5 Land
- Données océaniques : NOAA Sea Level Anomaly
- Extraction et traitement de **2771 observations géolocalisées (2020–2024)**

### 🔹 2. Feature Engineering
- Calcul d’indices spectraux :
  - NDWI (eau)
  - NDVI (végétation)
- Création de variables temporelles
- Structuration des données pour modèles ML

### 🔹 3. Modélisation

#### 📊 Modèle de classification
- Algorithme : Random Forest
- Accuracy : **87%**
- F1-score : **0.83**
- Objectif : identifier les zones à risque d’érosion

#### 📈 Modèle de prédiction temporelle
- Modèle : LSTM (Deep Learning)
- Horizon : 12 mois
- MAE : **0.17**
- Objectif : prévoir l’évolution de l’érosion

---

## 📊 Visualisation & Dashboard

- Cartes géospatiales interactives (Folium)
- Dashboards dynamiques (Plotly)
- Visualisation des zones critiques et évolution temporelle

---

## 🛠️ Stack technique

- **Langage :** Python  
- **Machine Learning :** Scikit-learn, Random Forest  
- **Deep Learning :** TensorFlow / Keras (LSTM)  
- **Data processing :** Pandas, NumPy  
- **Géospatial :** Google Earth Engine, Folium  
- **Visualisation :** Plotly  

---

## 📈 Résultats clés

- 2771 observations analysées (2020–2024)
- Détection automatique des zones à risque
- Modèle ML performant (Accuracy 87%)
- Prédiction temporelle fiable sur 12 mois
- Visualisation claire pour prise de décision

---

## 🌱 Impact

- Aide à la décision pour les politiques publiques
- Optimisation des budgets de protection côtière
- Contribution à la lutte contre les effets du changement climatique
- Approche orientée impact réel (environnement & société)

---

## 🔮 Perspectives d’amélioration

- Intégration de données supplémentaires (marées, vent, urbanisation)
- Déploiement en API pour accès en temps réel
- Intégration dans une plateforme web ou mobile
- Approche MLOps pour industrialisation du modèle

---

## 👨‍💻 Auteur

**Pape Saniebe Ndao $ mon equipe**  
Data Scientist & ML Engineer  
📍 Sénégal  
🔗 GitHub : https://github.com/papesaniebendao

---

## ⭐ Remarque

Ce projet s’inscrit dans une démarche d’application concrète de l’intelligence artificielle à des problématiques environnementales critiques, avec un fort potentiel d’impact en Afrique de l’Ouest.
