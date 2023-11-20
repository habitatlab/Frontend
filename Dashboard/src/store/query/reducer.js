import { SUBMIT_QUERY, SUBMIT_QUERY_SUCCESS, SUBMIT_QUERY_FAIL } from "./actionTypes"

const INIT_STATE = {
  results: [],
  error: {},
}

const dataquery = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SUBMIT_QUERY_SUCCESS:
      console.log(action.payload)
      return {
	...state,
        results: action.payload,
      }

    case SUBMIT_QUERY_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

export default dataquery 
