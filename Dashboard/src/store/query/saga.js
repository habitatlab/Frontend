import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { SUBMIT_QUERY, GET_EXPERIMENTS } from "./actionTypes"
import { getExperimentsSuccess, getExperimentsFail, submitQuerySuccess, submitQueryFail } from "./actions"
import { submitQuery, fetchExperiments } from "helpers/fakebackend_helper"

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

function* getExperimentVideos() {
  try {
     const response = yield call(fetchExperiments)
     yield put(getExperimentsSuccess(response))
  } catch (error) {
     yield put(getExperimentsFail(error))
  }
}

function* dataQuerySaga() {
  yield takeEvery(SUBMIT_QUERY, submitDataQuery)
  yield takeEvery(GET_EXPERIMENTS, getExperimentVideos)
}

export default dataQuerySaga
