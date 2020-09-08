const quoteContainer = document.getElementById('quote-container');
const favouriteContainer = document.getElementById('favourites-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterButton = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const favouriteBtn = document.getElementById('favourite')
const loader = document.getElementById('loader');
const deleteQuoteBtn = document.getElementById('delete-quote');

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

//delete the quote from local storage
function deleteQuoteLocalStorage() {
    console.log('delete')
}
//Save Quote to local Storage
function saveQuoteLocalStorage() {
    let quote = `${quoteText.innerText} - ${authorText.innerText}`;
    const quotes = getQuoteLocalStorage();   
    //Add the quote into the array
    quotes.push(quote);
    //Convert array into a string and add into local storage
    localStorage.setItem( 'quotes', JSON.stringify(quotes) );
}

//Check local storage for existing favourite quotes
function getQuoteLocalStorage() {
    let quotes;
    const quotesLS = localStorage.getItem('quotes');
    //Get quotes, if null is returned then create an empty array
    if(quotesLS === null) {
        quotes = []
    } else {
        quotes = JSON.parse(quotesLS);
    }
    return quotes;
}

//Show favourite quote
function showFavourite() {
    //display favourites container
    let quote = `${quoteText.innerText} - ${authorText.innerText}`;
    //Create li
    let li = document.createElement('li');
    //insert quote into li
    li.innerHTML = `${quote} <button id="delete-quote"><i class="fas fa-trash-alt"></button></i>`
    //insert li into the DOM
    const savedQuotes = document.getElementById('saved-quotes');

    savedQuotes.appendChild(li);

    //Save to local Storage
    saveQuoteLocalStorage()
}

//Show favourite tweets on load
function showFavouriteOnLoad() {
    let quotes = getQuoteLocalStorage();
    //Loop through storage and print the quotes
    quotes.forEach(function(quote) {
        //Create li
        let li = document.createElement('li');
        //insert quote into li
        li.innerHTML = `${quote} <button><i class="fas fa-trash-alt"></button></i>`
        //insert li into the DOM
        const savedQuotes = document.getElementById('saved-quotes');
        savedQuotes.appendChild(li);
    })
}

//Event listeners
newQuoteBtn.addEventListener('click', getQuotes);
twitterButton.addEventListener('click', tweetQuote);
favouriteBtn.addEventListener('click', showFavourite);
if(deleteQuoteBtn) {
    deleteQuoteBtn.addEventListener('click', deleteQuoteLocalStorage);
}
document.addEventListener('DOMContentLoaded', showFavouriteOnLoad);


//On load
getQuotes();

