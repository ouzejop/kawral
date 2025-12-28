"""
Script de configuration pour Google Earth Engine
Guide d'installation et d'authentification
"""

import ee
import os
from pathlib import Path

def authenticate_earth_engine():
    """
    Authentifie l'utilisateur avec Google Earth Engine
    
    Étapes:
    1. Exécutez ce script une première fois
    2. Suivez le lien fourni pour obtenir le code d'authentification
    3. Collez le code dans le terminal
    """
    try:
        print("🌍 Authentification Google Earth Engine")
        print("-" * 50)
        print("Vous allez être redirigé vers une page d'authentification Google.")
        print("Connectez-vous avec votre compte Google et autorisez l'accès.")
        print("-" * 50)
        
        ee.Authenticate()
        print("✅ Authentification réussie!")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'authentification: {e}")
        print("\nAssurez-vous d'avoir:")
        print("1. Un compte Google")
        print("2. Accès à Earth Engine (inscrivez-vous sur https://earthengine.google.com/)")


def initialize_earth_engine(project_id=None):
    """
    Initialise Earth Engine après authentification
    
    Args:
        project_id: ID du projet Google Cloud (optionnel mais recommandé)
    """
    try:
        if project_id:
            ee.Initialize(project=project_id)
            print(f"✅ Earth Engine initialisé avec le projet: {project_id}")
        else:
            ee.Initialize()
            print("✅ Earth Engine initialisé (mode par défaut)")
        
        # Test de connexion
        image = ee.Image("COPERNICUS/S2/20200101T000000_20200101T000000_T31UFS")
        print(f"🧪 Test de connexion: {image.getInfo()['id']}")
        print("✅ Connexion à Earth Engine fonctionnelle!")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")
        print("\nSi vous n'êtes pas encore authentifié, exécutez:")
        print("python setup_earth_engine.py --authenticate")


def create_env_file():
    """
    Crée un fichier .env avec les variables d'environnement nécessaires
    """
    env_content = """# Configuration Kawral AI Backend

# Google Earth Engine
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
EE_PROJECT_ID=your-project-id

# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# API Configuration
API_RATE_LIMIT=100
API_TIMEOUT=30

# Database (optionnel)
DATABASE_URL=postgresql://user:password@localhost:5432/kawral_db
"""
    
    env_path = Path('.env')
    if not env_path.exists():
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Fichier .env créé!")
        print("⚠️  N'oubliez pas de remplir les valeurs dans le fichier .env")
    else:
        print("ℹ️  Le fichier .env existe déjà")


def setup_service_account():
    """
    Guide pour configurer un compte de service Google Cloud
    """
    print("\n" + "=" * 60)
    print("CONFIGURATION D'UN COMPTE DE SERVICE (Pour la production)")
    print("=" * 60)
    print("""
1. Allez sur Google Cloud Console (console.cloud.google.com)
2. Créez ou sélectionnez un projet
3. Activez l'API Earth Engine
4. Allez dans "IAM & Admin" > "Service Accounts"
5. Créez un nouveau compte de service
6. Téléchargez la clé JSON
7. Placez le fichier JSON dans votre projet
8. Ajoutez le chemin dans le fichier .env:
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

9. Pour initialiser avec un compte de service:
""")
    
    print("""
    import ee
    import os
    
    # Lecture des credentials
    credentials = ee.ServiceAccountCredentials(
        email='your-service-account@your-project.iam.gserviceaccount.com',
        key_file=os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    )
    
    # Initialisation
    ee.Initialize(credentials)
    """)


def check_installation():
    """
    Vérifie que toutes les dépendances sont installées
    """
    print("\n🔍 Vérification des dépendances...")
    
    dependencies = {
        'earthengine-api': 'ee',
        'flask': 'flask',
        'numpy': 'numpy',
        'flask-cors': 'flask_cors'
    }
    
    missing = []
    for package, module in dependencies.items():
        try:
            __import__(module)
            print(f"✅ {package} installé")
        except ImportError:
            print(f"❌ {package} manquant")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Packages manquants: {', '.join(missing)}")
        print("Installez-les avec:")
        print(f"pip install {' '.join(missing)}")
    else:
        print("\n✅ Toutes les dépendances sont installées!")


if __name__ == '__main__':
    import sys
    
    print("=" * 60)
    print("KAWRAL AI - CONFIGURATION GOOGLE EARTH ENGINE")
    print("=" * 60)
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--authenticate':
            authenticate_earth_engine()
        elif sys.argv[1] == '--init':
            project_id = sys.argv[2] if len(sys.argv) > 2 else None
            initialize_earth_engine('peppy-tiger-402921')
        elif sys.argv[1] == '--create-env':
            create_env_file()
        elif sys.argv[1] == '--service-account':
            setup_service_account()
        elif sys.argv[1] == '--check':
            check_installation()
        else:
            print("Options disponibles:")
            print("  --authenticate      : Authentifier avec Google Earth Engine")
            print("  --init [project_id] : Initialiser Earth Engine")
            print("  --create-env        : Créer le fichier .env")
            print("  --service-account   : Guide pour compte de service")
            print("  --check            : Vérifier les dépendances")
    else:
        print("\nGuide d'installation rapide:")
        print("\n1. Installer les dépendances:")
        print("   pip install -r requirements.txt")
        print("\n2. Vérifier l'installation:")
        print("   python setup_earth_engine.py --check")
        print("\n3. S'authentifier avec Earth Engine:")
        print("   python setup_earth_engine.py --authenticate")
        print("\n4. Initialiser Earth Engine:")
        print("   python setup_earth_engine.py --init")
        print("\n5. Créer le fichier de configuration:")
        print("   python setup_earth_engine.py --create-env")
        print("\nPour la production, utilisez un compte de service:")
        print("   python setup_earth_engine.py --service-account")