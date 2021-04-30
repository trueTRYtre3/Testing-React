import React, { useEffect, useState, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Create from './components/Create'
import BlogList from './components/BlogList'
import blogService from './services/blogService'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, changeUser] = useState(null)
	const [success, changeSuccess] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [newBlog, setNewBlog] = useState('')

	const viewCreation = useRef()

	useEffect(() => {
		blogService.getAll()
			.then(initialBlog => {
				initialBlog.sort((a,b) => b.likes-a.likes)
				setBlogs(initialBlog)
			})
	}, [newBlog])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
		if (loggedUserJSON) {
			const tokenUser = JSON.parse(loggedUserJSON)
			changeUser(tokenUser)
			blogService.setToken(tokenUser.token)
		}
	}, [])

	const loginUser = (userObject) => {
		blogService.setToken(userObject.token)
		window.localStorage.setItem(
			'loggedBlogUser', JSON.stringify(userObject)
		)
		changeUser(userObject)
	}

	const createdBlog = (title, author, url) => {
		try {
			blogService
				.create({ title, author, url })
				.then(response => {
					setBlogs(blogs.concat(response))
					changeSuccess(true)
					setNewBlog(response)
					setSuccessMessage(response)
					viewCreation.current.controlCreate()
				})
		} catch(exception) {
			console.log(exception)
		}
	}

	const updateBlogs = (id, newObj) => {
		blogService
			.update(id, newObj)
			.then(response => {
				blogs.forEach(blog => {
					if (blog.user && (blog.user.id === response.user)) {
						response.user = blog.user
					}
				})
				const newBlogs = blogs.map(blog => blog.id === response.id ? response : blog)
				newBlogs.sort((a,b) => b.likes-a.likes)
				setBlogs(newBlogs)
			})
	}

	const deleteBlogs = id => {
		try {
			blogService
				.deleteBlog(id)
				.then(response => {
					console.log(response.status)
					setBlogs(blogs.filter(blog => blog.id !== id))
				})
		} catch(exception) {
			console.log(exception)
		}

	}

	const handleSuccess = () => {
		setTimeout(() => {
			changeSuccess(false)
		}, 5000)
		return (
			<h2 className="message">
			a new blog {successMessage.title} by {successMessage.author} added
			</h2>
		)
	}

	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogUser')
		changeUser(null)
	}


	return (
		<div>
			<h1>Blogs</h1>
			{user === null
				? <Login loginUser={loginUser} />
				: <>
					{success && handleSuccess()}
					{user.name} logged in <button onClick={handleLogout}>logout</button>
					<Blog ref={viewCreation} cancelButton='cancel'>
						<Create createdBlog={createdBlog} success={success}/>
					</Blog>
					<br />
					<div>
						{blogs.map(blog =>
							<BlogList
								key={blog.id}
								blog={blog}
								updateBlogs={updateBlogs}
								deleteBlogs={deleteBlogs}
							/>
						)}
					</div>
				</>
			}
		</div>
	)
}

export default App
