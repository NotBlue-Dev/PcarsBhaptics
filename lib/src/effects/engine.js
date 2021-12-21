class Engine {
    constructor(tactPlay, options) {
        this.tactPlay = tactPlay
        this.options = options
    }

    handle(gameData) {
        if (gameData.speed <10 && gameData.throttle !== 0) {
            let newEngine = Math.abs(this.options["intensity"]*Math.round((gameData.throttle*0.1)/5))
            if(newEngine < 0.2) newEngine = 0.2;
            if(newEngine > 5) newEngine = 5;
            
            let newOptions = {intensity:newEngine, duration:this.options['duration']}

            this.tactPlay.playEffect('leftSec',newOptions)
            this.tactPlay.playEffect('rightSec',newOptions)
        }
    }
}

module.exports = Engine