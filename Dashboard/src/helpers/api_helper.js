import axios from "axios"

//pass new generated access token here
const API_URL = "http://schauderd-ws2:5001/"

const axiosApi = axios.create({
  baseURL: API_URL,
})
axios.defaults.headers.post['Content-Type'] ='application/json'

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config })
     .then(response => response.data)
}

export async function post(url, data, config = {}) {
  console.log(url + "::::" + data)
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  console.log(url + "::::" + config)
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  console.log(url)
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}
