import {
  GET_JOURNAL,
  GET_JOURNAL_FAIL,
  GET_JOURNAL_SUCCESS,
  GET_NOTE,
  GET_NOTE_FAIL,
  GET_NOTE_SUCCESS,
  DELETE_NOTE,
  DELETE_NOTE_SUCCESS,
  DELETE_NOTE_FAIL,
  POST_NOTE,
  POST_NOTE_SUCCESS,
  POST_NOTE_FAIL
} from "./actionTypes"

export const getJournal = () => ({
  type: GET_JOURNAL,
})

export const getJournalSuccess = journal => ({
  type: GET_JOURNAL_SUCCESS,
  payload: journal,
})

export const getJournalFail = error => ({
  type: GET_JOURNAL_FAIL,
  payload: error,
})

export const getNote = noteId => ({
  type: GET_NOTE,
  noteId,
})

export const getNoteSuccess = note => ({
  type: GET_NOTE_SUCCESS,
  payload: note,
})

export const getNoteFail = error => ({
  type: GET_NOTE_FAIL,
  payload: error,
})

export const deleteNote = (noteId, history) => ({
  type: DELETE_NOTE,
  payload: { noteId, history },
})

export const deleteNoteSuccess = note => ({
  type: DELETE_NOTE_SUCCESS,
  payload: note,
})

export const deleteNoteFail = error => ({
  type: DELETE_NOTE_FAIL,
  payload: error,
})

export const postNote = (noteDetails,history,redirect) => ({
  type: POST_NOTE,
  payload: { noteDetails, history,redirect },
})

export const postNoteSuccess = note => ({
	  type: POST_NOTE_SUCCESS,
	  payload: note,
})

export const postNoteFail = error => ({
	  type: POST_NOTE_FAIL,
	  payload: error,
})
