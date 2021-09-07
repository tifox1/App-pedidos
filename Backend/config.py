import os 

class Config(object):
    SECRET_KEY = 'esta_clave_es_secreta'

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:3142@db/A1'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FLASK_ADMIN_SWATCH = 'darkly'
