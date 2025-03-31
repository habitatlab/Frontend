import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {SUBMIT_QUERY, GET_EXPERIMENTS, GET_DATASET,
    GET_ANNOTATION_TIMELINES, DELETE_ANNOTATION_TIMELINE,
    UPDATE_ANNOTATION_TIMELINE, ADD_ANNOTATION_TIMELINE} from "./actionTypes"
import { getExperimentsSuccess, getExperimentsFail,
    getDatasetSuccess, getDatasetFail, submitQuerySuccess, submitQueryFail,
     getAnnotationTimelineSuccess, getAnnotationTimelineFail,
    updateAnnotationTimelineSuccess, updateAnnotationTimelineFail,
    addAnnotationTimelineSuccess, addAnnotationTimelineFail,
    deleteAnnotationTimelineSuccess, deleteAnnotationTimelineFail} from "./actions"
import { submitQuery, fetchExperiments, fetchDataset, addTimeline, updateTimeline, fetchAnnotationTimelines,
    deleteTimeline} from "helpers/fakebackend_helper"

function* submitDataQuery({payload: query}) {
  try {
   console.log(query)
     const response = yield call(submitQuery, query)
     console.log(response)
     yield put(submitQuerySuccess(response))
  } catch (error) {
     yield put(submitQueryFail(error))
  }
}

function* getExperimentVideos() {
  try {
     const response = yield call(fetchExperiments)
     yield put(getExperimentsSuccess(response))
  } catch (error) {
     yield put(getExperimentsFail(error))
  }
}

function* getDataset({payload: query}) {
    try {
        const response = yield call(fetchDataset, query)
        yield put(getDatasetSuccess(response))
    } catch (error) {
        yield put(getDatasetFail(error))
    }
}

function* getAnnotationTimelines({payload: query}) {
    try {
        const response = yield call(fetchAnnotationTimelines, query)
        yield put(getAnnotationTimelineSuccess(response))
    } catch (error) {
        yield put(getAnnotationTimelineFail(error))
    }
}

function* createAnnotationTimeline({payload: timeline}) {
    try {
        const response = yield call(addTimeline, timeline)
        yield put(addAnnotationTimelineSuccess(response))
    } catch (error) {
        yield put(addAnnotationTimelineFail(error))
    }
}

function* updateAnnotationTimeline({payload: timeline}) {
    try {
        const response = yield call(updateTimeline, timeline)
        yield put(updateAnnotationTimelineSuccess(response))
    } catch (error) {
        yield put(updateAnnotationTimelineFail(error))
    }
}

function* deleteAnnotationTimeline({payload: timeline}) {
    try {
        const response = yield call(deleteTimeline(), timeline)
        yield put(deleteAnnotationTimelineSuccess(response))
    } catch (error) {
        yield put(deleteAnnotationTimelineFail(error))
    }
}

function* dataQuerySaga() {
  yield takeEvery(SUBMIT_QUERY, submitDataQuery)
  yield takeEvery(GET_EXPERIMENTS, getExperimentVideos)
    yield takeEvery(GET_DATASET, getDataset)
    yield takeEvery(GET_ANNOTATION_TIMELINES, getAnnotationTimelines)
    yield takeEvery(ADD_ANNOTATION_TIMELINE, createAnnotationTimeline)
    yield takeEvery(UPDATE_ANNOTATION_TIMELINE, updateAnnotationTimeline)
    yield takeEvery(DELETE_ANNOTATION_TIMELINE, deleteAnnotationTimeline)
}

export default dataQuerySaga
