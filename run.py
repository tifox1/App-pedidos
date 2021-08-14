from flask import Flask, json, jsonify
from flask_sqlalchemy import model
from config import DevelopmentConfig
from flask_cors import CORS
from flask import request
from flask_script import Manager, Server
from flask_migrate import Migrate, MigrateCommand

from xmlrpc import client
from models import db
from models import Usuario, PedidosCabecera, PedidosLineas

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
# app.config.from_pyfile('config.cfg')
app.secret_key = 'esta_clave_es_secreta'
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)


# Credenciales servidor
#   TODO: poner las variables en un archivo de configuración aparte (archivo .ini)
srv = '192.168.100.47'  # Ruta del servidor
port = '8788'  # Puerto servidor
db_odoo = 'polos2007'  # Nombre base de datos odoo
user = 'admin'
password = 'serverpolosadmin'

# XMLRPC
common = client.ServerProxy('http://%s:%s/xmlrpc/2/common' % (srv, port))
common.version()
uid = common.authenticate(db_odoo, user, password, {})
prox = client.ServerProxy('http://%s:%s/xmlrpc/2/object' % (srv, port))

def consulta_cabecera(id):
    resultado= prox.execute_kw(
        db_odoo, uid, password,
        'sale.order',
        'search_read',  # Buscar y leer
        [[['id_cabecera','=', id]]],  # Condición
        {
            'fields': ['name', 'pricelist_id', 'partner_id', 'user_id', 'datetime'], 
            'order': 'name',
            'limit': 5
        }  # Campos que va a traer
    )
    return resultado

def consulta_linea(id):
    resultado= prox.execute_kw(
        db_odoo, uid, password,
        'sale.order.line',
        'search_read',  # Buscar y leer
        [[['order_id','=', id]]],  # Condición
        {
            'fields': ['product_uom_qty', 'product_id', 'order_id'], 
            'order': 'name',
            'limit': 5
        }  # Campos que va a traer
    )
    return resultado

def create_linea(id_cabecera, id_producto, cantidad, precio_unitario):
    id = prox.execute_kw(db, 
        uid, 
        password, 
        'sale.order.line', 
        'create', [{
            'order_id': id_cabecera,
            'product_id': id_producto,
            'product_uom_qty': cantidad,
            'price_unit': precio_unitario 
        }]
    )

def create_cabecera(id_cliente, id_tarifa):
    id = prox.execute_kw(db, 
        uid, 
        password, 
        'sale.order', 
        'create', [{
            'partner_id': id_cliente,
            'pricelist_id': id_tarifa
        }]
    )
    return id
    


contenido_odoo = prox.execute_kw(
    db_odoo, uid, password,
    'product.template',
    'search_read',  # Buscar y leer
    [[]],  # Condición
    {
        'fields': ['name', 'id'], 
        'order': 'name',
        'limit': 5
    }  # Campos que va a traer
)


@app.route('/api/usuario_create', methods=['GET', 'POST'])
def usuario():
    instancia = Usuario(nombre='Jorge', contrasenia='123')

    db.session.add(instancia)
    db.session.commit()


@app.route('/api/producto_listado', methods=['POST'])
def producto_listado():
    lista = list()
    # print(contenido_odoo)
    for i in contenido_odoo:
        lista.append({'title': i.get('name'), 'id': i.get('id')})
        # print(lista)
    return jsonify({'resultado': lista})

#----------------------------------------------------------------------PEDIDOS CABECERA---------------------------------------------------------------------------------

# @app.route('/api/cabecera_create', methods=['POST'])
# def cabecera_create():
#     if request.method == 'POST':
#         datos = json.loads(request.data)
#         id_cabecera = create_cabecera(
#             datos['usuario_id'],
#             datos['tarifa_id']
#         )
#         return {
#             'id_tarifa': id_cabecera,
#             'cabecera_creada': True
#         }
        

#----------------------------------------------------------------------PEDIDOS LINEAS-----------------------------------------------------------------------------------

@app.route('/api/pedidos_create', methods=['POST', 'GET'])
def pedidos_create():
    if request.method == 'POST':
        datos = json.loads(request.data)
        id_cabecera = create_cabecera(
            datos['usuario'][0].get('id_usuario'),
            datos['tarifa'],
        )
        for i in datos['formulario']:
            create_linea(
                id_cabecera,
                i.get('id_producto'),
                i.get('cantidad'),
                i.get('precio_unitario')
            )
        print(datos)

        for index in consulta_cabecera(id_cabecera):
            for query in index:
                model_cabecera = PedidosCabecera(
                    nombre= query.get('name'),
                    id_usuario= query.get('partner_id'),
                    tarifa= query.get('pricelist_id'),
                    fecha= query.get('datetime')
                ) 

        for index in consulta_linea(id_cabecera):
            for query in index:
                model_lineas = PedidosLineas(
                    cabecera_id= query.get('')
                    cantidad= query.get('product_uom_qty')
                )

        db.session.add(model_lineas, model_cabecera )
        db.session.commit()
        
        pedidos = PedidosLineas.query.filter_by(usuario_id=int(datos['usuario_id']))
        return {
            'resultado':[{
                'id': p.id,
                'cantidad': p.cantidad,
                'producto': p.product,
                'fecha': str(p.fecha)
            } for p in pedidos]
        }, 200

    return ''  


# @app.route('/api/pedidos_delete', methods=['GET', 'DELETE'])
# def pedidos_delete():
#     datos = json.loads(request.data)
#     model = PedidosLineas.query.filter_by(usuario_id=int(
#         datos['usuario_id']), id=int(datos['id_producto'])).first()

#     if model:
#         db.session.delete(model)
#         db.session.commit()

#         pedidos = PedidosLineas.query.filter_by(usuario_id=int(datos['usuario_id']))

#         return {
#             'resultado': [{
#                 'id': p.id,
#                 'cantidad': p.cantidad,
#                 'producto': p.product,
#                 'fecha': str(p.fecha)
#             } for p in pedidos]  # List comprehension
#         }, 200
#     return '', 400


# @app.route('/api/pedidos_list', methods=['POST', 'GET'])
# def pedidos_list():
#     datos = json.loads(request.data)
#     model = PedidosLineas.query.filter_by(usuario_id=datos.get('usuario_id')).all()
#     # print(model)
#     diccionario = {'resultado': []}
#     for i in model:
#         diccionario.get('resultado').append(
#             {'id': i.id, 'cantidad': i.cantidad, 'producto': i.product, 'tarifa': i.tarifa})

#     return diccionario 


if __name__ == '__main__':
    db.init_app(app)
    manager.run()
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=8000, host='0.0.0.0')
