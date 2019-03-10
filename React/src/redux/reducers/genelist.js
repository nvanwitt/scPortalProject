import { ADD_GENE, REMOVE_GENE } from '../actionTypes';

const initialState = {
  selectedGenes: []
};

export default function(state = initialState, action) {
	switch (action.type) {
    case ADD_GENE: {
      return {
        ...state,
        selectedGenes: state.selectedGenes.concat(action.payload.gene)
       };
     }
    case REMOVE_GENE: {
      return {
        messages: [
        	...state.selectedGenes.slice(0, action.payload.index),
			...state.selectedGenes.slice(
			action.payload.index + 1, state.selectedGenes.length
			),
		]
      }
    }

    default:
      return state;
  }
}