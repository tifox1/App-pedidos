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
port = '443'  # Puerto servidor
db_odoo = '0130'  # Nombre base de datos odoo
user = 'facturacionsegupak'
password = '12345'

# XMLRPC
common = client.ServerProxy('http://%s:%s/xmlrpc/2/common' % (srv, port))
common.version()
uid = common.authenticate(db_odoo, user, password, {})
prox = client.ServerProxy('http://%s:%s/xmlrpc/2/object' % (srv, port))


contenido_odoo = prox.execute_kw(
    db_odoo, uid, password,
    'product.template',
    'search_read',  # Buscar y leer
    [[]],  # Condición
    {'fields': ['name', 'id'], 'order': 'name',
        'limit': 5}  # Campos que va a traer
)


@app.route('/api/usuario_create', methods=['GET', 'POST'])
def usuario():
    instancia = Usuario(nombre='Jorge', contrasenia='123')

    db.session.add(instancia)
    db.session.commit()


@app.route('/api/producto_listado', methods=['POST'])
def producto_listado():
    lista = list()
    print(contenido_odoo)
    for i in contenido_odoo:
        lista.append({'title': i.get('name')})
        # print(lista)
    return jsonify({'resultado': lista})

#----------------------------------------------------------------------PEDIDOS CABECERA---------------------------------------------------------------------------------

@app.route('/api/cabecera_create', methods=['POST'])
def cabecera_create():
    if request.method == 'POST':
        datos = json.loads(request.data)
        model = PedidosCabecera()

#----------------------------------------------------------------------PEDIDOS LINEAS-----------------------------------------------------------------------------------

@app.route('/api/pedidos_create', methods=['POST', 'GET'])
def pedidos_create():
    if request.method == 'POST':
        datos = json.loads(request.data)
        print(datos)
        model = PedidosLineas(
            cantidad=datos['cantidad'],
            product=datos['producto'],
            tarifa=datos['tarifa'],
            usuario_id=datos['usuario_id'],
        )
        db.session.add(model)
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
