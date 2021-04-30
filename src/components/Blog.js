import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Blog = React.forwardRef((props, ref) => {
	const [showCreate, changeCreate] = useState(false)

	const creationDisplay = { display: showCreate ? '': 'none' }
	const creationButton = {
		display: showCreate ? 'none' : '',
		margin: 10,
		borderRadius: 4
	}



	const controlCreate = () => {
		changeCreate(!showCreate)
	}

	useImperativeHandle(ref, () => {
		return {
			controlCreate
		}
	})


	return (
		<div>
			<button
				onClick={controlCreate}
				style={creationButton}>
                create blog
			</button>
			<div style={creationDisplay}>
				{props.children}
				<button onClick={controlCreate}>{props.cancelButton}</button>
			</div>
		</div>
	)
})

Blog.displayName = 'Blog'
Blog.propTypes = {
	cancelButton: PropTypes.string.isRequired
}

export default Blog