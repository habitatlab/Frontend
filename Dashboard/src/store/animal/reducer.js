import { GET_ANIMAL_SUCCESS, GET_ANIMAL_FAIL, ADD_ANIMAL_SUCCESS, ADD_ANIMAL_FAIL, UPDATE_ANIMAL_SUCCESS, UPDATE_ANIMAL_FAIL, DELETE_ANIMAL_SUCCESS, DELETE_ANIMAL_FAIL } from "./actionTypes"

const INIT_STATE = {
  animals: [],
  error: {},
}

const animals = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ANIMAL_SUCCESS:
      console.log(action.payload)
      return {
	...state,
        animals: action.payload,
      }

    case GET_ANIMAL_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    case ADD_ANIMAL_SUCCESS:
      
      return {
	...state,
	animals: state.animals.concat(action.payload),
      }
    case ADD_ANIMAL_FAIL:
      return {
	...state,
	error: action.payload,
     }
    case UPDATE_ANIMAL_SUCCESS:
      return {
	...state,
      }
    case UPDATE_ANIMAL_FAIL:
      return {
        ...state,
        error: action.payload,
     }
    case DELETE_ANIMAL_SUCCESS:
      console.log(action.payload)
      return {
        ...state,
	animals: state.animals.filter(checkanimal => 
		checkanimal.name!=action.payload
	)
      }
    case DELETE_ANIMAL_FAIL:
      console.log(action.payload)
      return {
	...state,
        error: action.payload,
     }

    default:
      return state
  }
}

export default animals
