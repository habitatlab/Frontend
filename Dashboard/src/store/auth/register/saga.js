import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_USER, CONFIRM_EMAIL } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed, confirmEmailSuccessful, confirmEmailFailed } from "./actions"

//Include Both Helper File with needed methods
import {
  postRegister,
  postConfirmEmail,
} from "../../../helpers/fakebackend_helper"

// initialize relavant method of both Auth

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user } }) {
  try {
    console.log ("MILESTONE 2");
    const response = yield call(postRegister, user)
    yield put(registerUserSuccessful(response))
  } catch (error) {
    yield put(registerUserFailed(error))
  }
}

function* confirmEmail({ payload: {user, code} }) {
  try {
    console.log("MILESTONE 6")
    const response = yield call(postConfirmEmail, user, code)
    yield put(confirmEmailSuccessful(response))
  } catch (error) {
    yield put(confirmEmailFailed(error))
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
  yield takeEvery(CONFIRM_EMAIL, confirmEmail)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
