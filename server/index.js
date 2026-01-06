const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const log = console.log;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));



//Endpoint
app.get('/api/test', (req,res) => {
  log(req.body.url)
  res.json({ message: 'Server is running!' });
    
})


//Headers check endpoint 
app.post('/api/check-headers', async (req,res) => {
  // 1. Get URL from request body
  const userURL = req.body.url; 

  // 2. Validate URL exists
  if(!userURL){
    return res.json({ error: 'Please enter a URL'})
  } 
  try{
    new URL(userURL)
  } catch (error){
    return res.json({ error: 'Invalid URL'})
  }

  //
  function analyzeHeaders(headers) {
  let score = 0;
  const results = [];

  const securityHeaders = [
    { name: 'strict-transport-security', display: 'HSTS', points: 25 },
    { name: 'content-security-policy', display: 'CSP', points: 25 },
    { name: 'x-content-type-options', display: 'X-Content-Type-Options', points: 15 },
    { name: 'x-frame-options', display: 'X-Frame-Options', points: 15 },
    { name: 'referrer-policy', display: 'Referrer-Policy', points: 10 },
    { name: 'permissions-policy', display: 'Permissions-Policy', points: 10 }
  ];

  securityHeaders.forEach(header => {
    if(header.name){
      score += header.points; 
      results.push({ header: header.display, status: 'present'})
    } else {
      results.push({ header: header.display, status: 'missing'})
    }
  })

  return { score, results };
}

  // 3. Try/catch block
    try {
        const response = await axios.get(userURL);
        log(`Response: ${response.headers}`);
        const analysis = analyzeHeaders(response.headers);
        res.json(analysis)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch headers from that URL' })
}

//Analyze Headers Function
  // 4. Handle errors

})

//Port
app.listen(PORT, () => {
    log(`Server running on http://localhost:${PORT}`);
})