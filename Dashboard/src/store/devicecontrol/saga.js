import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { FETCH_DIAGNOSTICS } from "./actionTypes"
import { fetchDiagnosticsSuccess, fetchDiagnosticsFail } from "./actions"
import { getDiagnosticResults } from "helpers/fakebackend_helper"

function* fetchDiagnostics({payload: query}) {
  try {
   console.log(query)
     const response = yield call(getDiagnosticResults, query.location)
      var metadata = {
      "json": response,
      "camera": query.camera,
      "location": query.location
     }
     yield put(fetchDiagnosticsSuccess(metadata))
  } catch (error) {
     yield put(fetchDiagnosticsFail(error))
  }
}

function* devicecontrolSaga() {
  yield takeEvery(FETCH_DIAGNOSTICS, fetchDiagnostics)
}

export default devicecontrolSaga
