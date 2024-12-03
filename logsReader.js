const fs = require('fs');
const util = require('util');
const path = require('path')
const readFile = util.promisify(fs.readFile);

async function logParser() {
    const filePath = path.join(__dirname, 'assignment_prod.log');
    const resp = await readFile(filePath, { encoding: 'utf-8' })
        .then((data) => {
            const ar = []
            const result = data.split('\n')
            for (let i = 0; i < result.length; i++) {
                try {
                    result[i] = JSON.parse(result[i])
                    result[i]['mainData'] = true
                } catch (err) {
                    // errors and commands list based on timestamp arrival on single lines
                    try {
                        let temp = result[i].replace('\r', '').split(' ')
                        if (temp && temp[temp.length - 1] && (!isNaN(new Date(temp[temp.length - 1])))) {
                            let timestamp = temp.pop()
                            temp = temp.join(' ')
                            result[i] = { errorMessage: parseLogString(temp), timestamp, isError: true }
                        } else if (temp && temp[0] && (!isNaN(new Date(temp[0])))) {
                            let timestamp = temp.shift();
                            temp = temp.join(' ');
                            result[i] = { userEvents: { ...parseLogString(temp), timestamp }, isCommands: true }
                        }
                    } catch (err) {

                    }
                }
                ar.push({ data: result[i] })
            }
            return ar
        })
        .catch((err) => { console.log(err) })
    return resp
}

function parseLogString(inputString) {
    const ob = {}
    try {
        if (inputString.includes('=')) {
            const pairs = inputString.split(' ');
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                if (key && value) {
                    ob[key] = value;
                }
            });
            return ob
        } else if (inputString.includes(':')) {
            const [key, value] = inputString.split(':')
            ob[key] = value
            return ob
        }
    } catch (err) {

    }
    return inputString
}

async function lol() {
    let resp = await logParser()
    const filePath = path.join(__dirname, 'logs.json');
    fs.writeFileSync(filePath, JSON.stringify(resp, null, 2));
    console.log('Logs shifted to logs.json file')
}
lol();