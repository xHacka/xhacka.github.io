# Mushroom 

## Description

Mushroom | 125  points | By  `Tyler Hogan`

Wow, a game with a mushroom in it!

[Download Windows build here](https://drive.google.com/file/d/1QX4cMGFtsf1Vw5ccMnKOoVOH5AV-dbKr/view?usp=sharing)

## Analysis

We are given a game written in Unity called `ctfchallenge`. When we open the game there's no instructions or help. Character can move using `W A S D` keys, but using mouse to turn doesnt work. Left Click and Dragging also doesnt work, but crazy stuff happens with Right Click and Drag.

What is the objective? Move around to find the flag? Let's try digging into the source code.

I'm going to use [dnSpy](https://github.com/dnSpy/dnSpy) to analyze. 

The main game code should be stored inside `ctfchallenge_Data\Managed\Assembly-CSharp.dll`.

At explorer > `Assembly-CSharp > Assembly-CSharp.dll > Curly Braces > CameraMovement`

## Solution

In the snippet below are shown the changes I made to game.
1. Removed condition to check player location to display flag
2. Removed combination of keys to change `rotateSpeed`
3. Added `space` button event to move vertically
4. Added `2` button event to increase movement speed

```csharp
// CameraMovement
// Token: 0x06000002 RID: 2
private void FixedUpdate()
{
	this.flag.SetActive(true); // 1
	...
	this.rotateSpeed = 100f; // 2
	...
	if (Input.GetKey("space")) // 3
	{
		base.transform.Translate(Vector3.up * this.moveSpeed * this.shiftMultiplier * Time.deltaTime / Time.timeScale);
	}
	if (Input.GetKey("2")) // 4
	{
		this.moveSpeed += 20f;
	}
	...
}
```

![mushroom-1](/assets/ctf/bcactf/mushroom-1.png)

Flag: `bcactf{UN1Ty_f14g}`