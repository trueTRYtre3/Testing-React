import axios from 'axios'
const baseURL = '/api/login'

const login = async loginObj => {
	const response = await axios.post(baseURL, loginObj)
	return response.data
}

export default login