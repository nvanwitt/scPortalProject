import numpy as np
import scanpy.api as sc
import pandas as pd
import anndata


def getAnnData(matrix, genelist, barcodes):
    sc.settings.verbosity = 0  # verbosity: errors (0), warnings (1), info (2), hints (3)
    sc.settings.autoshow = False
    print('Reading matrix...')
    adata = sc.read(matrix, cache=False).T
    print(adata)
    print('Reading gene list...')
    genes = pd.read_csv(genelist, header=None, sep='\t')
    geneNames = anndata.utils.make_index_unique(pd.Index(genes[1]))
    adata.var_names = geneNames
    adata.var['gene_ids'] = genes[0].values
    adata.obs_names = pd.read_csv(barcodes, header=None)[0]

    adata.var_names_make_unique()

    sc.pp.filter_cells(adata, min_genes=200)
    sc.pp.filter_genes(adata, min_cells=3)

    mito_genes = [name for name in adata.var_names if name.startswith('MT-')]
    # for each cell compute fraction of counts in mito genes vs. all genes
    # the `.A1` is only necessary as X is sparse to transform to a dense array after summing
    adata.obs['percent_mito'] = np.sum(
        adata[:, mito_genes].X, axis=1).A1 / np.sum(adata.X, axis=1).A1
    # add the total counts per cell as observations-annotation to adata
    adata.obs['n_counts'] = adata.X.sum(axis=1).A1

    adata = adata[adata.obs['n_genes'] < 2500, :]
    adata = adata[adata.obs['percent_mito'] < 0.05, :]

    adata.raw = sc.pp.log1p(adata, copy=True)

    sc.pp.normalize_per_cell(adata, counts_per_cell_after=1e4)
    filter_result = sc.pp.filter_genes_dispersion(
        adata.X, min_mean=0.0125, max_mean=3, min_disp=0.5)

    adata = adata[:, filter_result.gene_subset]

    sc.pp.log1p(adata)

    sc.pp.regress_out(adata, ['n_counts', 'percent_mito'])

    sc.pp.scale(adata, max_value=10)

    sc.tl.pca(adata, svd_solver='arpack')

    sc.pp.neighbors(adata, n_neighbors=10, n_pcs=40)
    sc.tl.umap(adata)

    sc.tl.louvain(adata)
    sc.pl.umap(adata, color=['louvain'], show=False)

    sc.tl.rank_genes_groups(adata, 'louvain', method='logreg')

    return adata
