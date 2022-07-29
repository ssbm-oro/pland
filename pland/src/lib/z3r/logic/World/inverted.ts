import type { Config } from "../config";
import World from "../world";

export default class Inverted extends World {
    override inverted = true;
    
    public constructor (config:Config, messages: string[]|null = null) {
        super(config)
    }
    
}