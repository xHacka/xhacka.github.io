# My Buddy Erik

## Description

My buddy Erik wants to play Minecraft so I set up a server for us to play on. I've commited my configuration to GitHub because it's so convenient! Can you make sure that everything is secure?

[https://github.com/VikeSec/vikeCTF-2024-minecraft-server](https://github.com/VikeSec/vikeCTF-2024-minecraft-server)

## Solution

The github [commit history](https://github.com/VikeSec/vikeCTF-2024-minecraft-server/commits/main/) is not that interesting, but we do we a reverted commit: [Revert "Add RCON password"](https://github.com/VikeSec/vikeCTF-2024-minecraft-server/commit/6e429e80e1f7f8924b9b8c9c27295d8b84068480). 

![erik-1](/assets/ctf/vikectf/erik-1.png)

Since the commit has been deleted locally and uploaded to remote cloning wont give satisfactory results. We need to search github for deleted commits.

If we go to [branches](https://github.com/VikeSec/vikeCTF-2024-minecraft-server/branches) we see update 2 days ago by [malcolmseyd](https://github.com/malcolmseyd). That's weird... because commit history shows update from last week.

![erik-2](/assets/ctf/vikectf/erik-2.png)

We can dig further into this [Activity](https://github.com/VikeSec/vikeCTF-2024-minecraft-server/activity?ref=main), by going to 3 dot -> Activity.

![erik-3](/assets/ctf/vikectf/erik-3.png)

[Compare Changes: Disable Mojang telemetry](https://github.com/VikeSec/vikeCTF-2024-minecraft-server/compare/a458ca7f4d0e3b0680a809c82eaf30def9f6a136...0fae838eaeceab86a257dc5217925c2eadae77a0) (3 dots)

[Add RCON password](https://github.com/VikeSec/vikeCTF-2024-minecraft-server/commit/551a06d75f125b246a838b48dbe6a768f36b8708)
::: tip Flag
`vikeCTF{Y0u_c4N7_3rA5e_H1sT0Ry}`
:::