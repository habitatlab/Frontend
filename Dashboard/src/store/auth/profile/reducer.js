import { PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE,
         GET_PROFILE, GET_PROFILE_SUCCESS, GET_PROFILE_ERROR} from "./actionTypes"

const initialState = {
  user: "",
  error: "",
  success: "",
}

const profile = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      state = { ...state }
      break
    case GET_PROFILE_SUCCESS:
      state = { ...state, user: action.payload }
      break
    case GET_PROFILE_ERROR:
      state = { ...state, error: action.payload }
      break
    case EDIT_PROFILE:
      state = { ...state }
      break
    case PROFILE_SUCCESS:
      state = { ...state, success: action.payload }
      break
    case PROFILE_ERROR:
      state = { ...state, error: action.payload }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default profile
