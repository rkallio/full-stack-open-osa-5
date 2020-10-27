import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog, bearerToken) => {
  const promise = axios.post(baseUrl, blog, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    } })

  return (await promise).data
}

const update = async (id, blog, bearerToken) => {
  const promise = axios.put(
    `${baseUrl}/${id}`,
    blog,
    {
      headers: {
        Authorization: `Bearer ${ bearerToken }`
      }
    })
  return (await promise).data
}

const remove = async (id, bearerToken) => {
  const promise = axios.delete(
    `${ baseUrl }/${ id }`,
    {
      headers: {
        Authorization: `Bearer ${ bearerToken }`
      }
    })

  return (await promise).data
}

export default { getAll, create, update, delete: remove }
