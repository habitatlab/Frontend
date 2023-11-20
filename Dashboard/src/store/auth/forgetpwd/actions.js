import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR
} from "./actionTypes"

export const userForgetPassword = user => {
  console.log (user)
  return {
    type: FORGET_PASSWORD,
    payload: user,
  }
}

export const userForgetPasswordSuccess = message => {
  return {
    type: FORGET_PASSWORD_SUCCESS,
    payload: message,
  }
}

export const userForgetPasswordError = message => {
  return {
    type: FORGET_PASSWORD_ERROR,
    payload: message,
  }
}

export const userChangePassword = (user, code, password) => {
  return {
     type: CHANGE_PASSWORD,
     payload: { user, code, password },
  }
}

export const userChangePasswordSuccess = message => {
  return {
     type: CHANGE_PASSWORD_SUCCESS,
     payload: message,
  }
}

export const userChangePasswordError = message => {
   return {
     type: CHANGE_PASSWORD_ERROR,
     payload: message,
   }
}
