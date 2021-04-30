import axios from 'axios'
const baseURL = '/api/blogs'

let token = null

const setToken = newToken => {
	token = `bearer ${newToken}`
}


const getAll = async () => {
	const request = await axios.get(baseURL)
	return request.data
}

const create = async newObject => {
	const config = {
		headers: { Authorization: token },
	}
	const response = await axios.post(baseURL, newObject, config)
	return response.data
}

const update = async (id, newObject) => {
	const response = await axios.put(`${baseURL}/${id}`, newObject)
	return response.data
}

const deleteBlog = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.delete(`${baseURL}/${id}`, config)
	return response
}


export default { getAll, create, setToken, update, deleteBlog }
