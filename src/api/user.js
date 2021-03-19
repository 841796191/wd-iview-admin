import { axios } from '@/libs/request'
import { getToken } from '../libs/util'
// export const login = ({ userName, password }) => {
//   const data = {
//     userName,
//     password
//   }
//   return axios.request({
//     url: 'login',
//     data,
//     method: 'post'
//   })
// }

const getUserInfo = (token) => {
  return axios.get('/public/info', {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export {
  getUserInfo
}
