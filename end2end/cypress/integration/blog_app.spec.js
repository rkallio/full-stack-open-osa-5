describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users',
               {
                 username: 'root',
                 password: 'root'
               })
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('Login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#login-form-username').type('root')
      cy.get('#login-form-password').type('root')
      cy.get('#login-form').submit()
      cy.contains('Log out').click()
    })

    it('fails with wrong credentials', function() {
      cy.get('#login-form-username').type('root')
      cy.get('#login-form-password').type('boot')
      cy.get('#login-form').submit()
      cy.contains('Failed login')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.get('#login-form-username').type('root')
      cy.get('#login-form-password').type('root')
      cy.get('#login-form-submit').click()
    })

    it('a blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#blog-form-title').type('my blog')
      cy.get('#blog-form-author').type('rootfs')
      cy.get('#blog-form-url').type('localhost')
      cy.get('#blog-form').submit()
      cy.contains('blog my blog by rootfs created')
    })

    describe('blog actions', function() {
      beforeEach(function() {
        cy.contains('New blog').click()
        cy.get('#blog-form-title').type('my blog')
        cy.get('#blog-form-author').type('rootfs')
        cy.get('#blog-form-url').type('localhost')
        cy.get('#blog-form').submit()
      })

      it('a blog can be liked', function() {
        cy.contains('show').click()
        cy.contains('Add like').click()
        cy.contains('likes: 1')
      })

      it('a blog can be removed', function() {
        cy.contains('show').click()
      })
    })

    it.only('blogs are listed ordered by likes', function() {
      cy.contains('New blog').click()
      cy.get('#blog-form-title').type('my blog')
      cy.get('#blog-form-author').type('rootfs')
      cy.get('#blog-form-url').type('localhost')
      cy.get('#blog-form').submit()

      cy.contains('New blog').click()
      cy.get('#blog-form-title').type('my other blog')
      cy.get('#blog-form-author').type('rootfs')
      cy.get('#blog-form-url').type('localhost')
      cy.get('#blog-form').submit()
      cy.contains('show').click()
      cy.contains('Add like').click()

      cy.contains('likes: 1')
    })
  })
})
