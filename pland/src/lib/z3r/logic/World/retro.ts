import type { Config } from "../config";
import World from "../world";

export default class Retro extends World {
    public constructor (config:Config, messages: string[]|null = null) {
        super(config)
    }
}