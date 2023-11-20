import { FETCH_DIAGNOSTICS, FETCH_DIAGNOSTICS_SUCCESS, FETCH_DIAGNOSTICS_FAIL } from "./actionTypes"

export const fetchDiagnostics = (query) => ({
  type: FETCH_DIAGNOSTICS,
  payload: query,
 })

export const fetchDiagnosticsSuccess = query => ({
  type: FETCH_DIAGNOSTICS_SUCCESS,
  payload: query,
})

export const fetchDiagnosticsFail = error => ({
  type: FETCH_DIAGNOSTICS_FAIL,
  payload: error,
})
