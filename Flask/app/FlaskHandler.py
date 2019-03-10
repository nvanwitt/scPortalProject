from bokeh.application.handlers import Handler
from app.models import UserData


class FlaskHandler(Handler):
    def __init__(self, func, **kwargs):
        '''
        Args:
            func (callable) : a function to modify and return a Bokeh Document.
                The function should have the form:
                .. code-block:: python
                    def func(doc):
                        # modify doc
                        return doc
                and it  should return the passed-in document after making any
                modifications in-place.
        '''
        super().__init__()

        # _check_callback(func, ('doc',))

        self._func = func
        self._safe_to_fork = True
        if 'app' in kwargs.keys():
            self._app = kwargs['app']

    # Properties --------------------------------------------------------------

    @property
    def safe_to_fork(self):
        ''' Whether it is still safe for the Bokeh server to fork new workers.
        ``False`` if ``modify_doc`` has already been called.
        '''
        return self._safe_to_fork

    # Public methods ----------------------------------------------------------

    def modify_document(self, doc):
        ''' Execute the configured ``func`` to modify the document.
        After this method is first executed, ``safe_to_fork`` will return
        ``False``.
        '''
        self._func(doc)
        self._safe_to_fork = False

    def on_session_created(self, session_context):
        ''' Execute code when a new session is created.
        Subclasses may implement this method to provide for any per-session
        initialization that is necessary before ``modify_doc`` is called for
        the session.
        Args:
            session_context (SessionContext) :
        '''
        with self._app.app_context():
            db_path = UserData.query.filter(UserData.dataName == 'G.h5ad').first().dataPath
            print(db_path)
            setattr(session_context, 'db_path', db_path)
