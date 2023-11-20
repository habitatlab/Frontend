import {
  GET_JOURNAL_FAIL,
  GET_JOURNAL_SUCCESS,
  GET_NOTE_FAIL,
  GET_NOTE_SUCCESS,
  DELETE_NOTE_FAIL,
  DELETE_NOTE_SUCCESS,
  POST_NOTE_SUCCESS,
  POST_NOTE_FAIL
} from "./actionTypes"

const INIT_STATE = {
  journal: [],
  noteDetail: {},
  error: {},
}

const journal = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_JOURNAL_SUCCESS:
      return {
        ...state,
        journal: action.payload,
      }

    case GET_JOURNAL_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_NOTE_SUCCESS:
      return {
        ...state,
        note: action.payload,
      }

    case GET_NOTE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case DELETE_NOTE_SUCCESS:
      return {
	...state,
	note: action.payload,
      }

    case DELETE_NOTE_FAIL:
      return {
	...state,
	error: action.payload,
    }

    case POST_NOTE_SUCCESS:
      return {
	...state,
	note: action.payload,
      }

    case POST_NOTE_FAIL:
      return {
	...state,
	error: action.payload,
    }

    default:
      return state
  }
}

export default journal
