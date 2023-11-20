import axios from "axios"
import { post, del, get, put } from "./api_helper"
import * as url from "./url_helper"
import { Auth } from 'aws-amplify'

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user")
  console.log(user)
  return user 
}


//is user is logged in
const isUserAuthenticated = () => {
  if (getLoggedInUser()!="undefined") {
      return true
  } else {
      return false
  }
}

const logoutUser = () => {
  localStorage.removeItem("user")
}

// Register Method
const postRegister = data => {
  return signUp(data.username, data.password, data.email)
}

function signUp(username, password, email) {
  try {
      return Auth.signUp({
            username,
            password,
            attributes: {
               email,     
            }
       })
  } catch (error) {
       console.log('error signing up:', error)
  }
}

// Login Method
const postLogin = data => {
  return login(data)
}

async function login(user) {
  get (`${url.LOGIN_USER}`,user)     
}

const addToken = user => {
  console.log(user)
  localStorage.setItem("user", user) 
} 

// postForgetPwd
const postFakeForgetPwd = data => post(url.POST_FAKE_PASSWORD_FORGET, data)

// Edit profile
const postJwtProfile = data => post(url.POST_EDIT_JWT_PROFILE, data)

const postFakeProfile = data => post(url.POST_EDIT_PROFILE, data)

// Register Method
const postJwtRegister = (url, data) => {
  return axios
    .post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) return response.data
      throw response.data
    })
    .catch(err => {
      let message
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found"
            break
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team"
            break
          case 401:
            message = "Invalid credentials"
            break
          default:
            message = err[1]
            break
        }
      }
      throw message
    })
}

// Login Method
const postJwtLogin = data => post(url.POST_FAKE_JWT_LOGIN, data)

// postForgetPwd
const postJwtForgetPwd = user => { 
  return Auth.forgotPassword(user)
}

const postJwtChangePwd = (user, code, password) => {
  console.log("SDFSFDS")
  return Auth.forgotPasswordSubmit(user, code, password) 
}

const postConfirmEmail = (user,code) => {
  return Auth.confirmSignUp(user, code)
}
// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data)

// get Products
export const getProducts = () => get(url.GET_PRODUCTS)

// get Product detail
export const getProductDetail = id =>
  get(`${url.GET_PRODUCTS_DETAIL}/${id}`, { params: { id } })

// get Events
export const getEvents = username =>
  get(`${url.GET_EVENTS}?username=${username}`, { headers: { "Authorization": getToken()},
     params: { username } })

// add Events
export const addNewEvent = event => post(url.ADD_NEW_EVENT, event,  { headers: { "Authorization": getToken()} })

// update Event
export const updateEvent = event => put(url.UPDATE_EVENT, event, { headers: { "Authorization": getToken()} })

// delete Event
export const deleteEvent = eventId =>
  del(`${url.DELETE_EVENT}?id=${eventId}`,  { headers: { "Authorization": getToken()} })

// get Categories
export const getCategories = () => get(url.GET_CATEGORIES)

// get chats
export const getChats = () => get(url.GET_CHATS)

// get groups
export const getGroups = () => get(url.GET_GROUPS)

// get Contacts
export const getContacts = () => get(url.GET_CONTACTS)

// get messages
export const getMessages = (roomId = "") =>
  get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } })

// post messages
export const addMessage = message => post(url.ADD_MESSAGE, message)

// get orders
export const getOrders = () => get(url.GET_ORDERS)

// get cart data
export const getCartData = () => get(url.GET_CART_DATA)

// get customers
export const getCustomers = () => get(url.GET_CUSTOMERS)

// get shops
export const getShops = () => get(url.GET_SHOPS)

// get wallet
export const getWallet = () => get(url.GET_WALLET)

// get crypto order
export const getCryptoOrder = () => get(url.GET_CRYPTO_ORDERS)

// get invoices
export const getInvoices = () => get(url.GET_INVOICES)

// get invoice details
export const getInvoiceDetail = id =>
  get(`${url.GET_INVOICE_DETAIL}/${id}`, { params: { id } })

// get journaal 
export const getJournal = () => get(url.GET_JOURNAL_LOG)

export const postNote = data => post(url.POST_JOURNAL_NOTE, data)

export const deleteNote = id => {
   var foo = url.DELETE_JOURNAL_NOTE + "?id="+id
   del(foo)
}

//logs
export const getLogs = () => get(url.GET_LOGS)

export const updateLog = log => put(url.UPDATE_LOG, log)

export const deleteLog = id => {
       var foo = url.DELETE_LOG + "?id="+id
       del(foo)
}

export const getDiagnosticResults = location => get(`${location}`)

export const submitQuery = query => post(url.DATA_QUERY, query)

export const addAnimal = animal => post(url.ADD_ANIMAL, animal)

export const getAnimals = () => get(url.GET_ANIMALS)

export const updateAnimal = animal => put(url.UPDATE_ANIMAL, animal)

export const deleteAnimal = name => {
	       var foo = url.DELETE_ANIMAL + "?name="+name
	       del(foo)
}

export const addLogs = logs => post(url.ADD_LOGS, logs)

// get journal note
export const getNote = id =>
  get(`${url.GET_JOURNAL_NOTE}?id=${id}`, { params: { id } })

// get tasks
export const getTasks = () => get(url.GET_TASKS)

// get contacts
export const getUsers = () => get(url.GET_USERS)

export const getUserProfile = () => get(url.GET_USER_PROFILE)


const fetchProfile = username => 
  get(`${url.PROFILE}`, { headers: { "Authorization": getToken()},
           params: { username } })

export {
  getLoggedInUser,
  isUserAuthenticated,
  logoutUser,
  postRegister,
  postLogin,
  addToken,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtChangePwd,
  postJwtProfile,
  postConfirmEmail,
  fetchProfile
}
