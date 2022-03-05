require('dotenv').config();
const axios = require('axios');
const express = require('express');
const client_id= process.env.ZOHO_CLIENT_ID
const client_secret= process.env.ZOHO_SECRET
const path = require('path');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/user', (req, res) => {
  res.send(req.query.user)
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=${client_id}&scope=AaaServer.profile.Read&redirect_uri=http://localhost:3000/oauth-callback&prompt=consent`,
  );
});

app.get('/oauth-callback', async (req, res) => {
  const code=req.query.code
  const mytoken = await axios
    .post(`https://accounts.zoho.in/oauth/v2/token?client_id=${client_id}&grant_type=authorization_code&client_secret=${client_secret}&redirect_uri=http://localhost:3000/oauth-callback&code=${code}`)
    .then(_res => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      return token;
    })
    .catch((err) => res.status(500).json({ err: err.message }));
  const user = await axios.get('https://accounts.zoho.in/oauth/user/info', {
    headers: {
      Authorization: 'Bearer ' + mytoken
    }
   }).then(data => data.data).catch(err => console.log(err))
   console.log('user info is : ',user);
   res.send(user);
   //res.redirect('/')
});


app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');

