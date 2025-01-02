
function cleanArray() {
    // Removes any repeated words, capital letters, and whitespace
    let cleanArray = [];
    for (let word of spellings) {
        // Make lower case and trim whitespace
        let wordLower = word.toLowerCase().trim();
        // Checks for repetitions
        if (cleanArray.includes(wordLower) || wordLower == "") {
            continue;
        }
        cleanArray.push(wordLower);
    }
    spellings = cleanArray;
}


function suffleArray() {
    // Randomly orders word array
    shuffle(spellings, true);
}


function setUpLevels() {
    // Partitions the array of words into an array of short levels
    let levelSize = 5;
    let tempLevel = []
    for (let i = 0; i < spellings.length; i++) {
        tempLevel.push(new Word(spellings[i]));
        if (tempLevel.length == levelSize) {
            // Start building next level
            levels.push(tempLevel)
            tempLevel = []
        }
        if (i == spellings.length - 1) {
            break;
        }
    }
}


function updateWordValues() {
    // Updates the share and last encountered values for each word in the level
    // Update last encountered values
    for (let word of currentLevel) {
        if (word == currentWord) {
            word.lastEncountered = 0;
        } else {
            word.lastEncountered++
        }
    }
    // Update share values
    for (let word of currentLevel) {
        if (word.share != 0) {
            word.share = word.toPass + 2 * word.lastEncountered;
        } else {
            word.share = 0;
        }
    }
}


function chooseNextWord() {
    let selectionBag = [];
    for (let word of currentLevel) {
        let n = word.share;
        for (let i = 0; i < n; i++) {
            selectionBag.push(word);
        }
    }
    currentWord = random(selectionBag);
}


function checkLevelCompletion() {
    let sum = 0;
    for (let word of currentLevel) {
        sum += word.toPass;
    }
    if (sum == 0) {
        levelIndex ++;
        currentLevel = levels[levelIndex];
        if (levelIndex == levels.length - 1) {
            print("well done");
            // Game Completed
        }
    }

}