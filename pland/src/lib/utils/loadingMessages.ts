const loading_messages = [
    `I hope you're happy with your choices`,
    `Breaking the logic`,
    `Setting SFX Shuffle to 'ON'`,
    `What would Daaanty do?`,
    `Eat your vegetables`,
    `Why is that there?`,
    `Plandosonic Bluray`,
    `Oh yeah, that's the spot`,
    `Oops, all dungeons!`,
    `oro, delete this message before the tournament starts`,
    `Filling sphere one with garbage`,
    `Start deciding who to blame for this seed`,
    `Somebody once told me this seed was gonna troll me`,
    `Buffering`,
    `heck`,
    `Are you pondering what I'm pondering?`,
    `Deleting the boots from every seed.`,
    `Bribing the racing council`,
    `Trying my best`,
    `Out drinking with Lazy Kid`,
    `Fun fact: Nothing is ever in spiral cave.`,
    `Thinking up Blind puns`,
    `Thanks for dropping in. The first passengers on a hot air balloon were a sheep, a duck, and a rooster.`,
    `pland.resources.loading.silly_loading_messages[17]`,
    `Don't forget to free the chickens`
];

export function get_loading_message() {
    return loading_messages[Math.floor(Math.random() * loading_messages.length)] || '';
}