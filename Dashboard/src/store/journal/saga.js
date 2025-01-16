import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_JOURNAL, GET_NOTE, POST_NOTE, DELETE_NOTE } from "./actionTypes"
import {
  getJournalSuccess,
  getJournalFail,
  getNoteSuccess,
  getNoteFail,
  postNoteSuccess,
  postNoteFail,
  deleteNoteSuccess,
  deleteNoteFail,
} from "./actions"

//Include Both Helper File with needed methods
import { getJournal, getNote, postNote, deleteNote } from "helpers/fakebackend_helper"

function* fetchJournal() {
  try {
    const response = yield call(getJournal)
    yield put(getJournalSuccess(response))
  } catch (error) {
    yield put(getJournalFail(error))
  }
}

function* fetchNote({ noteId }) {
  try {
    const response = yield call(getNote, noteId)
    yield put(getNoteSuccess(response))
  } catch (error) {
    yield put(getNoteFail(error))
  }
}

function* saveNote({ payload: { noteDetails, history,redirect } }) {
  try {
    const response = yield call(postNote, noteDetails)
    yield put(postNoteSuccess(response))
    if (redirect == "list")
	history.push("/journal")
    else 
        history.push("/journal/note?id="+noteDetails.id)
  } catch (error) {
    yield put(postNoteFail(error))
  }
}

function* removeNote({ payload: { noteId, history } }) {
  try {
    console.log(noteId + history);
    const response = yield call(deleteNote, noteId)
    yield put(deleteNoteSuccess(response))
    history.push("/journal")
  } catch (error) {
    yield put(deleteNoteFail(error))
  }
}

function* journalSaga() {
  yield takeEvery(GET_JOURNAL, fetchJournal)
  yield takeEvery(GET_NOTE, fetchNote)
  yield takeEvery(POST_NOTE, saveNote)
  yield takeEvery(DELETE_NOTE, removeNote)
}

export default journalSaga
