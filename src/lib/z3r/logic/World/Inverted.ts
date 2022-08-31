import type Config from "../Config";
import World from "../World";

export default class Inverted extends World {
    public constructor (config:Config, messages: string[]|null = null) {
        super(config, messages);
    }
    
}