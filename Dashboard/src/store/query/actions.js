import { SUBMIT_QUERY, SUBMIT_QUERY_SUCCESS, SUBMIT_QUERY_FAIL } from "./actionTypes"

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
