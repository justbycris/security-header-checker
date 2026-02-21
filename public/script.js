const log = console.log; 
let userURL = document.getElementById('urlInput'); 
let checkBTN = document.getElementById('checkBtn'); 
let errorMsg = document.getElementById('error-msg'); 
let serverErr = document.getElementById('server-err')
let results = document.getElementById('results');
let resultsURL = document.getElementById('summary-url');
let resultsIP = document.getElementById('results-ip');
let score = document.getElementById('results-score'); 



//Validation - if input value is empty throw an error 
function validateUserInput(userValue){
    validInput = false;
    if(!userValue){
        userURL.style.border = '1px solid red';
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Please enter a URL...'
        results.style.display = 'none';
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
}

// UI - display results 
function displayResultsUI(response){
    //Review
    userURL.style.border = '4px solid green'
    results.style.visibility = 'visible';
    resultsIP.innerText = response.ip;
    resultsURL.innerText = `URL: ${userURL.value}`;
    score.innerText = response.analysis.score;
    //Results details
 
}

//UI - Show error if needed
function logError(code, error){
    serverErr.innerText = `${code}: ${error}`;
    serverErr.style.display = 'block'
    userURL.style.border = '1px solid red';
}


//SCAN URL button event listener
checkBTN.addEventListener('click', async () => {
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

        console.log(response.data);
        return response;
    } catch (error) {
        //Server ERROR and UI error
        logError(error.code, error.message)
        console.error(error);
    }

})
