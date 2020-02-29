const logController = require('../controllers/logController');


module.exports = function (app) {
	app.get('/log', async (req, res) => {
		try {
			const {status, route, ip, timestampFrom, timestampTo} = req.query;
			const result = await logController.parseLogs({status, route, ip, timestampTo, timestampFrom});
			res.send(200, result);
		} catch (err) {
			console.log({err}, "error in parsing logs");
			res.send(500, {message: "Something went wrong"})
		}
	});
};