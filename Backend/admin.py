from flask import (
    Blueprint,
    url_for,
    redirect,
    render_template,
    current_app,
    flash
)
from flask_admin import Admin, AdminIndexView, BaseView, expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.menu import MenuLink
from flask_login import current_user, login_user, logout_user
from flask_wtf import FlaskForm
from sqlalchemy.exc import IntegrityError
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired
from werkzeug.security import check_password_hash, generate_password_hash
from models import Usuario


from models import User, db

admin_page = Blueprint('admin_page', __name__, url_prefix='/admin')

class LoginForm(FlaskForm):
    user = StringField('user', validators=[InputRequired()])
    password = PasswordField('password', validators=[InputRequired()])
    remember = BooleanField('Remember me')

class CreateUserForm(FlaskForm):
    name = StringField('Name', validators=[InputRequired()])
    password = PasswordField('password', validators=[InputRequired()])

@admin_page.route('/login', methods=['POST', 'GET'])
def login():
    error = False
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(name=form.user.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect('/admin')
        error = 'usuario o contraseña incorrectos'

    return render_template(
        'login.html',
        form=form,
        swatch=current_app.config['FLASK_ADMIN_SWATCH'],
        error=error
    )

@admin_page.route('/logout', methods=['POST', 'GET'])
def logout():
    logout_user()
    return redirect(url_for('admin_page.login'))

class CustomAdminIndex(AdminIndexView):
    def is_accessible(self):
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_page.login'))

class LoginModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_page.login'))

class UserModelView(LoginModelView):
    @expose('/new/', methods=('GET', 'POST'))
    def create_user(self):
        form = CreateUserForm()

        if form.validate_on_submit():
            try:
                user = User(form.name.data, form.password.data)
                db.session.add(user)
                db.session.commit()
                flash(f"Usuario '{user.name}' creado", 'success')
            except IntegrityError:
                db.session.rollback()
                flash('Usuario duplicado', 'error')

        return self.render('admin/create_user.html', form=form)


admin = Admin(template_mode='bootstrap3', index_view=CustomAdminIndex())
admin.add_view(UserModelView(User, db.session))
admin.add_view(ModelView(Usuario, db.session))
admin.add_link(MenuLink(name='Logout', category='', url="/admin/logout"))
