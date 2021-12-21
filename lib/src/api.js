
const dgram = require('dgram');
const path = require('path')
const socket = dgram.createSocket('udp4');

const StaticData = require("./staticData");
const GameData = require("./gameData");
const UdpParser = require('./pcars/udp-parser');

const parser = new UdpParser(path.join(__dirname, '../definitions/SMS_UDP_Definitions.hpp'));

const Crash = require("./effects/crash");
const Engine = require("./effects/engine");
const Gear = require("./effects/gear");
const GearWheel = require("./effects/gearwheel");
const GForce = require("./effects/gForce");

class Api {
    constructor(tactPlay, config) {
        this.tactPlay = tactPlay
        this.config = config
        this.gearLast = 112
        this.crashTotal = 0
        this.state = true
        this.effects = []
        this.static = new StaticData()
        this.initializeEffects()
    }

    initializeEffects() {
        this.effects = []

        const effectClass = {
            crash: Crash,
            engine: Engine,
            gear: Gear,
            gearwheel: GearWheel,
            gforce: GForce
        }
        
        for (const [name, effect] of Object.entries(this.config.effects)) {
            effect.enable && this.effects.push(new (effectClass[name])(this.tactPlay, {
                intensity: effect.intensity,
                duration: effect.duration
            }))
        }
    }

    setEffectsSetting(settings) {
        this.config.effects = settings

        this.initializeEffects()
    }

    setEffectSetting(name, options) {
        this.config.effects[name] = {
            ...this.config.effects[name],
            ...options
        }

        this.initializeEffects()
    }

    request() {
    
        socket.on('message',(msg,info) =>{
            let json = parser.pushBuffer(msg) 

            const gameData = new GameData(json,this.static)
            
            this.effects.forEach((effect) => {
                effect.handle(gameData)
            })
        });
        
        socket.bind(5606);
    }
}

module.exports = Api