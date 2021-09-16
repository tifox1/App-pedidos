from configparser import ConfigParser
from flask import Flask, json, jsonify
from flask.blueprints import Blueprint
from flask.helpers import url_for
from flask_sqlalchemy import model
from sqlalchemy.orm import query
from werkzeug.utils import redirect
from flask.cli import with_appcontext
from flask_cors import CORS
from flask import request
from flask_script import Manager, Server
from flask_migrate import Migrate, MigrateCommand
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, current_user, login_user, logout_user
from xmlrpc import client
from flask_bootstrap import Bootstrap
import logging

from admin import admin_page, admin
from models import db
from models import Usuario, PedidosCabecera, PedidosLineas, User
from config import DevelopmentConfig


config = ConfigParser()
config.read('config.ini')
app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config.from_object(DevelopmentConfig)
# app.config.from_pyfile('config.cfg')
app.secret_key = 'esta_clave_es_secreta'
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
migrate = Migrate(app, db)
manager = Manager(app)
admin.init_app(app)
app.register_blueprint(admin_page)
# connection = p.connect(dbname='app_db', user= 'postgres', host='dbdata_pedidos:/var/lib/postgresql/data', password='3142', port=5432)
_logger = logging.getLogger(__name__)



manager.add_command('db', MigrateCommand)
@manager.command
def create_db():
    db.create_all()
    return 'Tabla creada'
login = LoginManager(app)

@manager.command
def super_u(user, password):
    user = User(name=user, password=password)
    db.session.add(user)
    db.session.commit()
    return f"Superusuario '{user}' creado exitosamente!"


@login.user_loader
def load_user(user_id):
    return User.query.get(user_id)


# XMLRPC
common = client.ServerProxy('http://%s:%s/xmlrpc/2/common' % (config['odoo']['srv'], int(config['odoo']['port'])))
common.version()
uid = common.authenticate(config['odoo']['db_odoo'], config['odoo']['user'], config['odoo']['password'], {})
prox = client.ServerProxy('http://%s:%s/xmlrpc/2/object' % (config['odoo']['srv'], config['odoo']['port']))

login = LoginManager(app)


@login.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# ----------------------------------------------------------------------CONSULTAS ODOO----------------------------------------------------------------------------------------------------

def consulta_cabecera(id):
    resultado = prox.execute_kw(
        config['odoo']['db_odoo'], uid, config['odoo']['password'],
        'sale.order',
        'search_read',  # Buscar y leer
        [[['id', '=', id]]],  # Condición
        {
            'fields': ['name', 'pricelist_id', 'partner_id', 'id', 'amount_total'],
            'order': 'name',
            'limit': 5
        }  # Campos que va a traer
    )
    return resultado


def consulta_linea(id):
    resultado = prox.execute_kw(
        config['odoo']['db_odoo'], uid, config['odoo']['password'],
        'sale.order.line',
        'search_read',  # Buscar y leer
        [[['order_id', '=', id]]],  # Condición
        {
            'fields': ['product_uom_qty', 'product_id', 'order_id'],
            'order': 'name',
            'limit': 5
        }  # Campos que va a traer
    )
    return resultado


def create_linea(id, id_producto, cantidad, precio_total, precio_unitario):
    ''' 
    revisar impuestos
    '''
    product_odoo = prox.execute_kw(
        config['odoo']['db_odoo'],
        uid,
        config['odoo']['password'],
        'product.product',
        'search_read', [[
            ['product_tmpl_id', '=', id_producto]
        ]],
        {'fields': ['display_name', 'id']}
    )
    id = prox.execute_kw(
        config['odoo']['db_odoo'],
        uid,
        config['odoo']['password'],
        'sale.order.line',
        'create', [{
            'name': product_odoo[0]['display_name'],
            'order_id': id,
            'product_id': product_odoo[0]['id'],
            'product_uom_qty': cantidad,
            'price_unit': precio_unitario,
            'price_total': precio_total,
            'tax_id':  [(6, 0, [2])],
            # 'customer_lead': 223,
            'product_uom': 1
        }]
    )


def create_cabecera(id_cliente, id_tarifa):
    id = prox.execute_kw(
        config['odoo']['db_odoo'],
        uid,
        config['odoo']['password'],
        'sale.order',
        'create', [{
            'partner_id': int(id_cliente),
            'pricelist_id': int(id_tarifa)
        }]
    )
    return id

def producto(campo):
    contenido_odoo = prox.execute_kw(
        config['odoo']['db_odoo'], uid, config['odoo']['password'],
        'product.template',
        'search_read',  # Buscar y leer
        [[[campo, '=', True ]]],  # Condición
        {
            'fields': ['name', 'id'],
            'order': 'name',
        }  # Campos que va a traer
    )
    return contenido_odoo


