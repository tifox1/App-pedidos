from flask import Flask, json, jsonify
from flask.helpers import url_for
from flask_sqlalchemy import model
from sqlalchemy.orm import query
from werkzeug.utils import redirect
from config import DevelopmentConfig
from flask_cors import CORS
from flask import request
from flask_script import Manager, Server
from flask_migrate import Migrate, MigrateCommand
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, current_user, login_user, logout_user

from xmlrpc import client
from models import db
from models import Usuario, PedidosCabecera, PedidosLineas, User

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
# app.config.from_pyfile('config.cfg')
app.secret_key = 'esta_clave_es_secreta'
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
migrate = Migrate(app, db)
manager = Manager(app)
admin = Admin(app)

manager.add_command('db', MigrateCommand)

login = LoginManager(app)


@login.user_loader
def load_user(user_id):
    return User.query.get(user_id)


# Credenciales servidor
#   TODO: poner las variables en un archivo de configuración aparte (archivo .ini)
srv = '192.168.100.47'  # '192.168.0.29' Ruta del servidor
port = '8788'  # Puerto servidor
db_odoo = 'polos2007'  # Nombre base de datos odoo
user = 'admin'
password = 'serverpolosadmin'

# XMLRPC
common = client.ServerProxy('http://%s:%s/xmlrpc/2/common' % (srv, port))
common.version()
uid = common.authenticate(db_odoo, user, password, {})
prox = client.ServerProxy('http://%s:%s/xmlrpc/2/object' % (srv, port))

login = LoginManager(app)


@login.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# ----------------------------------------------------------------------CONSULTAS ODOO----------------------------------------------------------------------------------------------------

def consulta_cabecera(id):
    resultado = prox.execute_kw(
        db_odoo, uid, password,
        'sale.order',
        'search_read',  # Buscar y leer
        [[['id', '=', id]]],  # Condición
        {
            'fields': ['name', 'pricelist_id', 'partner_id', 'id'],
            'order': 'name',
            'limit': 5
        }  # Campos que va a traer
    )
    return resultado


def consulta_linea(id):
    resultado = prox.execute_kw(
        db_odoo, uid, password,
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


def create_linea(id, id_producto, cantidad):
    ''' 
    revisar impuestos
    '''
    id = prox.execute_kw(
        db_odoo,
        uid,
        password,
        'sale.order.line',
        'create', [{
            'name': 'dfasdfasd',
            'order_id': id,
            'product_id': id_producto,
            'product_uom_qty': cantidad,
            'price_unit': 1,
            'tax_id':  [(6, 0, [2])],
            # 'customer_lead': 223,
            'product_uom': 1
        }]
    )


def create_cabecera(id_cliente, id_tarifa):
    id = prox.execute_kw(
        db_odoo,
        uid,
        password,
        'sale.order',
        'create', [{
            'partner_id': int(id_cliente),
            'pricelist_id': int(id_tarifa)
        }]
    )
    return id

# contenido_odoo = prox.execute_kw(
#     db_odoo, uid, password,
#     'product.template',
#     'search_read',  # Buscar y leer
#     [[]],  # Condición
#     {
#         'fields': ['name', 'id'],
#         'order': 'name',
#         'limit': 5
#     }  # Campos que va a traer
# )
def producto(campo):
    contenido_odoo = prox.execute_kw(
        db_odoo, uid, password,
        'product.template',
        'search_read',  # Buscar y leer
        [[[campo, '=', True ]]],  # Condición
        {
            'fields': ['name', 'id'],
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
    print(datos.get('odoo_field'))
    for i in producto(datos.get('odoo_field')):
        lista.append({'title': i.get('name'), 'id': i.get('id')})
        # print(lista)
    return jsonify({'resultado': lista})


# ----------------------------------------------------------------------PEDIDOS LINEAS - PEDIDOS CABECERA-----------------------------------------------------------------------------------

@app.route('/api/pedidos_create', methods=['POST', 'GET'])
def pedidos_create():
    if request.method == 'POST':
        datos = json.loads(request.data)
        print(datos)
        # guardar datos al odoo
        id_cabecera = create_cabecera(
            datos['usuario'][0].get('id_usuario').get('usuario').get('id'),
            datos['tarifa']
        )
        # print(datos['formulario'][0])

        for i in datos['formulario']:
            create_linea(
                id_cabecera,
                i.get('id_producto'),
                i.get('cantidad')

            )

        # guardar datos a la base de datos de flask
        print(id_cabecera)
        for index in consulta_cabecera(id_cabecera):
            model_cabecera = PedidosCabecera(
                id=id_cabecera,
                nombre=index.get('name'),
                id_usuario=index.get('partner_id')[0],
                tarifa=index.get('pricelist_id')[0],
            )
            db.session.add(model_cabecera)
            db.session.commit()

        # print(consulta_linea(id_cabecera))
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

# ----------------------------------------------------------------------ADMIN----------------------------------------------------------------------------------------------------


class MyModelView(ModelView):

    def is_accessible(self):
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'))


class MyAdminView(AdminIndexView):
    def is_accessible(self):
        return current_user.is_authenticated


@app.route('/login')
def login_admin():

    user = User.query.get(1)
    login_user(user)
    return 'Logged in'


@app.route('/logout')
def logout():
    logout_user()
    return 'Logged out'


@app.route('/admin_user/<usuario>/<contrasenia>')
def admin_user(usuario, contrasenia):
    query = User(
        name=usuario,
        password=contrasenia
    )
    db.session.add(query)
    db.session.commit()
    return 'Usuario creado'


admin.add_view(MyModelView(Usuario, db.session))
admin.add_view(MyModelView(PedidosCabecera, db.session))
admin.add_view(MyModelView(PedidosLineas, db.session))
if __name__ == '__main__':
    db.init_app(app)
    manager.run()
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=8000, host='0.0.0.0')
