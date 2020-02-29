const {once} = require('events');
const {createReadStream} = require('fs');
const {createInterface} = require('readline');

const parseLogs = async ({status, route, ip, timestampTo, timestampFrom}) => {
	try {
		const rl = createInterface({
			input: createReadStream(config.logPath),
			crlfDelay: Infinity
		});

		const result = [];

		rl.on('line', (line) => { //read one line at a time
			//we first check if the line is in given timeframe
			const lineInTimeWindow = filterOnTimeWindow(line, timestampTo, timestampFrom, rl);
			if (lineInTimeWindow) {
				if (!status && !route && !ip) { //no other filter
					result.push(lineInTimeWindow)
				} else {
					const filteredLine = filterParams(lineInTimeWindow, status, route, ip);
					if (filteredLine) {
						result.push(filteredLine)
					}
				}
			}
		});
		await once(rl, 'close'); //stop reading file when close event is fired
		console.log('Logs processed.');
		return result
	} catch (err) {
		console.error(err);
		throw err
	}
};

const filterOnTimeWindow = (line, to, from, rl) => {
	if (!to && !from) {
		return line
	}
	if (!to) {
		to = Date.now()
	}
	if (!from) {
		from = "1970-01-01T00:00:00.000Z"
	}

	const timeFilterRegex = /(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ)/gm;
	const parseRegex = timeFilterRegex.exec(line);
	const logTimestamp = parseRegex[0];
	if (logTimestamp > to) {
		//fire close event if log timestamp exceeds param timestampTo
		//as we dont want to parse further
		rl.close();
		return
	}
	if (logTimestamp >= from && logTimestamp <= to) {
		return line
	} else {
		return null
	}
};

const filterParams = (line, status, route, ip) => {

	//use exact strings if passed in params
	//else use matching pattern
	status = status ? status : "\\d?\\d?\\d?";
	route = route ? route : ".*";
	ip = ip ? ip : "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b";

	const re = new RegExp(".* " + status + "\s?.* " + ip + " .* \/" + route + "");
	const parseRegex = re.exec(line);
	if (parseRegex) {
		return line
	}
	return null
};

module.exports = {
	parseLogs
};


