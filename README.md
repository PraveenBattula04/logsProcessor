used readFile

Assumptions:
if timestap at start then assuming it as command from user
if timestamp at end considered it as error
MALFORMED_LOG_ENTRY or single line string which doestnot consists timestamps or if it is not a json object line skipped
line starts with json object considerd as Main data and will be shown on html.