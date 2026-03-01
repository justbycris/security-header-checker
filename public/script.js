const log = console.log; 
let userURL = document.getElementById('urlInput'); 
let checkBTN = document.getElementById('checkBtn'); 
let errorMsg = document.getElementById('error-msg'); 
let serverErr = document.getElementById('server-err')
let results = document.getElementById('results');
let resultsURL = document.getElementById('summary-url');
let resultsIP = document.getElementById('results-ip');
let score = document.getElementById('results-score'); 
let scoreColor = document.getElementById('score-section');



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
      log('CLEANING CSS STYLES INPUT')
}

// UI - display results 
function displayResultsUI(response){
    //Review
    userURL.style.border = '4px solid green'
    results.style.visibility = 'visible';
    resultsIP.innerText = response.ip;
    resultsURL.innerText = `URL: ${userURL.value}`;
    score.innerText = response.analysis.score;

    log(`Score: ${response.analysis.score}`)
    scoreUI(response.analysis.score);
    //Results details
}

//Score CSS Styles
function scoreUI(score)  {
    if(score > 50 && score < 60){
        scoreColor.style.background = 'red'
    } else if(score > 60 && score < 70){
        scoreColor.style.background = '#ff9c08'
    } else if(score > 70 && score < 80){
        scoreColor.style.background = '#ecff3e'
    } else if(score > 80 && score < 90){
        scoreColor.style.background = '#a8ff3e'
    } else if(score > 90 && score == 100){
        scoreColor.style.background = '#18E000'
    }
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
         userURL.style.border = 'none'
        results.style.visibility = 'hidden';
        logError(error.code, error.message)
        console.error(error);
    }

})
