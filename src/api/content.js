import { axios } from '../libs/request'
import qs from 'qs'

const getList = (options) => {
  return axios.get('/public/list?' + qs.stringify(options))
}
// 删除帖子
const deletePostById = (id) => {
  return axios.get('/content/delete?tid=' + id)
}
// 更新帖子
const updatePostById = (data) => {
  return axios.post('/content/updateId', data)
}

// 标签管理
const getTags = (options) => {
  return axios.get('/admin/getTags?' + qs.stringify(options))
}
// 添加标签
const addTag = (data) => {
  return axios.post('/admin/addTag', data)
}
// 删除标签
const removeTag = (id) => {
  return axios.get('/admin/removeTag?ptid=' + id)
}
// 更新标签
const updateTag = (data) => {
  return axios.post('/admin/editTag?', data)
}

export {
  getList,
  deletePostById,
  updatePostById,
  getTags,
  addTag,
  removeTag,
  updateTag
}
