'use strict';

/*
    Constants
*/

const SEARCH_FIELD_CONTAINER = document.getElementById('search-field-container');
const SEARCH_FIELD           = document.getElementById('search-field');

/*
    Variables
*/

let searchDatabase = [];

let searchQuery = '';
let currentSuggestions = [];

/*
    Functions
*/

function setUpSearchDatabase(entries) {
    
    searchDatabase = entries;
    
    randomPlaceholderLoop();
    
}

function suggest() {
    
    let newQuery = SEARCH_FIELD.value;
    
    if (newQuery === '') {
        
        currentSuggestions = [];
        
    } else {
        
        if ((currentSuggestions.length === 0) || (newQuery.length < searchQuery.length)) {
            currentSuggestions = searchDatabase;
        }
        
        currentSuggestions = currentSuggestions.filter(suggestion =>
            new RegExp(newQuery.split('').map(char => `${char}.*`).join(''), 'i').test(suggestion));
        
    }
    
    searchQuery = newQuery;
    
}

function showSuggestions() {
    
    clearSuggestions();
    
    currentSuggestions.slice(0, 5).forEach((suggestion, i) => {
        
        const P = document.createElement('P');
        
        P.innerHTML = suggestion;
        
        P.addEventListener('mouseover', event => {
            
            clearCandidate();
            
            P.dataset.candidate = '';
            
        });
        
        P.addEventListener('click', event => {
            chooseCandidate();
        });
        
        if (i === 0) {
            P.dataset.candidate = '';
        }
        
        SEARCH_FIELD_CONTAINER.appendChild(P);
        
    });
    
}

function clearSuggestions() {
    
    const CHILDREN = SEARCH_FIELD_CONTAINER.children;
    
    while (CHILDREN.length > 1) {
        
        SEARCH_FIELD_CONTAINER.removeChild(CHILDREN[CHILDREN.length - 1]);
        
    }
    
}

function getCandidate() {
    
    for (let suggestion of Array.from(SEARCH_FIELD_CONTAINER.children).slice(1)) {
        if ('candidate' in suggestion.dataset) {
            return suggestion;
        }
    }
    
}

function clearCandidate() {
    
    const CANDIDATE = getCandidate();
    
    if (CANDIDATE !== undefined) {
        delete CANDIDATE.dataset.candidate;
        return CANDIDATE;
    }
    
}

function chooseCandidate() {
    
    const CANDIDATE = clearCandidate();
    
    if (CANDIDATE !== undefined) {
        
        SEARCH_FIELD.value = CANDIDATE.innerHTML;
        
        clearSuggestions();
        
    }
    
    const COUNTRY = countries.find(country =>
        country.name.toLowerCase() === SEARCH_FIELD.value.toLowerCase());
    
    if (COUNTRY !== undefined) {
        
        focusOnCountry(COUNTRY.country);
        
        showCountryStatistics(COUNTRY.country);
        
        updateTimeline(groupByYear(meteoriteData.filter(d => d.country === COUNTRY.country)));
        
    }
    
}

function randomPlaceholderLoop() {
    
    function typeCharLoop(string) {
        
        if (string.length > 0) {
            
            SEARCH_FIELD.placeholder += string[0];
            
            setTimeout(() => {
                typeCharLoop(string.slice(1));
            }, 50 + Math.floor(Math.random() * 200));
            
        } else {
            
            setTimeout(() => {
                eraseCharLoop();
            }, 1500);
            
        }
        
    }
    
    function eraseCharLoop() {
        
        SEARCH_FIELD.placeholder =
            SEARCH_FIELD.placeholder.slice(0, SEARCH_FIELD.placeholder.length - 1);
        
        setTimeout(() => {
            
            if (SEARCH_FIELD.placeholder.length > 0) {
                eraseCharLoop();
            } else {
                typeNewPlaceholder();
            }
            
        }, 100);
        
    }
    
    function typeNewPlaceholder() {
        
        typeCharLoop(searchDatabase[Math.floor(Math.random() * searchDatabase.length)]);
        
    }
    
    typeNewPlaceholder();
    
}

/*
    Event Listeners
*/

SEARCH_FIELD.addEventListener('input', event => {
    
    suggest();
    showSuggestions();
    
    /*if (SEARCH_FIELD.value === '') {
        
        backToGlobalView();
        
    }*/
    
});

SEARCH_FIELD.addEventListener('keypress', event => {
    
    switch (event.keyCode) {
        
        case KEYCODES.ENTER:
            chooseCandidate();
            break;
        
    }
    
});

SEARCH_FIELD.addEventListener('keydown', event => {
    
    const CANDIDATE = getCandidate();
    
    if (CANDIDATE !== undefined) {
        
        switch (event.keyCode) {
            
            case KEYCODES.ARROW_RIGHT:
            case KEYCODES.TAB:
                chooseCandidate();
                break;
            
            case KEYCODES.ARROW_UP:
                if (CANDIDATE.previousElementSibling !== SEARCH_FIELD) {
                    clearCandidate();
                    CANDIDATE.previousElementSibling.dataset.candidate = '';
                }
                break;
            
            case KEYCODES.ARROW_DOWN:
                if (CANDIDATE.nextElementSibling !== null) {
                    clearCandidate();
                    CANDIDATE.nextElementSibling.dataset.candidate = '';
                }
                break;
            
        }
        
        event.stopPropagation();
        
    }
    
    if (event.keyCode === KEYCODES.ESC) {
        clearSuggestions();
        SEARCH_FIELD.value = '';
        backToGlobalView();
    }
    
});
