"""
Django settings for 'Geleceğin Dijital Sağlık Liderleri' backend.
"""

from pathlib import Path

# .env dosyasını yükle (opsiyonel — python-dotenv kurulu değilse sessizce atlanır)
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / '.env', override=False)
except ImportError:
    pass

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-gdsl-2024-replace-in-production'

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# ─── Installed Apps ───────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # Local
    'core',
]

# ─── Middleware ────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',          # CORS — React frontend için
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# ─── Database ─────────────────────────────────────────────────────────────────
# DATABASE_URL tanımlıysa PostgreSQL (Supabase), yoksa yerel SQLite kullanılır.
import os, urllib.parse, dj_database_url

_DATABASE_URL = os.environ.get('DATABASE_URL', '').strip()

if _DATABASE_URL:
    # Paroladaki özel karakterler (@, #, %, vb.) URL parse hatasına yol açmasın diye otomatik encode et
    try:
        if '://' in _DATABASE_URL and '@' in _DATABASE_URL:
            scheme, rest = _DATABASE_URL.split('://', 1)
            creds, host_part = rest.rsplit('@', 1)
            if ':' in creds:
                user, passwd = creds.split(':', 1)
                if '%' not in passwd:
                    passwd = urllib.parse.quote(passwd, safe='')
                _DATABASE_URL = f'{scheme}://{user}:{passwd}@{host_part}'
    except Exception:
        pass

    DATABASES = {
        'default': dj_database_url.parse(
            _DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# ─── Auth ─────────────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─── i18n ─────────────────────────────────────────────────────────────────────
LANGUAGE_CODE = 'tr-tr'
TIME_ZONE = 'Europe/Istanbul'
USE_I18N = True
USE_TZ = True

# ─── Static Files ─────────────────────────────────────────────────────────────
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─── CORS (MVP aşaması için tüm domainlere izin) ──────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True

# ─── DRF ──────────────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',   # Prototip — prodüksiyonda kaldır
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# ─── SIMPLE JWT ───────────────────────────────────────────────────────────────
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# ─── Jazzmin UI ───────────────────────────────────────────────────────────────
JAZZMIN_SETTINGS = {
    "site_title": "GDSL Admin",
    "site_header": "Dijital Sağlık Liderleri",
    "site_brand": "GDSL Yönetim",
    "welcome_sign": "Geleceğin Dijital Sağlık Liderleri Yönetim Paneline Hoş Geldiniz",
    "copyright": "GDSL © 2024",
    "show_sidebar": True,
    "navigation_expanded": True,
    "icons": {
        "core.Aday": "fas fa-user-graduate",
        "core.Takim": "fas fa-users",
        "core.Katilimci": "fas fa-id-badge",
        "core.Gorev": "fas fa-tasks",
        "core.Teslim": "fas fa-file-upload",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
}

JAZZMIN_UI_TWEAKS = {
    "theme": "litera",
    "dark_mode_theme": "darkly",
}

# ─── MEDIA FILES ──────────────────────────────────────────────────────────────
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

