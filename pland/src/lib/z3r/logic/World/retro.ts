import type Config from "../Config";
import Open from "./Open";

export default class Retro extends Open {
    public constructor (config:Config, messages: string[]|null = null) {
        super(config, messages);
    }
}