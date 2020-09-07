const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterButton = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

//Show loading
function loading() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

//Hide loading
function complete() {
    if(!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

//Get quote from API
function getQuotes() {
    loading();
    fetch('https://type.fit/api/quotes')
    .then(validateResponse)
    .then(readResponseAsJSON)
    .then(printResult)
    .catch(Error);
}

function validateResponse(response) {
    if(!response.ok) {
        console.log(response)
    }
    return response;    
}

function readResponseAsJSON(response) {
    return response.json();
}

function printResult(result) {
    //get random number
    function getRandomInt(min, max) {
        min = Math.ceil(1);
        max = Math.floor(result.length);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }    
    //reduce font size for long quotes
    if(result[getRandomInt()].text.length > 50) {
        quoteText.classList.add('long-quote');
    } else {
        quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = result[getRandomInt()].text;
    //if author is blank, add unknown
    if(result[getRandomInt()].author === null ||result[getRandomInt()].author  === '' ||result[getRandomInt()].author === 0 ) {
        authorText.innerText = 'Unknown';
        console.log('yes')
    } else {
        authorText.innerText = result[getRandomInt()].author;
    }
    //stop loader, show quote
    complete();  
    //print random quote and author
    // console.log(result[getRandomInt()].author)
    // console.log(result[getRandomInt()].text)
}

//Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

//Event listeners
newQuoteBtn.addEventListener('click', getQuotes);
twitterButton.addEventListener('click', tweetQuote);


//On load
getQuotes();

