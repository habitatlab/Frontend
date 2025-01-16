import { FETCH_ANNOTATIONS, FETCH_ANNOTATIONS_SUCCESS, FETCH_ANNOTATIONS_FAILURE, SUBMIT_QUERY, SUBMIT_QUERY_SUCCESS, SUBMIT_QUERY_FAIL, GET_EXPERIMENTS, GET_EXPERIMENTS_SUCCESS, GET_EXPERIMENTS_FAIL } from "./actionTypes"

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