def consulta_tarifa(user_id):
    contenido_odoo = prox.execute_kw(
        config['odoo']['db_odoo'], uid, config['odoo']['password'],
        'product.pricelist',
        'search_read',  # Buscar y leer
        [[['partner_id', '=', user_id]]],  # Condición
        {
            'fields': ['name', 'id'],
            'order': 'name',
        }  # Campos que va a traer
    )
    return contenido_odoo 

def historial(id):
    contenido_odoo = prox.execute_kw(
        config['odoo']['db_odoo'], uid, config['odoo']['password'],
        'sale.order',
        'search_read',  # Buscar y leer
        [[['id', '=', id]]],  # Condición
        {
            'fields': ['name', 'state', 'currency_id'],
            'order': 'name',
        }  # Campos que va a traer
    )
    return contenido_odoo 

def consulta_precio(product_id, tarifa_id):

    contenido_odoo = prox.execute_kw(
        config['odoo']['db_odoo'], uid, config['odoo']['password'],
        'product.pricelist.item',
        'search_read',  # Buscar y leer
        [[['product_tmpl_id', '=', product_id],['pricelist_id', '=', tarifa_id]]],  # Condición
        {
            'fields': ['fixed_price'],
            'order': 'name',
        }  # Campos que va a traer
    )
    return contenido_odoo

# ----------------------------------------------------------------------USUARIO-----------------------------------------------------------------------------------------------

@app.route('/api/usuario_validacion/', methods=['GET', 'POST'])
def usuario_validacion():
    datos = json.loads(request.data)
    query_datos = Usuario.query.filter_by(
        nombre=str(datos.get('usuario')),
        contrasenia=str(datos.get('contrasenia')),
    ).all()
    if len(query_datos) != 0 and len(query_datos) < 2:
        return {
            'usuario': { 
                'id': query_datos[0].partner_id,
                'name': query_datos[0].nombre,
                'odoo_field':query_datos[0].campo_odoo
            }
        }

    return '', 400

# ----------------------------------------------------------------------Productos--------------------------------------------------------------------------------------------

@app.route('/api/producto_listado', methods=['POST'])
def producto_listado():
    datos= json.loads(request.data)
    lista = list()
    for i in producto(datos.get('odoo_field')):
        lista.append({'title': i.get('name'), 'id': i.get('id')})
    return jsonify({'resultado': lista})


@app.route('/api/tarifa_listado', methods=['POST'])
def tarifa_listado():
    datos = json.loads(request.data)
    lista = list()
    for i in consulta_tarifa(datos['user_id']):
        lista.append({'title': i.get('name'), 'id': i.get('id')})
    return jsonify({'resultado': lista})


@app.route('/api/producto_precio', methods=['POST'])
def producto_precio():
    if request.method == 'POST':
        datos = json.loads(request.data)
        query = consulta_precio(
            int(datos.get('product_id')),
            int(datos.get('tarifa_id'))
        )
        return jsonify(query[0])


# ----------------------------------------------------------------------PEDIDOS LINEAS - PEDIDOS CABECERA-----------------------------------------------------------------------------------
@app.route('/api/pedidos_historial', methods=['POST', 'GET'])
def pedidos_historial():
    lista = list()
    datos= json.loads(request.data)
    queries = PedidosCabecera.query.filter_by(id_usuario= datos['id_usuario']).all()
    if len(queries) > 0:
        print(historial(7949))
        for index in queries:
            consulta_odoo= historial(index.id)
            lista.append({
                'id': index.id,
                'name': index.nombre, 
                'state': consulta_odoo[0].get('state'),
                'currency_id': consulta_odoo[0]['currency_id'][1],
                'amount_total': index.precio_total
            })
        return jsonify(lista)
    return '', 405

@app.route('/api/pedidos_create', methods=['POST', 'GET'])
def pedidos_create():
    if request.method == 'POST':
        datos = json.loads(request.data)
        # guardar datos al odoo
        id_cabecera = create_cabecera(
            datos['usuario'][0].get('id_usuario').get('usuario').get('id'),
            datos['tarifa']
        )

        for i in datos['formulario']:
            create_linea(
                int(id_cabecera),
                int(i.get('id_producto')['id']),
                int(i.get('cantidad')),
                float(i.get('total_price')),
                float(i.get('price'))
            )

        # guardar datos a la base de datos de flask
        for index in consulta_cabecera(id_cabecera):
            model_cabecera = PedidosCabecera(
                id=id_cabecera,
                nombre=index.get('name'),
                id_usuario=index.get('partner_id')[0],
                tarifa=index.get('pricelist_id')[0],
                precio_total= index.get('amount_total')
            )
            db.session.add(model_cabecera)
            db.session.commit()

        for index in consulta_linea(id_cabecera):
            model_lineas = PedidosLineas(
                cabecera_id=index.get('order_id')[0],
                cantidad=index.get('product_uom_qty'),
                id_producto=index.get('product_id')[0]
            )
            db.session.add(model_lineas)
            db.session.commit()
        return ''

    return '', 502





if __name__ == '__main__':
    db.init_app(app)
    manager.run()
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=8000, host='0.0.0.0')
