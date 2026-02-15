const express = require('express')
const cors = require('cors')
const axios = require('axios')
const dns = require('dns');
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
    log('Step 1: Fetching headers from:', userURL);
  } catch (error){
    return res.json({ error: 'Invalid URL'})
  }

  //Analyze userURL headers 
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
    if(headers[header.name]){
      score += header.points; 
      results.push({ header: header.display, status: 'present'})
    } else {
      results.push({ header: header.display, status: 'missing'})
    }
  })
  log('Step 2: Headers fetched successfully');
  return { score, results };
}

async function checkAPI(url){
  log('Step 3: Looking up DNS for:', userURL);
  const hostURL = new URL(url);

  // Setting options for dnsPromises.lookup() method
    const options = {
        // Setting family as 6 i.e. IPv6
        hints: dns.ADDRCONFIG | dns.V4MAPPED,
    };

    const result = await dns.promises.lookup(hostURL.hostname, options)
    log(`API RESULTS: ${result}`)
    return result.address;
}

  // 3. Try/catch block
    try {
        const response = await axios.get(userURL);
        log(`Response: ${response.headers}`);
        
        const analysis = analyzeHeaders(response.headers);
        
        const urlIP = await checkAPI(userURL)
        log('Step 4: DNS lookup successful:', urlIP);
        res.json({
          analysis: analysis,
          ip: urlIP
        })
      } catch (error) {
        log('ERROR DETAILS:', error.message); // This is key!
        log('Error stack:', error.stack); 
        return res.status(500).json({ error: 'Failed to fetch headers from that URL' })
}

//Analyze Headers Function
  // 4. Handle errors

})

//Port
// app.listen(PORT, () => {
//     log(`Server running on http://localhost:${PORT}`);
// })


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;  