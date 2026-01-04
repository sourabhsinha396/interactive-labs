# Pull Images if required
```
docker pull python:3.12-alpine

# Pull Node.js (JavaScript)
docker pull node:20-alpine

# Pull Java (if you want to support Java)
docker pull openjdk:17-alpine
```


# Test Python
curl -X 'POST' \
  'http://127.0.0.1:8000/api/v1/code/execute' \
  -H 'Content-Type: application/json' \
  -d '{
  "code": "print(\"Hello, World!\")",
  "language": "python"
}'

# Test with input
curl -X 'POST' \
  'http://127.0.0.1:8000/api/v1/code/execute' \
  -H 'Content-Type: application/json' \
  -d '{
  "code": "name = input()\nprint(f\"Hello, {name}!\")",
  "language": "python",
  "stdin": "Sourabh"
}'

# Test JavaScript
curl -X 'POST' \
  'http://127.0.0.1:8000/api/v1/code/execute' \
  -H 'Content-Type: application/json' \
  -d '{
  "code": "console.log(\"Hello from Node.js!\")",
  "language": "javascript"
}'