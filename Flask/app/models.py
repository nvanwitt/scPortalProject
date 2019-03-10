
from flask_sqlalchemy import SQLAlchemy
# Set up ORM database for app
db = SQLAlchemy()


class UserData(db.Model):
    __tablename__ = 'UserData'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    dataName = db.Column(db.String(64))
    dataPath = db.Column(db.String(140))
    # settings = db.relationship('UserSettings', backref='settings', lazy='dynamic')
    # geneSets = db.relationship('UserLists', backref='genesets', lazy='dynamic')
    description = db.Column(db.String(140))


class UserSettings(db.Model):
    __tablename__ = 'UserSettings'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))

    # Can add columns for Gene Filter, Cell Filter, Dispersion settings, scale settings, neighbors settings


class UserLists(db.Model):
    __tablename__ = 'UserLists'
    id = db.Column(db.Integer, primary_key=True)
    setName = db.Column(db.String(140), index=True)
    geneSet = db.Column(db.String(1000), index=True)
