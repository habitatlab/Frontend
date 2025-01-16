import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { FORGET_PASSWORD, CHANGE_PASSWORD } from "./actionTypes"
import { userForgetPasswordSuccess, userForgetPasswordError, userChangePasswordSuccess, userChangePasswordError } from "./actions"

//Include Both Helper File with needed methods
import {
  postJwtForgetPwd,
  postJwtChangePwd
} from "../../../helpers/fakebackend_helper"

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: user }) {
  try {
      console.log (user)
      const response = yield call(postJwtForgetPwd, user) 
      if (response) {
        yield put(
          userForgetPasswordSuccess(
            "Reset link is sent to your mailbox, check there first"
          )
        )
      }
  } catch (error) {
    yield put(userForgetPasswordError(error))
  }
}

function* changePassword({ payload: {user, code, password} }) {
  try {
     console.log (user + "::" + code + "::" + password)
     const response = yield call(postJwtChangePwd, user, code, password)
     if (response) {
	yield put (
	   userChangePasswordSuccess("success") 
	) 
     }
  } catch (error) {
    console.log(error)
    yield put(userChangePasswordError(error))
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser)
  yield takeEvery(CHANGE_PASSWORD, changePassword)
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)])
}

export default forgetPasswordSaga
