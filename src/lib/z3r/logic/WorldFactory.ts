import type Config from "./Config";
import Inverted from "./World/Inverted";
import Open from "./World/Open";
import Retro from "./World/Retro";
import Standard from "./World/Standard";

export default class WorldFactory {
    public static createWorld(config: Config) {
        switch(config.mode) {
            case 'open':
                return new Open(config);
            case 'inverted':
                return new Inverted(config);
            case 'retro':
                return new Retro(config);
            case 'standard':
            default:
                return new Standard(config);
        }
    }
}