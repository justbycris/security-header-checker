let userURL = document.getElementById('urlInput'); 
let checkBTN = document.getElementById('checkBtn'); 
let errorMsg = document.getElementById('error-msg'); 
let serverErr = document.getElementById('server-err')
let results = document.getElementById('results');
let resultsURL = document.getElementById('summary-url');
const log = console.log; 

checkBTN.addEventListener('click', async () => {
   
    userURL.addEventListener('input', () => {
        if(userURL.value != ''){
        userURL.style.border = 'none';
        errorMsg.style.display = 'none';
        errorMsg.innerText = ''
        }
    })

    //If input value is empty throw an error 
    if(!userURL.value){
        userURL.style.border = '1px solid red';
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Please enter a URL...'
        results.style.display = 'none';
        return;
    } 
  

    //Fetch server response and show in the frontend 
    try {
        const response = await axios.post(`http://localhost:3000/api/check-headers`, {
            url: userURL.value,
        });

            log(`Response data: ${response.data}`)
            results.style.display = 'block';
            resultsURL.innerText = userURL.value;
        
        console.log(response.data);
        return response;
    } catch (error) {
        serverErr.innerText = `${error.code}: ${error.message}`;
        serverErr.style.display = 'block'
        userURL.style.border = '1px solid red';
        console.error(error);
    }

})
