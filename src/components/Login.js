import React, { useState } from 'react'
import login from '../services/login'

const Login = ({ loginUser }) => {
	const [username, changeUsername] = useState('')
	const [password, changePassword] = useState('')
	const [error, changeError] = useState(false)

	const handleLogin = async e => {
		e.preventDefault()
		try {
			const newUser = await login({ username, password })
			loginUser(newUser)
			changeUsername('')
			changePassword('')
		} catch(exceptions) {
			changeError(true)
			console.log(exceptions)
			setTimeout(() => {
				changeError(false)
			}, 5000)

		}

	}

	return (
		<div>
			<h1>Login to Application</h1>
			{error && <h2 className='errorMessage'>wrong username or password</h2>}
			<form onSubmit={handleLogin}>
				<div>
					<><strong>username: </strong></>
					<input
						type='text'
						value={username}
						id="Username"
						onChange={({ target }) => changeUsername(target.value)}
					/>
				</div>
				<div>
					<strong>password: </strong>
					<input
						type="password"
						value={password}
						id="Password"
						onChange={({ target }) => changePassword(target.value)}
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}


export default Login