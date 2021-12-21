class GearWheel {
    constructor(tactPlay, options) {
        this.tactPlay = tactPlay
        this.options = options
        this.last = null
    }

    handle(gameData) {
        
        let secousse = Math.sqrt(Math.pow(gameData.susHeight[0],2)+Math.pow(gameData.susHeight[1],2)+Math.pow(gameData.susHeight[2],2)+Math.pow(gameData.susHeight[3],2))*20
        if(secousse != 0) {
            let newSec = Math.abs(this.options["intensity"]*(secousse-this.last)*13)
            if(newSec < 0.2) newSec = 0.2;
            if(newSec > 5) newSec = 5;
            
            let newOptions = {intensity:newSec, duration:this.options['duration']}

            this.tactPlay.playEffect('leftSec',newOptions)
            this.tactPlay.playEffect('rightSec',newOptions)
            this.last = secousse
        }
        // let newSec = this.options["intensity"]*secousse*0.2

        // if(newSec < 0.2) newSec = 0.2;
        // if(newSec > 5) newSec = 5;
        // console.log(newSec)
    }
}

module.exports = GearWheel