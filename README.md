# scPortalProject
Custom Single Cell Portal for GUI representation of single cell datasets
This project is currently limited to TSNE visualization of single-cell datasets (Cluster labeling, nGenes, Marker Genes).

Instructions:

Until a combined pipeline is set up, the Flask and React components needed to be started separately, as follows:

Flask: 
As this project is also in development, the Flask component ships with a Python Venv and associated packages. 
To begin, go to the Flask subdirectory and type:

```
source bin/activate
```

Exiting this venv is possible by typing ```deactivate```

For multithreading to work properly with internal Bokeh server, the flask backend needs to be run with gunicorn.
In the Flask directory type:

```
gunicorn -w 4 -t 60  scPortal:app
```

React:
You must first install the necessary dependecies before starting the application.
In the React directory type: 

```
npm install
```

Once installation is complete (and for every subseqent usage) type:

```
npm start
```

