from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import backref

import datetime
db = SQLAlchemy()


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    contrasenia = db.Column(db.String(120))

    pedidos_cabecera = db.relationship('PedidosCabecera')


class PedidosCabecera(db.Model):
    __tablename__= 'pedidoscabecera'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String())
    estado = db.Column(db.String())
    fecha = db.Column(db.DateTime, default=datetime.datetime.now)

    pedido_cabecera_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    pedidos_lineas = db.relationship('PedidosLineas')


class PedidosLineas(db.Model):
    __tablename__= 'pedidoslinea'
    id = db.Column(db.Integer, primary_key=True)
    cantidad = db.Column(db.Float)
    product = db.Column(db.String(120))
    tarifa = db.Column(db.String(100))
    fecha = db.Column(db.Time, default=datetime.datetime.now)

    pedido_id = db.Column(db.Integer, db.ForeignKey('pedidoscabecera.id'))
