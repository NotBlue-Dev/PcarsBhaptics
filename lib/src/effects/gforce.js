class GForce {
    constructor(tactPlay, options) {
        this.tactPlay = tactPlay
        this.options = options
    }

    handle(gameData) {  
        let local = gameData.localAcc;
        let top = Math.round(local[2]); // plus c bas plus c fort devant
        let left = Math.round(local[0]);  //plus c haut plus c a gauche (avant et arriere)
        let gForce = Math.sqrt(Math.pow(local[0],2)+Math.pow(local[1],2)+Math.pow(local[2],2)) / 9.80665; //intensité vibration

        let newForce = this.options["intensity"]*gForce*0.2

        if(newForce < 0.2) newForce = 0.2;
        if(newForce > 5) newForce = 5;

        let newOptions = {intensity:newForce, duration:this.options['duration']}
        
        let negForce = Math.abs(this.options["intensity"]*gForce*0.1)

        if(negForce < 0.2) negForce = 0.2;
        if(negForce > 5) negForce = 5;

        let negOptions = {intensity:negForce, duration:this.options['duration']}

        if(top != 0 && Math.sign(top) == 1) {
            this.tactPlay.playEffect('back',newOptions)
        } else if (top != 0) {
            this.tactPlay.playEffect('front',negOptions)
        }

        if(left != 0 && Math.sign(left) == 1) {
            this.tactPlay.playEffect('right',newOptions)
        } else if (left != 0) {
            this.tactPlay.playEffect('left',negOptions)
        }
    }
}

module.exports = GForce