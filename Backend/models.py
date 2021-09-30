from enum import unique
from flask import Flask, app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import backref
from flask_login import UserMixin
from werkzeug.security import generate_password_hash
import datetime
db = SQLAlchemy()


class Usuario(db.Model):
    __tablename__= 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    partner_id= db.Column(db.Integer, unique = True)
    nombre = db.Column(db.String(100))
    campo_odoo = db.Column(db.String(100))
    contrasenia = db.Column(db.String(120))
    pedidos_cabecera = db.relationship('PedidosCabecera')


class PedidosCabecera(db.Model):
    __tablename__= 'pedidoscabecera'
    id =  db.Column(db.Integer, primary_key= True, autoincrement=False, unique= True)
    nombre  = db.Column(db.String())
    tarifa = db.Column(db.Integer)
    precio_total=db.Column(db.String)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.partner_id'))
    comentario = db.Column(db.String)
    pedidos_lineas = db.relationship('PedidosLineas')


class PedidosLineas(db.Model):
    __tablename__= 'pedidoslinea'
    id = db.Column(db.Integer, primary_key=True)
    cantidad = db.Column(db.Float)
    id_producto = db.Column(db.Integer)
    cabecera_id = db.Column(db.Integer, db.ForeignKey('pedidoscabecera.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(40))
    password = db.Column(db.String(100))

    def __init__(self, name, password):
        self.password = generate_password_hash(password, method='sha256')
        self.name = name


