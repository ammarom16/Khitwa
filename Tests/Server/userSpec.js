var sinon = require('sinon');
var expect = require ('chai').expect;
var path = require('path')
var server = require(path.join(__dirname,'../../' ,'./server/server.js'));
var chai = require('chai')
      ,chaiHttp = require('chai-http');
chai.use(chaiHttp);

var User = require('../../server/users/userModel');
var userController = require('../../server/users/userController');

describe('User Test Database', function (done) {
	
	User.collection.drop();

	beforeEach(function(done) {
		var newUser = new User ({
			'username':'Mihyar',
			'password':'1234',
			'firstName':'Mihyar',
			'lastName':'Almasalma',
			'email':'mihyar@khitwa.org',
			'dateOfBirth':'08-mar-1989',
			'gender':'Male',
			'phoneNumber':'2044055707',
			'skills':['English','Coding'],
			'causes':['Medical']
		})
		newUser.save(function (err, savedUSer) {
			done();
		});
	});

	afterEach(function (done) {
		User.collection.drop();
		done();
	});

	describe('Sign in User', function (done) {
		it('Should have a method called signin', function (done) {
			expect(typeof userController.signin).to.be.equal('function');
			done();
		});

		it('Should response 500 ERROR if user is not available', function (done) {
			chai.request(server)
				.post('/api/users/signin')
				.send({
					'username':'Stupied'
				})
				.end(function (error, res) {
					expect(error).to.not.equal(null);
					expect(res.status).to.be.equal(500);
					done();
				});
		});

		it('Should give access token when signin', function (done) {
			chai.request(server)
				.post('/api/users/signin')
				.send({
					'username':'Mihyar',
					'password':'1234'
				})
				.end(function (error, res) {
					expect(res.body.token).to.not.equal(undefined);
					expect(res.body).to.have.property('token');
					expect(res.body).to.have.property('username');
					done();
				});
		});

		it('Should return 500 ERROR if password is incorrect', function (done) {
			chai.request(server)
				.post('/api/users/signin')
				.send({
					'username':'Mihyar',
					'password':'wrongpassword'
				})
				.end(function (error, res) {
					expect(res.status).to.be.equal(500);
					done();
				});
		});
	});
})