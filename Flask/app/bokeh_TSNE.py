from bokeh.plotting import figure
from bokeh.models import HoverTool, ColumnDataSource
from bokeh.models.widgets import RadioButtonGroup
from bokeh.layouts import column, widgetbox
from bokeh.models.widgets import Panel, Tabs
from bokeh.application import Application
from app.FlaskHandler import FlaskHandler
import matplotlib as mpl
mpl.use('TkAgg')
import scanpy.api as sc


# from app.scData import getAnnData


def createClusterFigure(doc):
    active_gene = None
    print('Starting Document....')

    if doc.session_context.request.arguments is not None:
        args = doc.session_context.request.arguments

    dataPath = doc.session_context.db_path
    if dataPath != 'None':
        dataSet = sc.read_h5ad(dataPath)
    else:
        dataSet = sc.read_h5ad('/app/ProcessedData.h5ad')

    geneList = [(args[x][0].decode())for x in args.keys() if 'Gene' in x]
    if 'None' not in geneList and len(geneList) is not 0:
        print(geneList[0])
        active_gene = geneList[0]

    def makePlot(doc, active_gene, adata):

        cdsDict = {}
        cdsDict['x'] = adata.obsm['X_umap'][:, 0]
        cdsDict['y'] = adata.obsm['X_umap'][:, 1]

        single_gene_colors = []
        # Color by Cluster
        color_Dict = dict(zip(adata.obs['louvain'].cat.categories, adata.uns['louvain_colors']))
        colors = [
            color_Dict[cluster] for cluster in adata.obs['louvain'] if cluster in color_Dict.keys()
        ]
        cdsDict['color'] = colors

        # Color by n_genes
        gene_colors = []
        for x, y, z, _ in 255 * mpl.cm.viridis(mpl.colors.Normalize()(adata.obs['n_genes'].tolist())):
            gene_colors.append("#%02x%02x%02x" % (int(x), int(y), int(z)))

        cdsDict['gene_colors'] = gene_colors

        if active_gene is not None:
            # Sort matrix by gene columnthen normalize the count values
            geneExpression = adata.X[:, adata.var.index == active_gene].flatten()
            single_gene_colors = []
            for x, y, z, _ in 255 * mpl.cm.viridis(mpl.colors.Normalize()(geneExpression)):
                single_gene_colors.append("#%02x%02x%02x" % (int(x), int(y), int(z)))
            if len(single_gene_colors) == 2638:
                cdsDict['single_gene'] = single_gene_colors

        source = ColumnDataSource(cdsDict)
        # source = ColumnDataSource(dict( x=adata.obsm['X_umap'][:, 0], y=adata.obsm['X_umap'][:, 1], color=colors, gene_colors=gene_colors, single_gene=single_gene_colors))
        title = 'T-SNE visualization of sequences'

        geneTitle = 'n_genes'

        plotDict = {}

        plot_lda = figure(plot_width=800, plot_height=600, title=title, tools="pan,wheel_zoom,box_zoom,reset,hover,previewsave", x_axis_type=None, y_axis_type=None, min_border=1)

        plot_lda.scatter(x='x', y='y', legend='label', source=source, color='color',
                         alpha=0.8, size=5)

        plotDict['tsne'] = plot_lda

        genePlot = figure(plot_width=800, plot_height=600, title=geneTitle, tools="pan,wheel_zoom,box_zoom,reset,hover,previewsave", x_axis_type=None, y_axis_type=None, min_border=1)
        genePlot.scatter(x='x', y='y', legend='label', source=source, color='gene_colors',
                         alpha=0.8, size=5)

        plotDict['nGene'] = genePlot

        if 'single_gene' in cdsDict.keys():
            singleGene = figure(plot_width=800, plot_height=600, title=active_gene, tools="pan,wheel_zoom,box_zoom,reset,hover,previewsave", x_axis_type=None, y_axis_type=None, min_border=1)
            singleGene.scatter(x='x', y='y', legend='label', source=source, color='single_gene', alpha=0.8, size=5)

            plotDict['sGene'] = singleGene

        return plotDict

    def update(new):
        active_gene = geneList[new]
        sgCol.children[0] = makePlot(doc, active_gene, dataSet)['sGene']

    plotDict = makePlot(doc, active_gene, dataSet)

    # hover tools
    hover = plotDict['tsne'].select(dict(type=HoverTool))
    hover.tooltips = {"content": "Sequence: @seq, CCS: @ccs, Charge: @charge "}
    plotDict['tsne'].legend.location = "top_left"

    button_group = RadioButtonGroup(labels=geneList)
    button_group.on_click(update)

    tabList = []

    if 'sGene' in plotDict.keys():
        controls = widgetbox([button_group], width=800)
        sgCol = column(plotDict['sGene'], controls)
        sgTab = Panel(child=sgCol, title="Single Gene")
        tabList.append(sgTab)

    tsneTab = Panel(child=plotDict['tsne'], title="Louvain")
    tabList.append(tsneTab)

    nGeneTab = Panel(child=plotDict['nGene'], title="nGene")
    tabList.append(nGeneTab)

    tabs = Tabs(tabs=tabList)

    doc.add_root(tabs)

    return doc


def start_doc(app):
    print('Running doc...')
    return Application(FlaskHandler(createClusterFigure, app=app))
