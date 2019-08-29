import { SOUND_CREDITS, SOUND_PIXELS, SOUND_CONSOLE_SENT, SOUND_CONSOLE_RECEIVE } from "./GenericSounds";

export default class SoundManager {
    _credits: HTMLAudioElement;
    _pixels: HTMLAudioElement;
    _consoleSent: HTMLAudioElement;
    _consoleReceive: HTMLAudioElement;

    constructor() {
        this._credits = new Audio(SOUND_CREDITS);
        this._pixels = new Audio(SOUND_PIXELS);
        this._consoleSent = new Audio(SOUND_CONSOLE_SENT);
        this._consoleReceive = new Audio(SOUND_CONSOLE_RECEIVE);
    }
    
    playCreditsSound() {
        this._credits.play().then(_ => { }).catch(error => {});
    }

    playPixelsSound() {
        const playPromise = this._pixels.play().then(_ => { }).catch(error => {});
    }

    playConsoleSentSound() {
        const playPromise = this._consoleSent.play().then(_ => { }).catch(error => {});
    }

    playConsoleReceiveSound() {
        const playPromise = this._consoleReceive.play().then(_ => { }).catch(error => {});
    }
}