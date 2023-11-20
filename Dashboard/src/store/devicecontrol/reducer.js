import { FETCH_DIAGNOSTICS, FETCH_DIAGNOSTICS_SUCCESS, FETCH_DIAGNOSTICS_FAIL } from "./actionTypes"

const INIT_STATE = {
  diagnostic_results: "",
  error: {},
}

const devicecontrol = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_DIAGNOSTICS_SUCCESS:
      console.log(action.payload)
      return {
	       ...state,
        diagnostic_results: action.payload,
      }

    case FETCH_DIAGNOSTICS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

export default devicecontrol 
