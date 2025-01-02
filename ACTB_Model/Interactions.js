
function selectPair() {
    let probDist = new Array(N).fill(0);
    let intDist = new Array(N).fill(0);
    
    let sum = 0;
    i = int(random(N));
    // fill array with similarity values to the power h
    for (let k = 0; k < N; k++) {
        if (k == i) {
            probDist[k] = 0;
        } else {
            let simPowH = pow(agents[i].getSimilarity(agents[k]), h);
            
            probDist[k] = simPowH;
            sum += simPowH;
        }
    }
    
    // Normalize probability distribution and multiply by a factor of 1 million
    for (let k = 0; k < N; k++) {
        probDist[k] /= sum;
        probDist[k] *= 100000;
        intDist[k] = round(probDist[k]);
    }
    // Selects a second agent randomly using the probability distribution
    
    j = weightedChoice(intDist);
}


function weightedChoice(intDist) {
    // Creates an array where elements show up in differing numbers
    let bag = [];
    for (let k = 0; k < intDist.length; k++) {
        for (let m = 0; m < intDist[k]; m++) {
            bag.push(k);
        }
    }
    let index = int(random(bag.length));
    let choice = bag[index];
    return choice;
}


function interact() {
    
    // Chose one of js relevant arguments at random
    let jArgs = [];
    for (let k = 0; k < L; k++) {
        if (agents[j].rel[k] == 1) {
            jArgs.push(k);
        }
    }
    let index = jArgs[int(random(s))];
    let iCorresponding = agents[i].rel[index];
    // If the chosen argument was not prior relevant to i
    if (iCorresponding == 0) {
        agents[i].rel[index] = 1;
        // Set argument recency to s+1
        agents[i].rec[index] = s + 1;
        // Reduce all no zero recencies by 1
        for (let k = 0; k < L; k++) {
            if (agents[i].rec[k] == 0) {
                continue;
            } else if (agents[i].rec[k] == 1) {
                agents[i].rec[k] = 0;
                agents[i].rel[k] = 0;
            } else {
                agents[i].rec[k] -= 1;
            }
        }
    }
    // If the chosen argument was already relevant to i
    else {
        let prevRecency = agents[i].rec[index];
        agents[i].rec[index] = s + 1;
        for (let k = 0; k < L; k++) {
            if (agents[i].rec[k] == 0) {
                continue;
            } else {
                if (agents[i].rec[k] > prevRecency) {
                    agents[i].rec[k] -= 1;
                }
            }
        }
    }
    // Updates agent opinions
    agents[i].getOpinion();
    agents[j].getOpinion();
}