class Gear {
    constructor(tactPlay, options) {
        this.tactPlay = tactPlay
        this.options = options
        this.gear = null
    }

    handle(gameData) {

        if(gameData.gear != 0 && gameData.gear != gameData.nGear && this.gear != gameData.nGear) {
            if(this.gear != null &&  this.gear > gameData.gear) {
                this.tactPlay.playEffect('leftGear',this.options)
                
                // gauche
            }
            if(this.gear != null && this.gear < gameData.gear) {
                this.tactPlay.playEffect('rightGear',this.options)
                // droite
            }

            this.gear = gameData.gear
        }

        
    }
}

module.exports = Gear