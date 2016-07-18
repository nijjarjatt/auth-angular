/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jwt = require('jsonwebtoken');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//function for generating access-token for login api call (mocking for now because there is no real backend login implementation)
function generateJwtToken(userInfo) {
  return jwt.sign({
    username: userInfo.username
  }, 'Strongest Secret');
} 
// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');

    //Allow content type other than application/x-www-form-urlencoded, multipart/form-data, or text/plain
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');   
    next();
});

app.post('/api/login', function(req, res) {    
    if(req.body && req.body.username && req.body.password){
      var accessToken = generateJwtToken({username: req.body.username});
      var userInfo = {
        user: req.body.username,
        accessToken: accessToken
      };
      var response = JSON.stringify(userInfo);
      res.json(userInfo);
    }else{
      res.sendStatus(400);
    }
});

app.post('/api/logout', function(req, res) {    
    console.log('Logout Called');
    if(req.body && req.body.userToken){
      res.sendStatus(200)
    }else{
      res.sendStatus(400);
    }
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
