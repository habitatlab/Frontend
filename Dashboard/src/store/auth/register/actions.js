import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  CONFIRM_EMAIL,
  CONFIRM_EMAIL_SUCCESSFUL,
  CONFIRM_EMAIL_FAILED
} from "./actionTypes"

export const registerUser = user => {
  console.log("MILESTONE 1");
  return {
    type: REGISTER_USER,
    payload: { user },
  }
}

export const registerUserSuccessful = user => {
  return {
    type: REGISTER_USER_SUCCESSFUL,
    payload: user,
  }
}

export const registerUserFailed = user => {
  return {
    type: REGISTER_USER_FAILED,
    payload: user,
  }
}

export const confirmEmail = (user, code) => {
  console.log("MILESTONE 4");
  return {
      type: CONFIRM_EMAIL,
      payload: { user, code },
  }
}

export const confirmEmailSuccessful = user => {
  return {
      type: CONFIRM_EMAIL_SUCCESSFUL,
      payload: user,
  }
}

export const confirmEmailFailed = user => {
  return {
      type: CONFIRM_EMAIL_FAILED,
      payload: user,
  }
}
