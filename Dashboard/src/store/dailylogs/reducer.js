import { GET_LOGS_SUCCESS, GET_LOGS_FAIL, ADD_LOGS_SUCCESS, ADD_LOGS_FAIL, UPDATE_LOG_SUCCESS, UPDATE_LOG_FAIL, DELETE_LOG_SUCCESS, DELETE_LOG_FAIL } from "./actionTypes"

const INIT_STATE = {
  dailyLogs: [],
  lanimals: [],
  error: {},
}

const logs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LOGS_SUCCESS:
      return {
	...state,
        dailyLogs: action.payload,
      }

    case GET_LOGS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    case ADD_LOGS_SUCCESS:
      console.log(action.payload) 
      return {
	...state,
	dailyLogs: state.dailyLogs.concat(action.payload),
      }
    case ADD_LOGS_FAIL:
      return {
	...state,
	error: action.payload,
     }
    case UPDATE_LOG_SUCCESS:
        const newLogs = [...state.dailyLogs]; //making a new array
        var index = -1
        for (var i=0; i<newLogs.length; i++) {
	    if (newLogs[i]._id == action.payload._id) {
	        index = i;
		break;
	    }
        }
		   
        newLogs[index] = action.payload
        return { 
	    ...state, 
	    dailyLogs: newLogs, 
        }
    case UPDATE_LOG_FAIL:
      return {
        ...state,
        error: action.payload,
     }
    case DELETE_LOG_SUCCESS:
      return {
        ...state,
	dailyLogs: state.dailyLogs.filter(checklog => 
		checklog._id!=action.payload
	)
      }
    case DELETE_LOG_FAIL:
      return {
	...state,
        error: action.payload,
     }

    default:
      return state
  }
}

export default logs
