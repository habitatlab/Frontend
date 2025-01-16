import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_LOGS, UPDATE_LOG, DELETE_LOG, ADD_LOGS } from "./actionTypes"
import { getLogsSuccess, getLogsFail, addLogsSuccess, addLogsFail, updateLogSuccess, updateLogFail, deleteLogSuccess, deleteLogFail } from "./actions"

//Include Both Helper File with needed methods
import { getLogs, updateLog, addLogs, deleteLog } from "helpers/fakebackend_helper"

function* fetchLogs() {
  try {
    const response = yield call(getLogs)
    yield put(getLogsSuccess(response))
  } catch (error) {
    yield put(getLogsFail(error))
  }
}

function* saveNewLogs({payload: logs}) {
  try {
     const response = yield call(addLogs, logs)
     yield put(addLogsSuccess(response))
  } catch (error) {
     yield put(addLogsFail(error))
  }
}

function* updateExistingLog({payload: log}) {
  try {
      const response = yield call(updateLog, log)
      yield put(updateLogSuccess(response))
  } catch (error) {
      yield put(updateLogFail(error))
  }
}

function* removeExistingLog({payload: id}) {
  try {
      console.log(id)
      const response = yield call(deleteLog, id)
      yield put(deleteLogSuccess(id))
  } catch (error) {
      yield put(deleteLogFail(error))
  }
}

function* logsSaga() {
  yield takeEvery(GET_LOGS, fetchLogs)
  yield takeEvery(ADD_LOGS, saveNewLogs)
  yield takeEvery(UPDATE_LOG, updateExistingLog)
  yield takeEvery(DELETE_LOG, removeExistingLog)
}

export default logsSaga
