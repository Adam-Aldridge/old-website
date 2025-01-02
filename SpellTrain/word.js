
class Word {
    constructor(string) {
        this.spelling = string;
        // Number of correct spellings required to pass
        this.toPass = 1; 
        // Share in the 'bag' of words to be selected at random
        this.share = 1; 
        // how manny rounds have passed without the word showing
        this.lastEncountered = 0; 
    }

    spelled = function() {
        let max = 3;
        if (this.toPass <= max) {
            this.toPass--;
        } else {
            this.toPass = max - 1;
        }
    }

    missSpelled = function() {
        this.toPass++;
    }
}