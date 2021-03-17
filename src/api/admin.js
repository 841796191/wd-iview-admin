import { axios } from '../libs/request'
import Dispatch from '../libs/dispatch'

// 获取用户列表
// const getUserList = (params) => axios.get('/admin/users?' + qs.stringify(params))
// 更新用户信息
// const updateUserById = (data) => axios.post('/admin/updateUser', data)
// 删除用户信息
// const updateUserById = (data) => axios.post('/admin/deleteUser', data)
// 校验用户名是否重复
// const checkUsername = (username) => axios.get('/admin/checkname?username=' + username)
// 新增用户
// const addUser = (data) => axios.post('/admin/addUser', data)
export const userDispatch = new Dispatch({
  get: ['/admin/users', 'get'],
  update: ['/admin/updateUser', 'post'],
  batch: ['/admin/updateUserSettings', 'post'],
  delete: ['/admin/deleteUser', 'post'],
  check: ['/admin/checkname', 'get'],
  add: ['/admin/addUser', 'post']
})
// export {
//   getUserList,
//   updateUserById,
//   userDispatch
// }
export const getStatData = () => axios.get('/admin/getstat')
