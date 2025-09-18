# Mayday!

## Description

By `hofill`

We are sinking! The nearest ship got our SOS call, but they replied in pure gobbledygook! Are ye savvy enough to decode the message, or will we be sleepin' with the fish tonight? All hands on deck!  
  
Whiskey Hotel Four Tango Dash Alpha Romeo Three Dash Yankee Oscar Uniform Dash Sierra One November Kilo India November Golf Dash Four Bravo Zero Uniform Seven  
  
Flag format: TFCCTF{RESUL7-H3R3}

## Solution

Using [Cipher Identifier](https://www.dcode.fr/cipher-identifier) from dCode we find that it's [NATO Phonetic Alphabet](https://www.dcode.fr/nato-phonetic-alphabet).

Decryption returns:

```
W H 4 T - A R 3 - Y O U - S 1 N K I N G - 4 B 0 U 7
```
::: tip Flag
`TFCCTF{WH4T-AR3-YOU-S1NKING-4B0U7}`
:::