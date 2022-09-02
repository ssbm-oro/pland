<svelte:head>
    <title>pland</title>
    <meta name="A Link to the Past Randomizer Plando Seed Rolling App">
</svelte:head>

<h1>about pland</h1>
<p>
    pland is a tool for creating ALTTPR plando seeds.
</p> 
<p>
    What is an ALTTPR seed? 
    Check out <a class="text-primary-500" href='https://alttpr.com/en/start'>the main website</a> 
    for basic informaiton if you're not familiar with ALTTPR.
</p>
<p>
    What is a plando seed? A plando seed is a competitive mode for ALTTPR
    where players have the option to secretly plant several items before the
    seed is randomized.
</p>
<p>
    What is here? How does it work? So far there are two main features in place.
    The <a class="text-primary-500" href="/lobby">lobbies</a> allow you to log in via Discord and secretly submit plants, like
    in a plando race. It won't roll seeds, here we're mainly testing the basic functionalities
    like logging in and out, creating and deleting lobbies, joining and leaaving a lobby, 
    submitting and resetting plants, etc. It will still let you submit plants and
    check the logic in them, so please let me know if you discover any bugs with that too.
</p>
<p>
    The second main feature is the logic test. Here, you can submit plants
    as if you were generating a solo plando seed. This is mainly an easy way to 
    test the logic as I've implemented it and see intuitively if there are any major
    mistakes. It could become a tool for generating plando seeds on its own,
    or something else like a tool for teaching/learning the logic.
</p>
<p>
    Okay but how does it work? Ok so a 'plant' consists of an <i>Item</i> and a
    <i>location</i>. You'll have 1-2 item and location selectors in the lobby and
    an unlimited number in the logic test. When you select an item, the location list
    is filtered to remove locations that item <i>absolutely cannot go by itself</i>.
    If you select a location first, the item selector list is <i>not</i> filtered.
    Please give me feedback on this design.
</p>
<p>
    The individual plants aren't checked against each other until you either click
    the submit button or the check plants button. The process for checking a list of
    plants is the follows: We start off with a full inventory and a world with
    all empty locations. We go through each item, and see 1. can it go in the assigned
    location? (this test should always pass, unless the user something naughty) 2.
    Put the item in the location and remove it from our inventory. Check to see if
    we can still access the location. 3. Once we've placed all the items successfully,
    we then check to see if the Medallions are placeable, whether Aga1 is beatable,
    how many crystals are obtainable without entering GT, and how many pendants are
    placeable without accessing the Master Sword Pedestal.
</p>