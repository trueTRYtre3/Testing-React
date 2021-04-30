import React, { useState } from 'react'
// import blogService from '../services/blogService'

const Create = ({ createdBlog }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const resetState = () => {
		setTitle('')
		setAuthor('')
		setUrl('')
	}


	const handleSubmit = e => {
		e.preventDefault()
		createdBlog(title, author, url)
		resetState()
	}


	return (
		<div>
			<h2>Create New Blog</h2>
			<form onSubmit={handleSubmit}>
				<div>
                    title: <input
						type='text'
						id='Title'
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
                    author: <input
						type='text'
						id='Author'
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
                    url: <input
						type='text'
						id='Url'
						value={url}
						onChange={({ target }) => setUrl(target.value)}
					/>
				</div>
				<button id='creation' type='submit'>
					Create
				</button>
			</form>
		</div>
	)
}

export default Create