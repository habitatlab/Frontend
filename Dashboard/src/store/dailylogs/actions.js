import { GET_LOGS, GET_LOGS_FAIL, GET_LOGS_SUCCESS, ADD_LOGS, ADD_LOGS_FAIL, ADD_LOGS_SUCCESS, UPDATE_LOG, UPDATE_LOG_FAIL,UPDATE_LOG_SUCCESS, DELETE_LOG, DELETE_LOG_FAIL, DELETE_LOG_SUCCESS } from "./actionTypes"

export const getLogs = () => ({
  type: GET_LOGS,
})

export const getLogsSuccess = logs => ({
  type: GET_LOGS_SUCCESS,
  payload: logs,
})

export const getLogsFail = error => ({
  type: GET_LOGS_FAIL,
  payload: error,
})

export const addLogs = logs => ({
  type: ADD_LOGS,
  payload: logs,
})

export const addLogsSuccess = logs => ({
  type: ADD_LOGS_SUCCESS,
  payload: logs,
})

export const addLogsFail = error => ({
  type: ADD_LOGS_FAIL,
  payload: error,
})

export const updateLog = log => ({
  type: UPDATE_LOG,
  payload: log,
})

export const updateLogSuccess = log => ({
  type: UPDATE_LOG_SUCCESS,
  payload: log,
})

export const updateLogFail = error => ({
  type: UPDATE_LOG_FAIL,
  payload: error,
})

export const deleteLog = id => ({
  type: DELETE_LOG,
  payload: id,
})

export const deleteLogSuccess = id => ({
  type: DELETE_LOG_SUCCESS,
  payload: id,
})

export const deleteLogFail = error => ({
  type: DELETE_LOG_FAIL,
  payload: error,
})
