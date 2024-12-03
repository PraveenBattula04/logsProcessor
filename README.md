Instructions
->  run logsReader.js file using 'node logsReader.js' in command
->  data will be stored in logs.json file
->  start http server in script.js file using 'node script.js' command 
->  index.html file in chrome or availble browser to dispaly records
->  for errors use localhost:9000/errorLogs Api to get the number of counts

Assumptions:
if timestap at start then assuming it as command from user
if timestamp at end considered it as error
MALFORMED_LOG_ENTRY or single line string which doestnot consists timestamps or if it is not a json object line skipped
line starts with json object considerd as Main data and will be shown on html.