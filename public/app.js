let userURL = document.getElementById('urlInput'); 
let checkBTN = document.getElementById('checkBtn'); 
let errorMsg = document.getElementById('error-msg'); 
let results = document.getElementById('results')

const log = console.log; 

checkBTN.addEventListener('click', async () => {
    
    if(!userURL.value){
        errorMsg.innerText = 'Please enter a URL...'
    }

    try {
        const response = await axios.post(`http://localhost:3000/api/check-headers`, {
            url: userURL.value,
        });
        console.log(response);
    } catch (error) {
        console.error(error);
    }

})

function showResults(data){
    results.
}
