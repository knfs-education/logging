const express = require('express');
const { createLogger, transports, format } = require('winston');

const app = express();
const port = 3002;

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp(),
		format.json()
	),
	transports: [
		new transports.Console()
	],
});

app.use((req, res, next) => {
	logger.info(`Request to ${req.url}`);
	next();
});

app.get('/', (req, res) => {
	logger.info('Hello, world!');
	res.send('Hello, world!');
});

app.get('/error', (req, res) => {
	logger.error('This is an error message!');
	res.status(500).send('Error occurred!');
});

app.listen(port, () => {
	logger.info(`App is running on http://localhost:${port}`);
});
