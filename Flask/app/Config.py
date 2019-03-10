# note, db must be premade
import os


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    MYSQL_DATABASE_USER = os.environ.get('MYSQL_DATABASE_USER')
    MYSQL_DATABASE_PASSWORD = os.environ.get('MYSQL_DATABASE_PASSWORD')
    MYSQL_DATABASE_HOST = os.environ.get('MYSQL_DATABASE_HOST')
    MYSQL_DATABASE_DB = os.environ.get('MYSQL_DATABASE_DB')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://{username}:{password}@{hostname}/{databasename}".format(
        username=MYSQL_DATABASE_USER,
        password=MYSQL_DATABASE_PASSWORD,
        hostname=MYSQL_DATABASE_HOST,
        databasename=MYSQL_DATABASE_DB)

    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT'))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') is not None
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    ADMINS = os.environ.get('ADMINS')
