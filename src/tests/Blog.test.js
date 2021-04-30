import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import BlogList from '../components/BlogList'
import Create from '../components/Create'

test('renders blogs title and author', () => {
	const blog = {
		title: 'This is the title',
		author: 'This is the author',
	}

	const component = render(
		<BlogList blog={blog} />
	)

	expect(component.container).toHaveTextContent('This is the title')
	expect(component.container).toHaveTextContent('This is the author')
})

test('does not render url or number by default', () => {
	const blog = {
		title: 'This is the title',
		author: 'This is the author',
	}

	const component = render(
		<BlogList blog={blog} />
	)

	const div = component.container.querySelector('.extraDetails')
	expect(div).toHaveStyle('display: none')
})

test('button successfully hides and shows url and likes when clicked', () => {
	const blog = {
		title: 'This is the title',
		author: 'This is the author',
		url: 'www.stuff.com',
		likes: 4
	}

	const component = render(
		<BlogList blog={blog} />
	)

	const div = component.container.querySelector('.extraDetails')
	const button = component.getByText('view')
	fireEvent.click(button)

	expect(button).toHaveTextContent('hide')

	fireEvent.click(button)
	expect(button).toHaveTextContent('view')
	expect(div).toHaveStyle('display: none')
})

test('like button updates blog post when clicked', () => {
	const blog = {
		title: 'This is the title',
		author: 'This is the author',
		url: 'www.stuff.com',
		likes: 4
	}

	const mockUpdate = jest.fn()

	const component = render(
		<BlogList blog={blog} updateBlogs={mockUpdate} />
	)
	const button = component.getByText('like')
	fireEvent.click(button)
	expect(mockUpdate.mock.calls[0][1].likes).toBe(5)
	fireEvent.click(button)
	expect(mockUpdate.mock.calls[0][1].likes).toBe(5)
})

test.only('form calls event handler prop when blog is created', () => {
	const createdBlog = jest.fn()

	const component = render(
		<Create createdBlog={createdBlog} />
	)

	const form = component.container.querySelector('form')
	const title = component.container.querySelector('#Title')
	const author = component.container.querySelector('#Author')
	const url = component.container.querySelector('#Url')

	fireEvent.change(title, {
		target: { value: 'this is the title' }
	})

	fireEvent.change(author, {
		target: { value: 'this is the author' }
	})

	fireEvent.change(url, {
		target: { value: 'this is the url' }
	})

	fireEvent.submit(form)

	// expect(createdBlog.mock.calls).toHaveLength(3)
	expect(createdBlog.mock.calls[0][0]).toBe('this is the title')
	expect(createdBlog.mock.calls[0][2]).toBe('this is the url')
	// component.debug()
})