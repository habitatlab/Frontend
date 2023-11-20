import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { SUBMIT_QUERY } from "./actionTypes"
import { submitQuerySuccess, submitQueryFail } from "./actions"
import { submitQuery } from "helpers/fakebackend_helper"

function* submitDataQuery({payload: query}) {
  try {
   console.log(query)
     const response = yield call(submitQuery, query)
     console.log(response)
     yield put(submitQuerySuccess(response))
  } catch (error) {
     yield put(submitQueryFail(error))
  }
}

function* dataQuerySaga() {
  yield takeEvery(SUBMIT_QUERY, submitDataQuery)
}

export default dataQuerySaga
