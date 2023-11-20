import { GET_ANIMAL, GET_ANIMAL_FAIL, GET_ANIMAL_SUCCESS, ADD_ANIMAL, ADD_ANIMAL_FAIL, ADD_ANIMAL_SUCCESS, UPDATE_ANIMAL, UPDATE_ANIMAL_FAIL,UPDATE_ANIMAL_SUCCESS, DELETE_ANIMAL, DELETE_ANIMAL_FAIL, DELETE_ANIMAL_SUCCESS } from "./actionTypes"

export const getAnimals = () => ({
  type: GET_ANIMAL,
})

export const getAnimalsSuccess = animals => ({
  type: GET_ANIMAL_SUCCESS,
  payload: animals,
})

export const getAnimalsFail = error => ({
  type: GET_ANIMAL_FAIL,
  payload: error,
})

export const addAnimal = animal => ({
  type: ADD_ANIMAL,
  payload: animal,
})

export const addAnimalSuccess = animal => ({
  type: ADD_ANIMAL_SUCCESS,
  payload: animal,
})

export const addAnimalFail = error => ({
  type: ADD_ANIMAL_FAIL,
  payload: error,
})

export const updateAnimal = animal => ({
  type: UPDATE_ANIMAL,
  payload: animal,
})

export const updateAnimalSuccess = animal => ({
  type: UPDATE_ANIMAL_SUCCESS,
  payload: animal,
})

export const updateAnimalFail = error => ({
  type: UPDATE_ANIMAL_FAIL,
  payload: error,
})

export const deleteAnimal = name => ({
  type: DELETE_ANIMAL,
  payload: name,
})

export const deleteAnimalSuccess = name => ({
  type: DELETE_ANIMAL_SUCCESS,
  payload: name,
})

export const deleteAnimalFail = error => ({
  type: DELETE_ANIMAL_FAIL,
  payload: error,
})
