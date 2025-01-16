import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import LayoutSaga from "./layout/saga"
import logsSaga from "./dailylogs/saga"
import animalSaga from "./animal/saga"
import dataQuerySaga from "./query/saga"
import devicecontrolSaga from "./devicecontrol/saga"

export default function* rootSaga() {
  yield all([
    //public
    AccountSaga(),
    fork(AuthSaga),
    ProfileSaga(),
    ForgetSaga(),
    LayoutSaga(),
    fork(logsSaga),
    fork(animalSaga),
    fork(dataQuerySaga),
    fork(devicecontrolSaga),
  ])
}
