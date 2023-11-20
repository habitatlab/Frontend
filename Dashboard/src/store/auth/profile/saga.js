import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { EDIT_PROFILE, GET_PROFILE } from "./actionTypes"
import { fetchProfileSuccess, fetchProfileError, profileSuccess, profileError } from "./actions"

//Include Both Helper File with needed methods
import {
  postJwtProfile,
  fetchProfile,
} from "../../../helpers/fakebackend_helper"

function* getProfile({ payload: username }) {
  try {
     const users = yield call(fetchProfile, username)
     yield put(fetchProfileSuccess(users[0]))
  } catch (error) {
     yield put(fetchProfileError(error))
  }
}

function* editProfile({ payload: { user } }) {
  try {
      const response = yield call(postJwtProfile, "/post-jwt-profile", {
        username: user,
      })
      yield put(profileSuccess(response))
  } catch (error) {
    yield put(profileError(error))
  }
}
export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile)
  yield takeEvery(GET_PROFILE, getProfile)
}

function* ProfileSaga() {
  yield all([fork(watchProfile)])
}

export default ProfileSaga
