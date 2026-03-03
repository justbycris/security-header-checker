const log = console.log; 
let userURL = document.getElementById('urlInput'); 
let checkBTN = document.getElementById('checkBtn'); 
let errorMsg = document.getElementById('error-msg'); 
let serverErr = document.getElementById('server-err')
let results = document.getElementById('results');
let resultsURL = document.getElementById('summary-url');
let resultsIP = document.getElementById('results-ip');
let score = document.getElementById('score'); 
let scoreColor = document.getElementById('score-section');
let scanTime = document.getElementById('summary-time')


//Validation - if input value is empty throw an error 
function validateUserInput(userValue){
    validInput = false;
    if(!userValue){
        userURL.style.border = '1px solid red';
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Please enter a URL...'
        results.style.visibility = 'hidden';
        log('Empty user value')
        return false;
    } else {
        serverErr.style.display = 'none'
        userURL.style.border = 'none';
        errorMsg.style.display = 'none';
        errorMsg.innerText = ''
        results.style.visibility = 'hidden';
        return true;
    }
}



// UI - check if user is typing and clean css styles
function userIsTyping(input){
    input.addEventListener('input', () => {
        if(userURL.value != ''){
        userURL.style.border = 'none';
        errorMsg.style.display = 'none';
        errorMsg.innerText = ''
        }
    })
}

// UI - display results 
function displayResultsUI(response){
    //Review
    
    const d = new Date();
    scanTime.innerHTML = `<strong>Scan Time:</strong> ${d}`
    userURL.style.border = '4px solid green'
    results.style.visibility = 'visible';
    resultsIP.innerHTML = `<strong>IP Address:</strong> ${response.ip}`;
    resultsURL.innerHTML = `<strong>URL:</strong> ${userURL.value}`;
    score.innerHTML = response.analysis.score;

    log(`Score: ${response.analysis.score}`); 
    scoreUI(response.analysis.score);
    //Results details
}

//Score UI styles
function scoreUI(resultsScore)  {

    if(resultsScore <= 59){
        scoreColor.style.background = '#bd0000'; 
        scoreColor.style.color = '#ffffff'; 
        score.style.color = 'white';
      } else if(resultsScore >= 60 && resultsScore <= 70){
        scoreColor.style.background = '#ff5100';
        scoreColor.style.color = '#ffffff'; 
        score.style.color = 'white';
    } else if(resultsScore >= 70 && resultsScore < 80){
        scoreColor.style.background = '#fff23e';
        scoreColor.style.color = '#1e1e1e'; 
        score.style.color = '#1e1e1e';

    } else if(resultsScore >= 80 && resultsScore <= 90){
        scoreColor.style.background = '#a8ff3e';
        score.style.color = '#1e1e1e';
    } else if(resultsScore > 90){
        scoreColor.style.background = '#00970a';
        scoreColor.style.color = '#fff'
        score.style.color = '#ffffff'; 
   }
    log('END SCORE COLORING')
}

//UI - Show error if needed
function logError(code, error){
    serverErr.innerText = `${code}: ${error}`;
    serverErr.style.display = 'block'
    userURL.style.border = '1px solid red';
}

//SCAN URL button event listener
checkBTN.addEventListener('click', async () => {
    userURL.style.border = 'none'
    results.style.visibility = 'hidden';
    log('Cleaned past results for a new request')

    validInput = false;
    userIsTyping(userURL)
    const isValid = validateUserInput(userURL.value)
    if(!isValid){
        return;
    }

    //Fetch server response and show in the frontend 
    try {
        const response = await axios.post(`/api/check-headers`, {
            url: userURL.value
        });
        log(`Response: ${response.data}`)
        displayResultsUI(response.data)
        return response;
    } catch (error) {
        //Server ERROR and UI error
        userURL.style.border = 'none';
        results.style.visibility = 'hidden';
        logError(error.code, error.message)
        console.error(error);
    }
})
