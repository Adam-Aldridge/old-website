

class Element {

    constructor(initial, bfNumber, inputs, loc){
        this.state = initial; // or 1
        this.inputIndices = inputs; // list of the indices that correspont to other elements in the list that are inputs to this one
        this.bfNum = bfNumber; // number of ON (1) inputs required for activation
        this.location = loc;
        this.d = 20
        this.permutations = [];
        this.outputs = [];
        this.generateBoolFinction();



    }



    display(){ 
        if (this.state == 0) {
            fill(255)
        } else {
            fill(0)
        }
        stroke(0);
        ellipse(this.location.x, this.location.y, this.d, this.d);
    }
    
    checkMouse(){
        let proxy = dist(this.location.x, this.location.y, mouseX, mouseY);
        if (proxy < this.d/2){
            this.state = int(!this.state);
        }
    }
        
    


    generateBoolFinction(){
        // randomly assignes boolean outputs to each of the 2^k potential inputs
        for (let i = 0; i < 2**K; i++){
            this.outputs.push(random([0,1]));
        }
    }

    boolFunction(allStates){
        // get inputs from ordered input indices
        let input = "";
        for (let index of this.inputIndices){
            input += str(allStates[index]);
        }
        // compares input to perturbations
        for (let i = 0; i < permutations.length; i++){
            if (input == permutations[i]){
                // update state
                this.state = this.outputs[i];
                break
            }
        }
        
        
        




    // generate all perturbations


       // if the number of posative inputs is at least the bfNumber, state = 1 else 0 


   }


}