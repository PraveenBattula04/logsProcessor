const fs = require('fs');
const util = require('util');
const path = require('path')
const readFile = util.promisify(fs.readFile);

const http = require('http')
http.createServer(async (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const filePath = path.join(__dirname, 'logs.json');
    let logs = await readFile(filePath, { encoding: 'utf-8' })
    logs = JSON.parse(logs)
    if ((req.url === '/logs') && (req.method === 'POST')) {
        try {
            logs = logs.filter(e => e?.data?.mainData)
            let body = '';
            // Collect data from the request body
            req.on('data', chunk => {
                body += chunk.toString(); // Convert Buffer to string
            });
            req.on('end', () => {
                body = body ? JSON.parse(body) : body
                let { limit, page } = body
                const rangeA = (page - 1) * (limit)
                const rangeB = limit * page
                const logsCount = logs.length
                logs = logs.filter((e, index) => {
                    return rangeA <= index && index < rangeB
                })
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ logs, logsCount }));
            });
        } catch (err) {
            console.log(err)
        }
    } else if ((req.url === '/errorLogs') && (req.method === 'POST')) {
        try {
            let errors = logs.filter(e => e?.data?.isError)
            errors = errors.map(e => e.data)
            const errorLabels = [];
            const errorCounts = {};
            errors.forEach(error => {
                const message = typeof error.errorMessage === 'string' ? error.errorMessage : Object.keys(error.errorMessage)[0];
                errorCounts[message] = (errorCounts[message] || 0) + 1;
                errorLabels.push(`${message} - ${error.timestamp}`);
            });

            const labels = Object.keys(errorCounts);
            const data = Object.values(errorCounts);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ labels, data }));
        } catch (err) {
            console.log(err)
            // res.end(err)
        }
    } else {
        res.end()
    }
}).listen(9000, () => {
    console.log("Server is running on Port 9000");
})