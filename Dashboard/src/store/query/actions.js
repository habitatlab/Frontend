import { FETCH_ANNOTATIONS, FETCH_ANNOTATIONS_SUCCESS, FETCH_ANNOTATIONS_FAILURE,
  SUBMIT_QUERY, SUBMIT_QUERY_SUCCESS, SUBMIT_QUERY_FAIL, GET_EXPERIMENTS, GET_EXPERIMENTS_SUCCESS,
  GET_EXPERIMENTS_FAIL, GET_DATASET, GET_DATASET_SUCCESS,
  GET_DATASET_FAIL, GET_ANNOTATION_TIMELINES, GET_ANNOTATION_TIMELINES_SUCCESS,
  GET_ANNOTATION_TIMELINES_FAIL, UPDATE_ANNOTATION_TIMELINE, UPDATE_ANNOTATION_TIMELINE_SUCCESS,
  UPDATE_ANNOTATION_TIMELINE_FAIL, ADD_ANNOTATION_TIMELINE, ADD_ANNOTATION_TIMELINE_SUCCESS,
  ADD_ANNOTATION_TIMELINE_FAIL, DELETE_ANNOTATION_TIMELINE, DELETE_ANNOTATION_TIMELINE_SUCCESS,
  DELETE_ANNOTATION_TIMELINE_FAIL} from "./actionTypes"

export const submitQuery = query => ({
  type: SUBMIT_QUERY,
  payload: query,
 })

export const submitQuerySuccess = query => ({
  type: SUBMIT_QUERY_SUCCESS,
  payload: query,
})

export const submitQueryFail = error => ({
  type: SUBMIT_QUERY_FAIL,
  payload: error,
})

export const fetchAnnotations = (startTime, endTime) => ({
  type: 'FETCH_ANNOTATIONS',
  payload: { startTime, endTime },
});

export const fetchAnnotationsSuccess = (annotations) => ({
  type: 'FETCH_ANNOTATIONS_SUCCESS',
  payload: annotations,
});

export const fetchAnnotationsError = (error) => ({
  type: 'FETCH_ANNOTATIONS_ERROR',
  payload: error,
});

export const getExperiments = () => ({
  type: GET_EXPERIMENTS,
})

export const getExperimentsSuccess = experiments => ({
  type: GET_EXPERIMENTS_SUCCESS,
  payload: experiments,
})

export const getExperimentsFail = error => ({
  type: GET_EXPERIMENTS_FAIL,
  payload: error,
})


export const getDataset = (query) => ({
  type: GET_DATASET,
  payload: query
})

export const getDatasetSuccess = datasetVideos => ({
  type: GET_DATASET_SUCCESS,
  payload: datasetVideos,
})

export const getDatasetFail = error => ({
  type: GET_DATASET_FAIL,
  payload: error,
})

export const getAnnotationTimeline = (query) => ({
  type: GET_ANNOTATION_TIMELINES,
  payload: query
})

export const getAnnotationTimelineSuccess = timelines => ({
  type: GET_ANNOTATION_TIMELINES_SUCCESS,
  payload: timelines,
})

export const getAnnotationTimelineFail = error => ({
  type: GET_ANNOTATION_TIMELINES_FAIL,
  payload: error,
})

export const updateAnnotationTimeline = (timeline) => ({
  type: UPDATE_ANNOTATION_TIMELINE,
  payload: timeline
})

export const updateAnnotationTimelineSuccess = timeline => ({
  type: UPDATE_ANNOTATION_TIMELINE_SUCCESS,
  payload: timeline,
})

export const updateAnnotationTimelineFail = error => ({
  type: UPDATE_ANNOTATION_TIMELINE_FAIL,
  payload: error,
})

export const addAnnotationTimeline = (timeline) => ({
  type: ADD_ANNOTATION_TIMELINE,
  payload: timeline
})

export const addAnnotationTimelineSuccess = timeline => ({
  type: ADD_ANNOTATION_TIMELINE_SUCCESS,
  payload: timeline,
})

export const addAnnotationTimelineFail = error => ({
  type: ADD_ANNOTATION_TIMELINE_FAIL,
  payload: error,
})

export const deleteAnnotationTimeline = (timeline) => ({
  type: DELETE_ANNOTATION_TIMELINE,
  payload: timeline
})

export const deleteAnnotationTimelineSuccess = timeline => ({
  type: DELETE_ANNOTATION_TIMELINE_SUCCESS,
  payload: timeline,
})

export const deleteAnnotationTimelineFail = error => ({
  type: DELETE_ANNOTATION_TIMELINE_FAIL,
  payload: error,
})
