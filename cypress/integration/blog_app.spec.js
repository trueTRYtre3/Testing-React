describe('Blog app', function() {
	beforeEach(function() {
		cy.request('POST', 'http://localhost:3003/api/testing/reset')
		const user = {
			name: 'kyle kyle',
			username: 'kyle',
			password: '54321'
		}
		cy.request('POST', 'http://localhost:3003/api/users', user)
		cy.visit('http://localhost:3000')
	})

	it('Login form is shown', function() {
		cy.contains('Login to Application')
		cy.contains('username:')
		cy.contains('password:')
		cy.contains('Submit')
	})

	describe('Login', function() {
		it('succeeds with correct credentials', function() {
			cy.get('#Username').type('kyle')
			cy.get('#Password').type('54321')
			cy.contains('Submit').click()

			cy.contains('create blog')
		})

		it('fails with wrong credentials', function() {
			cy.get('#Username').type('12345')
			cy.get('#Password').type('kyle')
			cy.contains('Submit').click()
			cy.get('.errorMessage').should('have.css', 'color', 'rgb(255, 0, 0)')
		})
	})

	describe('When logged in', function() {
		beforeEach(function() {
			cy.login({ username: 'kyle', password: '54321' })
		})

		it('A blog can be created', function() {
			cy.contains('create blog').click()
			cy.get('#Title').type('New Title')
			cy.get('#Author').type('New Author')
			cy.get('#Url').type('New URL')
			cy.get('#creation').click()

			cy.get('.message')
				.should('contain', 'a new blog New Title by New Author added')
				.and('have.css', 'color', 'rgb(0, 128, 0)')
		})

		describe('A blog exists', function() {
			beforeEach(function() {
				cy.createBlog({
					title: 'New Title',
					author: 'New Author',
					url: 'New Url'
				})
			})

			it('blog can be liked', function() {
				cy.contains('view').click()
				cy.contains('likes 0')
				cy.get('#like-button').click()
				cy.contains('likes 1')
				cy.get('#like-button').click()
				cy.contains('likes 2')
			})

			it('blog can be deleted', function() {
				cy.contains('view').click()
				cy.contains('remove').click()
				cy.get('html').should('not.contain', 'New Title')
			})

			describe('invalid users', function() {
				beforeEach(function() {
					cy.contains('logout').click()
					const newUser = {
						name: 'new guy',
						username: 'newer',
						password: '12345'
					}
					cy.request('POST', 'http://localhost:3003/api/users', newUser)
					cy.login({ username: 'newer', password: '12345' })
				})

				it('invalid user cannot delete blog', function() {
					cy.contains('view').click()
					cy.contains('remove').click()
					cy.get('html').should('contain', 'New Title')
				})
			})
		})

		describe('multiple blogs exists', function() {
			beforeEach(function() {
				cy.createBlog({
					title: 'Title 1',
					author: 'Author 1',
					url: 'Url 1'
				})
				cy.createBlog({
					title: 'Title 2',
					author: 'Author 2',
					url: 'Url 2'
				})
				cy.createBlog({
					title: 'Title 3',
					author: 'Author 3',
					url: 'Url 3'
				})
			})

			it.only('blogs are ordered according to likes', function() {
				cy.contains('Title 1').parent().as('blog1')
				cy.contains('Title 2').parent().as('blog2')
				cy.contains('Title 3').parent().as('blog3')

				cy.get('@blog1').contains('view').click()
				cy.get('@blog2').contains('view').click()
				cy.get('@blog3').contains('view').click()

				cy.get('@blog1').find('#like-button').as('like1')
				cy.get('@blog2').find('#like-button').as('like2')
				cy.get('@blog3').find('#like-button').as('like3')

				cy.get('@like1').click()
				cy.get('@like2').click()
				cy.get('@like3').click()
				cy.get('@like2').click()
				cy.get('@like2').click()
				cy.get('@like3').click()
				cy.get('@like2').click()

				cy.wait(500)

				cy.get('.blog').then(blog => {
					cy.wrap(blog[0]).contains('likes 4')
					cy.wrap(blog[1]).contains('likes 2')
					cy.wrap(blog[2]).contains('likes 1')
				})
			})
		})
	})
})