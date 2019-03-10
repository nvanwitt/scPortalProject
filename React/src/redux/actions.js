import { ADD_GENE, REMOVE_GENE, LOGIN_CHECK } from './actionTypes';

export const addGene = gene => ({
  type: ADD_GENE,
  payload: { gene }
});

export const removeGene = index => ({
  type: REMOVE_GENE,
  payload: { index }
});

export const loginCheck = login => ({
  type: LOGIN_CHECK,
  payload: { login }
});