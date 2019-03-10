import os
from flask import Flask
from app.Config import Config
from app.api import apiBP
from app.models import db
import logging
from logging.handlers import SMTPHandler, RotatingFileHandler
from bokeh.server.server import BaseServer
from bokeh.server.tornado import BokehTornado
from bokeh.server.util import bind_sockets
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from threading import Thread
from app import bokeh_TSNE as bk
import asyncio


from flask_migrate import Migrate
# from flask_login import LoginManager

app = Flask(__name__)
# Configure app based on supplied settings in Config.py
app.config.from_object(Config)
# Initialize database with app
with app.app_context():
    db.init_app(app)
    app.config['sockets'], app.config['port'] = bind_sockets("localhost", 0)
    app.register_blueprint(apiBP, url_prefix='/api')
# Set up database migration to allow updating of database tables to match models.py
migrate = Migrate(app, db)


def bk_worker():
    # Can't pass num_procs > 1 in this configuration. If you need to run multiple
    # processes, see e.g. flask_gunicorn_embed.py
    # server = Server({'/bkapp': bk.start_doc()}, io_loop=IOLoop(), allow_websocket_origin=['127.0.0.1:5000', '127.0.0.1:3000', '127.0.0.1:8000', 'localhost:3000', 'localhost:5000', 'localhost:8000'], relative_urls=True)
    # server.start()
    # server.io_loop.start()
    print('Starting worker...')

    print(app)
    asyncio.set_event_loop(asyncio.new_event_loop())

    bokeh_tornado = BokehTornado({'/bkapp': bk.start_doc(app)}, extra_websocket_origins=['127.0.0.1:5000', '127.0.0.1:3000', '127.0.0.1:8000', 'localhost:3000', 'localhost:5000', 'localhost:8000'], relative_urls=True, appcontext=app)
    bokeh_http = HTTPServer(bokeh_tornado)
    bokeh_http.add_sockets(app.config['sockets'])

    server = BaseServer(IOLoop.current(), bokeh_tornado, bokeh_http)
    server.start()
    server.io_loop.start()


Thread(target=bk_worker).start()
# Specify the view function that will handle logins
# Required logins will be specified by @login_required in routes.py
# login = LoginManager(app)
# login.login_view = 'login'

if not app.debug:
    if app.config['MAIL_SERVER']:
        auth = None
        if app.config['MAIL_USERNAME'] or app.config['MAIL_PASSWORD']:
            auth = (app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
        secure = None
        if app.config['MAIL_USE_TLS']:
            secure = ()
        mail_handler = SMTPHandler(
            mailhost=(app.config['MAIL_SERVER'], app.config['MAIL_PORT']),
            fromaddr='no-reply@' + app.config['MAIL_SERVER'],
            toaddrs=app.config['ADMINS'], subject='Portal Failure',
            credentials=auth, secure=secure)
        mail_handler.setLevel(logging.ERROR)
        app.logger.addHandler(mail_handler)
    if not os.path.exists('logs'):
        os.mkdir('logs')

    file_handler = RotatingFileHandler('logs/portal.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)

    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
    app.logger.info('Portal startup')

from app import routes