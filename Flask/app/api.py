try:
    import asyncio
except ImportError:
    raise RuntimeError("This example requries Python3 / asyncio")

import os
import json
from flask import url_for, request, redirect, Response, Blueprint, current_app
try:
    import matplotlib as mpl
    mpl.use('TkAgg')
except ImportError:
    raise RuntimeError("Matplotlib must be set to use TkAgg for proper functionality")
import scanpy.api as sc
from bokeh.embed import server_document
from app import scData2
import tempfile
from app.models import db, UserData, UserSettings, UserLists
from google.oauth2 import id_token
from google.auth.transport import requests


apiBP = Blueprint('api', __name__, template_folder='templates')


@apiBP.route('/validate', methods=['POST'])
def api_validateLogin():
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        current_app.logger.info('Validating idToken..')
        token = json.loads(request.data)['idToken']
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), "396412765555-9h6iue2qkl0kje9fv3crgvldg2rebmru.apps.googleusercontent.com")
        print(idinfo)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        print(userid)
        accountInfo = {}
        accountInfo['name'] = idinfo['name']
        accountInfo['picture'] = idinfo['picture']
        accountPkt = json.dumps(accountInfo)
        print(accountPkt)
        return Response(response=accountPkt, status=203, mimetype='application/json')
    except ValueError:
        # Invalid token
        return Response(status=400)


# Single-Cell Portal API endpoint for Gene List
@apiBP.route('/data', methods=['GET', 'POST'])
def api_data():
    if request.method == 'GET':
        return redirect(url_for('index'))

    if request.method == 'POST':
        current_app.logger.info('Searching gene list..')
        dataset = json.loads(request.data)['dataset']
        if dataset != 'None':
            current_app.logger.info('Reading data from db...')
            db_path = UserData.query.filter(UserData.dataName == dataset).first().dataPath
            adata = sc.read_h5ad(db_path)
            gene_listdb = adata.var['gene_ids']
        else:
            current_app.logger.info('Reading data from app...')
            adata = sc.read_h5ad(os.path.join(os.getcwd(),'app/ProcessedData.h5ad'))
            gene_listdb = adata.var['gene_ids']
        searchKey = json.loads(request.data)['searchKey']
        gene_listdb = gene_listdb.filter(regex=searchKey, axis=0).index.get_values().tolist()
        newgenes = json.dumps(gene_listdb)

        return Response(response=newgenes, status=203, mimetype='application/json')


# Bokeh Plot Endpoint
@apiBP.route('/bokeh', methods=['GET', 'POST'])
def load_bokeh():

    if request.method == 'GET':
        print('GET REQUEST')
        return redirect(url_for('home'))

    if request.method == 'POST':

        current_app.logger.info('Generating gene list..')
        geneDict = {}
        message = request.json
        print(message)
        [geneDict.setdefault('Gene' + str(x), message['plotGene'][x]) for x in range(len(message['plotGene']))]
        geneDict['dataset'] = message['dataset']
        print('Gene Dict:')
        print(geneDict)
        if message['plotKey'] == 'Tier1':

            print('Thread Started')
            bokehPlot = {}
            print('Serving Document...')
            current_app.logger.info('Serving Document...')
            script = server_document('http://localhost:%d/bkapp' % current_app.config['port'], arguments=geneDict).split('"')
            bokehPlot['plotsrc'] = script[1]
            bokehPlot['plotid'] = script[3]
            bokehPlot = json.dumps(bokehPlot)
            return Response(response=bokehPlot, status=203, mimetype='application/json')


def processData(path, req, dname):
    with tempfile.TemporaryDirectory() as tmpdirname:

                print('Created temporary directory:', tmpdirname)
                current_app.logger.info('Created temporary directory...')

                request.files["matrix.mtx"].save(os.path.join(tmpdirname, "matrix.mtx"))
                matrixP = os.path.join(tmpdirname, "matrix.mtx")

                request.files["genes.tsv"].save(os.path.join(tmpdirname, "genes.tsv"))
                geneP = os.path.join(tmpdirname, "genes.tsv")

                request.files["barcodes.tsv"].save(os.path.join(tmpdirname, "barcodes.tsv"))
                barcodeP = os.path.join(tmpdirname, "barcodes.tsv")

                print('Processing Data...')
                current_app.logger.info('Processing Data...')
                adata = scData2.getAnnData(matrixP, geneP, barcodeP)

                print('Writing...')

                dataPath = os.path.join(path, dname)
                current_app.logger.info('Writing to path: ' + dataPath)
                adata.write(filename=dataPath)

                return os.path.join(path, dname)


# Upload Files, get user-given file name securely with secure_filename
@apiBP.route('/upload', methods=['GET', 'POST'])
def upload_file():

    if request.method == 'POST':
        dname = request.form['dataset'] + '.h5ad'
        current_app.logger.info('Uploading dataset: ' + dname)
        print(request.form)
        print(request.files)
        if "matrix.mtx" in request.files:
            dataStore = '/datastore'
            if os.path.exists(dataStore):
                current_app.logger.info('Processing data...')
                datapath = processData(dataStore, request, dname)
                userData = UserData(dataName=dname, dataPath=datapath)
                db.session.add(userData)
                print('Committing to database...')
                current_app.logger.info('Committing to database..')
                db.session.commit()
                print('Committed')
                current_app.logger.info('Committed.')
            else:
                current_app.logger.info('Creating datastore...')
                os.mkdir(dataStore)
                current_app.logger.info('Processing data...')
                datapath = processData(dataStore, request, dname)
                userData = UserData(dataName=dname, dataPath=datapath)
                db.session.add(userData)
                print('Committing to database...')
                current_app.logger.info('Committing to database..')
                db.session.commit()
                print('Committed')
                current_app.logger.info('Committed.')

        return Response(status=203)
