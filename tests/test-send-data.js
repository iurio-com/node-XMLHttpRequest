var assert = require("assert")
  , XMLHttpRequest = require("../lib/XMLHttpRequest").XMLHttpRequest
  , http = require("http")
  , xhr;

// Test server
var server = http.createServer(function (req, res) {
  if (req.method != "POST") {
      res.writeHead(405, {"Content-Type": "text/plain"});
      res.end("Method not allowed");
      return;
  }
  const headers = {"Content-Type": "application/octet-stream"};
  if (req.headers["content-length"]) {
    headers["Content-Length"] = req.headers["content-length"];
  }
  res.writeHead(200, headers);
  req.pipe(res);
}).listen(8000);

// Test wrong method
xhr = new XMLHttpRequest();

var tests = ['WRONG_METHOD','SEND_TEXT','SEND_BUFFER','SEND_TYPEDARRAY','SEND_BLOB','SEND_FILE'];
var currentTest = 0;

xhr.onreadystatechange = function() {
  if (this.readyState == 4) {
    switch (tests[currentTest]) {
      case 'WRONG_METHOD':
        assert.equal(this.status, 405);

        ++currentTest;
        xhr.open("POST", url);
        xhr.send("Hello World");
        return;

      case 'SEND_TEXT':
        assert.equal(this.status, 200);
        assert.equal(this.responseText, "Hello World");

        ++currentTest;
        xhr.open("POST", url);
        xhr.send(Buffer.from("Hello World"));
        return;

      case 'SEND_BUFFER':
        assert.equal(this.status, 200);
        assert.equal(this.responseText, "Hello World");

        ++currentTest;
        xhr.open("POST", url);
        xhr.send(new Uint8Array(Buffer.from("Hello World")));
        return;

      case 'SEND_TYPEDARRAY':
        assert.equal(this.status, 200);
        assert.equal(this.responseText, "Hello World");

        ++currentTest;
        xhr.open("POST", url);
        xhr.send(new Blob([Buffer.from("Hello World")]));
        return;

      case 'SEND_BLOB':
        assert.equal(this.status, 200);
        assert.equal(this.responseText, "Hello World");

        ++currentTest;
        xhr.open("POST", url);
        xhr.send(new File([Buffer.from("Hello World")], 'test.txt'));
        return;

      case 'SEND_FILE':
        assert.equal(this.status, 200);
        assert.equal(this.responseText, "Hello World");
        server.close();
        return;

      default:
        assert.fail('Unknown state');
    }
  }
};

var url = "http://localhost:8000/";
xhr.open("GET", url);
xhr.send();
