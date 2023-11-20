import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_ANIMAL, UPDATE_ANIMAL, DELETE_ANIMAL, ADD_ANIMAL } from "./actionTypes"
import { getAnimalsSuccess, getAnimalsFail, addAnimalSuccess, addAnimalFail, updateAnimalSuccess, updateAnimalFail, deleteAnimalSuccess, deleteAnimalFail } from "./actions"

//Include Both Helper File with needed methods
import { getAnimals, updateAnimal, addAnimal, deleteAnimal } from "helpers/fakebackend_helper"

function* fetchAnimals() {
  try {
    const response = yield call(getAnimals)
console.log("ADFASDF")
    yield put(getAnimalsSuccess(response))
  } catch (error) {
    yield put(getAnimalsFail(error))
  }
}

function* saveNewAnimal({payload: animal}) {
  try {
   console.log(animal)
     const response = yield call(addAnimal, animal)
     yield put(addAnimalSuccess(response))
  } catch (error) {
     yield put(addAnimalFail(error))
  }
}

function* updateExistingAnimal({payload: animal}) {
  try {
      console.log(animal)
      const response = yield call(updateAnimal, animal)
      yield put(updateAnimalSuccess(response))
  } catch (error) {
      yield put(updateAnimalFail(error))
  }
}

function* removeExistingAnimal({payload: name}) {
  try {
      console.log(name)
      const response = yield call(deleteAnimal, name)
      yield put(deleteAnimalSuccess(name))
  } catch (error) {
      yield put(deleteAnimalFail(error))
  }
}

function* animalSaga() {
  yield takeEvery(GET_ANIMAL, fetchAnimals)
  yield takeEvery(ADD_ANIMAL, saveNewAnimal)
  yield takeEvery(UPDATE_ANIMAL, updateExistingAnimal)
  yield takeEvery(DELETE_ANIMAL, removeExistingAnimal)
}

export default animalSaga
