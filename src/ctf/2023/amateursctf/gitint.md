# Gitint

## Gitint 5e

### Description

By `hellopir2`

One of the repos in the les-amateurs organization is kind of suspicious. Can you find all the  _real_  flags in that repository and report back? There are 3 flags total, one of which is worth 0 points. For this challenge, submit the flag with the sha256 hash  `5e60b82a7b0860b53b6f100f599a5e04d52faf1a556ea78578e594af2e2ccf7c`

### Solution

With quick google search we find the repos at <https://github.com/les-amateurs>.

With another quick (or lucky) google dork we find potentially suspisicous repo.

![gitint-5e-1](/assets/ctf/amateursctf/gitint-5e-1.png)

Looking through the commits <https://github.com/les-amateurs/more-CTFd-mods/commit/6b021f34ac009700d9239d64ac3b7b0ec2693eff>

![gitint-5e-2](/assets/ctf/amateursctf/gitint-5e-2.png)

```R
└─$ echo -n 'amateursCTF{y0u-fOunD_m3;bu7:d1D U r34L!y?}' | sha256sum           
5e60b82a7b0860b53b6f100f599a5e04d52faf1a556ea78578e594af2e2ccf7c  -
```
::: tip Flag
`amateursCTF{y0u-fOunD_m3;bu7:d1D U r34L!y?}`
:::

## Gitint 7d

### Description 

By `hellopir2`

One of the repos in the les-amateurs organization is kind of suspicious. Can you find all the  _real_  flags in that repository and report back? There are 3 flags total, one of which is worth 0 points. For this challenge, submit the flag with the sha256 hash  `7de880d63a3f2494b75286906dba179ee59cc738ea5e275094f94c5457396f48`

### Solution

Visit same github repo.

Pull requests seems intersting so let's check it out!

![gitint-7d-1](/assets/ctf/amateursctf/gitint-7d-1.png)

![gitint-7d-2](/assets/ctf/amateursctf/gitint-7d-2.png)

Hmm... Pull request #2.. Where's #1? Anyway comments are edited, click to view comment history. 

![gitint-7d-3](/assets/ctf/amateursctf/gitint-7d-3.png)

Nice, we get password, but for what?

![gitint-7d-4](/assets/ctf/amateursctf/gitint-7d-4.png)

Going back to PRs, let's try changing url manually to view PR #1.

Great! and there's a link <https://pastebin.com/VeTDwT09>

![gitint-7d-5](/assets/ctf/amateursctf/gitint-7d-5.png)

Using the password from #2 PR we get inside.

![gitint-7d-6](/assets/ctf/amateursctf/gitint-7d-6.png)
::: tip Flag
`amateursCTF{programs have issues, as do weak passwords}`
:::