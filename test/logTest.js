const request = require('request-promise');
const fs = require('fs');
const should = require('should');

require('../server');


before(() => {
	const dataToWrite = [
		"2020-01-01T00:06:33.312Z Request received from 111.94.139.169 for /projects",
		"2020-01-01T00:06:33.312Z Request received from 111.94.139.168 for /projects",
		"2020-01-01T00:06:44.169Z Response 200 sent to 111.94.139.169 for /projects",
		"2020-01-01T00:06:57.169Z Response 500 sent to 111.94.139.169 for /projects",
		"2020-01-02T00:07:21.281Z Querying table events",
		"2020-01-02T00:07:47.432Z Request received from 213.174.243.73 for /home",
		"2020-01-02T00:08:16.068Z Response 200 sent to 213.174.243.73 for /home",
	];
	fs.writeFileSync("./test/testLog.txt", dataToWrite.join('\n'));
});


describe('/parseLog', function () {
	it('returns correct logs between a timeframe', async () => {
		const res = await request({
			url: `http://localhost:${config.port}/log`,
			qs: {
				timestampFrom: "2020-01-01T00:00:33.312Z",
				timestampTo: "2020-01-02T00:00:00.000Z"
			},
			method: "GET",
			json: true
		});
		res.should.deepEqual([
			'2020-01-01T00:06:33.312Z Request received from 111.94.139.169 for /projects',
			'2020-01-01T00:06:33.312Z Request received from 111.94.139.168 for /projects',
			'2020-01-01T00:06:44.169Z Response 200 sent to 111.94.139.169 for /projects',
			'2020-01-01T00:06:57.169Z Response 500 sent to 111.94.139.169 for /projects'
		])
	});

	it('returns correct logs for a status', async () => {
		const res = await request({
			url: `http://localhost:${config.port}/log`,
			qs: {
				status: 200,
			},
			method: "GET",
			json: true
		});
		res.should.deepEqual([
			'2020-01-01T00:06:44.169Z Response 200 sent to 111.94.139.169 for /projects',
			'2020-01-02T00:08:16.068Z Response 200 sent to 213.174.243.73 for /home'
		])
	});

	it('returns correct logs for an ip', async () => {
		const res = await request({
			url: `http://localhost:${config.port}/log`,
			qs: {
				ip: "111.94.139.169",
			},
			method: "GET",
			json: true
		});
		res.should.deepEqual([
			'2020-01-01T00:06:33.312Z Request received from 111.94.139.169 for /projects',
			'2020-01-01T00:06:44.169Z Response 200 sent to 111.94.139.169 for /projects',
			'2020-01-01T00:06:57.169Z Response 500 sent to 111.94.139.169 for /projects'
		])
	});

	it('returns correct logs for an ip', async () => {
		const res = await request({
			url: `http://localhost:${config.port}/log`,
			qs: {
				route: "home",
			},
			method: "GET",
			json: true
		});
		res.should.deepEqual([
			'2020-01-02T00:07:47.432Z Request received from 213.174.243.73 for /home',
			'2020-01-02T00:08:16.068Z Response 200 sent to 213.174.243.73 for /home'
		])
	});

	it('returns correct logs between a timeframe for a status', async () => {
		const res = await request({
			url: `http://localhost:${config.port}/log`,
			qs: {
				timestampFrom: "2020-01-01T00:00:33.312Z",
				timestampTo: "2020-01-02T00:00:00.000Z",
				status: 500
			},
			method: "GET",
			json: true
		});
		res.should.deepEqual([
			'2020-01-01T00:06:57.169Z Response 500 sent to 111.94.139.169 for /projects'
		])
	});

	it('returns correct logs between a timeframe for a status, ip and route', async () => {

		const res = await request({
			url: `http://localhost:${config.port}/log`,
			qs: {
				timestampFrom: "2020-01-01T00:00:33.312Z",
				timestampTo: "2020-01-02T00:00:00.000Z",
				status: 500,
				ip: "111.94.139.169",
				route: "projects"
			},
			method: "GET",
			json: true
		});
		res.should.deepEqual([
			'2020-01-01T00:06:57.169Z Response 500 sent to 111.94.139.169 for /projects'
		])
	})
});
