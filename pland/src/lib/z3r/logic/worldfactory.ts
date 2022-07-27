import Inverted from "./World/inverted";
import Open from "./World/open";
import Retro from "./World/retro";
import Standard from "./World/standard";

export default class WorldFactory {
    public static createWorld(type: string, config: any) {
        switch(type) {
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