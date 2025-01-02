
class Agent {
    constructor() {
        this.o;
        this.rel = new Array(L).fill(0);;
        this.rec = new Array(L).fill(0);;

        let k = 0;
        while (k < s) {
            let index = int(random(L));
            if (this.rel[index] == 0) {
                this.rel[index] = 1;
                this.rec[index] = k + 1;
                k++;
            }
        }
        this.getOpinion();
    }

    getOpinion() {
        let sum = 0;
        for (let k = 0; k < L; k++) {
            sum += a[k] * this.rel[k];
        }
        sum /= s;
        this.o = sum;
    }

    getSimilarity(other) {
        return 0.5 * (2 - abs(this.o - other.o));
    } 


}