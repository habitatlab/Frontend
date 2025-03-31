import { SUBMIT_QUERY, SUBMIT_QUERY_SUCCESS, SUBMIT_QUERY_FAIL,
  GET_EXPERIMENTS_SUCCESS, GET_EXPERIMENTS_FAIL,
  GET_DATASET_SUCCESS, GET_DATASET_FAIL,
  GET_ANNOTATION_TIMELINES_SUCCESS, GET_ANNOTATION_TIMELINES_FAIL,
  ADD_ANNOTATION_TIMELINE_SUCCESS, ADD_ANNOTATION_TIMELINE_FAIL,
  UPDATE_ANNOTATION_TIMELINE_SUCCESS, UPDATE_ANNOTATION_TIMELINE_FAIL,
  DELETE_ANNOTATION_TIMELINE_SUCCESS, DELETE_ANNOTATION_TIMELINE_FAIL} from "./actionTypes"

const INIT_STATE = {
  results: [],
  experiments: [],
  datasetVideos: [],
  timelines: [],
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
     case GET_EXPERIMENTS_SUCCESS:
	console.log(action.payload)
      return {
        ...state,
        experiments: action.payload.experiments,
      }

    case GET_EXPERIMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    case GET_DATASET_SUCCESS:
      console.log(action.payload)
      return {
        ...state,
        datasetVideos: action.payload.videos,
      }

    case GET_DATASET_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    case GET_ANNOTATION_TIMELINES_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        timelines: action.payload?.timelines || action.payload || [],
      };

    case GET_ANNOTATION_TIMELINES_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    case ADD_ANNOTATION_TIMELINE_SUCCESS:
      console.log(action.payload)
      return {
        ...state,
        timelines: [...state.timelines, action.payload],
      }

    case ADD_ANNOTATION_TIMELINE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case UPDATE_ANNOTATION_TIMELINE_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        timelines: state.timelines.map((timeline) =>
            timeline.id === action.payload.id ? action.payload : timeline
        ),
      };

    case UPDATE_ANNOTATION_TIMELINE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case DELETE_ANNOTATION_TIMELINE_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        timelines: state.timelines.filter(
            (timeline) => timeline.id !== action.payload.id
        ),
      };

    case DELETE_ANNOTATION_TIMELINE_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

export default dataquery 
