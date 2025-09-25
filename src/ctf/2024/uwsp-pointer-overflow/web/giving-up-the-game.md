# Giving Up The Game

## Description

I can't wait to reveal this one! I have spent the entire summer working up an awesome game called Space Adventure! It's a bullet storm arcade shooter with survival horror elements and looter shooter portions heavily inspired by classics like Qubort, Donkey King, and Street Flighter II. Except this game isn't like other games - the only way to win is to cheat! Good luck!

[Insert Quarter to Continue...](http://34.135.223.176:7845/)

## Solution

I thought the challenge was going to be playable, but it was loading forever. Inspecting the source code showed first base64 decoy string, but inspecting the network traffic we get another string, decode base64 and get flag:

![Giving Up the Game.png](/assets/ctf/uwsp/giving-up-the-game.png)

`bd` is custom powershell function to decode Base64 in **Powershell**
```powershell
# Quick Base64 Encode/Decode
function BD($base64) { [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($base64))  }
function BE($plaintext) { [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($plaintext)) }
```

::: tip Flag
`poctf{uwsp_1_7H1nk_7H3r3r0_1_4m}`
:::