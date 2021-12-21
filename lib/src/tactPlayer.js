const api = require('./api')

class TactPlayer {
    constructor(tact, configLoader, sendEvent, listenEvent) {
        this.tact = tact
        this.configLoader = configLoader
        this.sendEvent = sendEvent
        this.listenEvent = listenEvent
        this.hapticsConnectionState = false
        this.logs = []
        this.api = new api(this.tact, this.configLoader.load())
        this.initializeListeners()
    }

    initializeListeners() {
        this.listenEvent('save-config', this.save.bind(this))
        this.listenEvent('change-setting', this.updateSetting.bind(this))
        this.listenEvent('play-effect', this.playEffect.bind(this))
        this.listenEvent('default-settings', this.setDefaultSettings.bind(this))
        this.listenEvent('get-settings', this.getSettings.bind(this))
        this.listenEvent('log', this.addLog.bind(this))
        this.listenEvent('get-data', this.getData.bind(this))
    }

    launch() {
        this.tact
            .onFileLoaded((file) => {
                this.sendEvent('tact-device-fileLoaded', file)
            })
            .onConnecting(() => {
                this.sendEvent('tact-device-connecting', {})
            })
            .onConnected((name) => {
                //sinon start 4-5 fois la boucle et send l'event plusieurs fois
                if(this.hapticsConnectionState !== true) {
                    this.hapticsConnectionState = true
                    this.sendEvent('tact-device-connected', {
                        name:name
                    })
                }
            })
            .onDisconnected((message) => {
                this.hapticsConnectionState = false
                this.sendEvent('tact-device-disconnected', message.message) }
            )
            .connect()

        this.api.request()

    }

    save() {
        this.configLoader.save(this.api.config, (err) => {
            if (err) {
                this.sendEvent('config-save-failed')
                return
            }
            this.sendEvent('config-save-success')
        })
    }

    

    updateSetting(arg) {
        const { effect } = arg

        const intensity = arg.intensity || this.api.config.effects[effect].intensity

        let enable = this.api.config.effects[effect].enable
        if (false === arg.enable || true === arg.enable) {
            enable = arg.enable
        }

        let val = parseFloat(intensity)
        val = Math.max(0.2, val)
        val = Math.min(5.0, val)
        this.api.setEffectSetting(effect, {
            intensity: val,
            enable
        })
    }

    setDefaultSettings() {
        const defaultConfig = this.configLoader.loadDefault()
        this.api.setEffectsSetting(defaultConfig)
        this.getSettings()
    }

    getSettings() {
        this.sendEvent('settings-updated', this.api.config.effects)
    }
    
    playEffect(arg) {
        
        const names  = arg.effect
        this.tact.playEffect(names, this.api.config.effects[names])
    }
    
    addLog(arg) {
        this.logs.push(arg)
    }


    getData() {
        this.sendEvent('data-updated', {
            statusHaptic: this.hapticsConnectionState,
            logs: this.logs,
        })
    }
}

module.exports = TactPlayer