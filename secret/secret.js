module.exports = {
	auth: {
		user: 'bernard.pagoaga.dev@gmail.com',
		pass: 'veatnesmam85'
	},
	facebook: {
		clientID: '234009980449574',
		clientSecret: '7fc732313702fd8dde50bee7dcf15c74',
		profileFields: ['email', 'displayName'],
		callbackURL: 'http://localhost:3000/auth/facebook/callback',
		passReqToCallback: true
	}
}