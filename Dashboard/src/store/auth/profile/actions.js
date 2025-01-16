import { PROFILE_ERROR, PROFILE_SUCCESS, EDIT_PROFILE, GET_PROFILE_SUCCESS, GET_PROFILE_ERROR, GET_PROFILE } from "./actionTypes"

export const editProfile = user => {
  return {
    type: EDIT_PROFILE,
    payload: { user },
  }
}

export const profileSuccess = msg => {
  return {
    type: PROFILE_SUCCESS,
    payload: msg,
  }
}

export const profileError = error => {
  return {
    type: PROFILE_ERROR,
    payload: error,
  }
}

export const getProfile = username => {
  return {
    type: GET_PROFILE,
    payload: username ,
  }
}

export const fetchProfileSuccess = user => {
  console.log("usertime" + user)
  return {
    type: GET_PROFILE_SUCCESS,
    payload: user,
  }
}

export const fetchProfileError = error => {
  return {
    type: GET_PROFILE_ERROR,
    payload: error,
  }
}
