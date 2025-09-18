# Vault Doors

# Vault Doors

### vault-door-training

Author: Mark E. Haase

#### Description

Your mission is to enter Dr. Evil's laboratory and retrieve the blueprints for his Doomsday Project. The laboratory is protected by a series of locked vault doors. Each door is controlled by a computer and requires a password to open. Unfortunately, our undercover agents have not been able to obtain the secret passwords for the vault doors, but one of our junior agents obtained the source code for each vault's computer! You will need to read the source code for each level to figure out what the password is for that vault door. As a warmup, we have created a replica vault in our training facility. The source code for the training vault is here: [VaultDoorTraining.java](https://jupiter.challenges.picoctf.org/static/1afdf83322ee9c0040f8e3a3c047e18b/VaultDoorTraining.java)

#### Solution

When we open java code we see `checkPassword` function, with the flag.

```java
    public boolean checkPassword(String password) {
        return password.equals("w4rm1ng_Up_w1tH_jAv4_eec0716b713");
    }
```

::: tip Flag
`picoCTF{w4rm1ng_Up_w1tH_jAv4_eec0716b713}`
:::

### vault-door-1

#### Description

This vault uses some complicated arrays! I hope you can make sense of it, special agent. The source code for this vault is here: [VaultDoor1.java](https://jupiter.challenges.picoctf.org/static/29b91e638ccbd76aaa8c0462d1c64d8d/VaultDoor1.java)

#### Solution

The `checkPassword` functions validates the password character by character, but in a weird order...

```java
public boolean checkPassword(String password) {
    return password.length()   == 32  &&
           password.charAt(0)  == 'd' &&
           password.charAt(29) == '3' &&
           password.charAt(4)  == 'r' &&
           ...
}
```

I used CyberChef to sort, extract and join the characters.

![vault-door-1-1](/assets/ctf/picoctf/vault-door-1-1.png)

RegEx pattern `'(.)'`:

* [ ] `'...'` => Look for anything inside single quotes
* [ ] `.` => To match any character
* [ ] `(.)` => To get match group

::: tip Flag
`picoCTF{d35cr4mbl3_tH3_cH4r4cT3r5_ff63b0}`
:::

### vault-door-2

_...Challenge Missing From PicoCTF..._

### vault-door-3

#### Description

This vault uses for-loops and byte arrays. The source code for this vault is here: [VaultDoor3.java](https://jupiter.challenges.picoctf.org/static/a648ca6dd275b9454c5d0de6d0f6efd3/VaultDoor3.java)

#### Solution

Password checker seems awfully hard to solve, but awfully easy to reverse the process.

```java
public boolean checkPassword(String password) {
    if (password.length() != 32) { return false; }
    
    char[] buffer = new char[32];
    int i;
    for ( i=0; i<8  ; i++ ) { buffer[i] = password.charAt(i);    }
    for (    ; i<16 ; i++ ) { buffer[i] = password.charAt(23-i); }
    for (    ; i<32 ; i+=2) { buffer[i] = password.charAt(46-i); }
    for (i=31; i>=17; i-=2) { buffer[i] = password.charAt(i);    }

    String s = new String(buffer);
    return s.equals("jU5t_a_sna_3lpm18gb41_u_4_mfr340");
}
```

Tweeking the logic a bit and modifing the function:

```java
// Online Java Compiler <https://www.programiz.com/java-programming/online-compiler/>
// Use this editor to write, compile and run your Java code online

class HelloWorld {
    public static String checkPassword() {
        String password = "jU5t_a_sna_3lpm18gb41_u_4_mfr340";
        
        char[] buffer = new char[32];
        int i;
        for ( i=0; i<8  ; i++ ) { buffer[i] = password.charAt(i);    }
        for (    ; i<16 ; i++ ) { buffer[i] = password.charAt(23-i); }
        for (    ; i<32 ; i+=2) { buffer[i] = password.charAt(46-i); }
        for (i=31; i>=17; i-=2) { buffer[i] = password.charAt(i);    }

        String flag = new String(buffer);
        return flag;
    }
 
    public static void main(String[] args) {
         System.out.printf(">>> picoCTF{%s}\n", checkPassword());
    }  
}
```

::: tip Flag
`picoCTF{jU5t_a_s1mpl3_an4gr4m_4_u_1fb380}\`
:::

### vault-door-4

#### Description

This vault uses ASCII encoding for the password. The source code for this vault is here: [VaultDoor4.java](https://jupiter.challenges.picoctf.org/static/09d3002ae349631324a17e2255ae8df2/VaultDoor4.java)

#### Solution

Each byte from `myBytes` represents [ASCII](https://www.asciitable.com) code. We can take each byte, convert it into `char` and create a flag.

```java
// https://www.programiz.com/java-programming/online-compiler/
// Online Java Compiler
// Use this editor to write, compile and run your Java code online

class HelloWorld {
    public static String checkPassword() {
        StringBuilder flag = new StringBuilder();
        byte[] flag_chars = {
            106 , 85  , 53  , 116 , 95  , 52  , 95  , 98  ,
            0x55, 0x6e, 0x43, 0x68, 0x5f, 0x30, 0x66, 0x5f,
            0142, 0131, 0164, 063 , 0163, 0137, 0143, 061 ,
            '9' , '4' , 'f' , '7' , '4' , '5' , '8' , 'e' ,
        };
        for (byte flag_char : flag_chars) { // ForEach Loop Is Cleaner
            flag.append((char) flag_char);  // Convert byte To char
        }
        return flag.toString(); // StringBuilder isn't string, so needs to be converted
    }
    
    public static void main(String[] args) {
         System.out.printf(">>> picoCTF{%s}\n", checkPassword());
    }
    
}
```

::: tip Flag
`picoCTF{jU5t_4_bUnCh_0f_bYt3s_c194f7458e}`
:::

::: info :information_source:
`myBytes` contains numbers in [different bases](https://math.libretexts.org/Courses/Mount_Royal_University/MATH_2150%3A_Higher_Arithmetic/7%3A_Numeration_systems/7.2%3A_Number_Bases), but using conversion Java takes care of it.
:::


### vault-door-5

#### Description

In the last challenge, you mastered octal (base 8), decimal (base 10), and hexadecimal (base 16) numbers, but this vault door uses a different change of base as well as URL encoding! The source code for this vault is here: [VaultDoor5.java](https://jupiter.challenges.picoctf.org/static/0a53bf0deaba6919f98d8550c35aa253/VaultDoor5.java)

#### Solution

```java
public boolean checkPassword(String password) {
    String urlEncoded = urlEncode(password.getBytes());
    String base64Encoded = base64Encode(urlEncoded.getBytes());
    String expected = "JTYzJTMwJTZlJTc2JTMzJTcyJTc0JTMxJTZlJTY3JTVm"
                    + "JTY2JTcyJTMwJTZkJTVmJTYyJTYxJTM1JTY1JTVmJTM2"
                    + "JTM0JTVmJTMwJTYyJTM5JTM1JTM3JTYzJTM0JTY2";
    return base64Encoded.equals(expected);
}
```

The code first encodes password with [URL Encoding](https://www.wikiwand.com/en/URL_encoding) and then [Base64](https://www.wikiwand.com/en/Base64). To decode we must do reverse => `Base64 Decode` -> `URL Decode`. Without diving in too much code we can utilize CyberChef again to get the flag.

![vault-door-5-1](/assets/ctf/picoctf/vault-door-5-1.png)\
::: tip Flag
`picoCTF{c0nv3rt1ng_fr0m_ba5e_64_0b957c4f}`
:::

### vault-door-6

#### Description

This vault uses an XOR encryption scheme. The source code for this vault is here: [VaultDoor6.java](https://jupiter.challenges.picoctf.org/static/cdb33ffba609e2521797aac66320ec65/VaultDoor6.java)

#### Solution

[XOR Cipher](https://www.wikiwand.com/en/XOR_cipher) is a symetric cipher, meaning plaintext can be encoded with KEY and ciphertext decoded with the same KEY. Since we know the KEY decryption is simple.

```java
// https://www.programiz.com/java-programming/online-compiler/
// Online Java Compiler
// Use this editor to write, compile and run your Java code online

class HelloWorld {
    public static String checkPassword() {
        StringBuilder flag = new StringBuilder();
        final byte KEY = 0x55;
        byte[] flag_bytes = {
            0x3b, 0x65, 0x21, 0xa , 0x38, 0x0 , 0x36, 0x1d,
            0xa , 0x3d, 0x61, 0x27, 0x11, 0x66, 0x27, 0xa ,
            0x21, 0x1d, 0x61, 0x3b, 0xa , 0x2d, 0x65, 0x27,
            0xa , 0x6c, 0x60, 0x37, 0x30, 0x60, 0x31, 0x36,
        };
        for (byte flag_byte : flag_bytes) { // Cleaner For Loop
            flag.append((char) (flag_byte ^ KEY)); // XOR -> Convert -> Append
        }
        return flag.toString();
    }
     
    public static void main(String[] args) {
         System.out.printf(">>> picoCTF{%s}\n", checkPassword());
    } 
}
```

::: tip Flag
`picoCTF{n0t_mUcH_h4rD3r_tH4n_x0r_95be5dc}`
:::

### vault-door-7

#### Description

This vault uses bit shifts to convert a password string into an array of integers. Hurry, agent, we are running out of time to stop Dr. Evil's nefarious plans! The source code for this vault is here: [VaultDoor7.java](https://jupiter.challenges.picoctf.org/static/89b8065d19ee9830ae548d27a40ca757/VaultDoor7.java)

#### Solution

The program is using [Bitwise OR](https://www.wikiwand.com/en/Bitwise_operation#OR) and [Logical Shift](https://www.wikiwand.com/en/Bitwise_operation#Logical_shift) operations to convert password to array of integers, which have been modified by operations.

This part `flag[index * 4 + i] = (char) ((flag_byte >> (8 * (3 - i))) & 0xFF)` is simply automatated loop instead of 4 lines of code.\
Important part is `(flag_byte >> (8 * (3 - i))) & 0xFF`. First reverse the shift and then mask with [Bitwise AND](https://www.wikiwand.com/en/Bitwise_operation#AND) to ensure that only the least significant byte (8 bits) is extracted.

```java
// https://www.programiz.com/java-programming/online-compiler/
// Online Java Compiler
// Use this editor to write, compile and run your Java code online

class HelloWorld {
    public static String flag() {
        char[] flag = new char[32];
        int[] flag_bytes = { 
            1096770097, 1952395366,
            1600270708, 1601398833,
            1716808014, 1734291511,
            960049251,  1681089078
        };
        int index = 0;
        for (int flag_byte : flag_bytes) {
            for (int i = 0; i < 4; i++){ 
                flag[index * 4 + i] = (char) ((flag_byte >> (8 * (3 - i))) & 0xFF);
            }
            index++;
        }
        return new String(flag); // Char Array -> String
    }
    
    public static void main(String[] args) {
        System.out.printf(">>> picoCTF{%s}\n", checkPassword());
    } 
}
```

::: tip Flag
`picoCTF{A_b1t_0f_b1t_sh1fTiNg_07990cd3b6}`
:::

### vault-door-8

#### Description

Apparently Dr. Evil's minions knew that our agency was making copies of their source code, because they intentionally sabotaged this source code in order to make it harder for our agents to analyze and crack into! The result is a quite mess, but I trust that my best special agent will find a way to solve it. The source code for this vault is here: [VaultDoor8.java](https://jupiter.challenges.picoctf.org/static/87f4f8ce117f80ab7b809f161661ce6a/VaultDoor8.java)

#### Solution

First of all the code is a mess! Let's format it so we can read it. I used `VSCode` to do this `F1 -> Format Document` ([Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) Extension).

For now `switchBits` is not important, as desciption says it switchs bits positions and that's it. We should focus on `scramble`, if we reverse the process of bit switching we should get the original flag. Not the positions, but the order.

```java
// https://www.programiz.com/java-programming/online-compiler/
// Online Java Compiler
// Use this editor to write, compile and run your Java code online

class HelloWorld {

  /* Scramble a password by transposing pairs of bits. */
    public static char[] scramble(char[] password) { // Argument Type Changed To char Array
        for (int i = 0; i < password.length; i++) {
            char c = password[i];
            c = switchBits(c, 6, 7); // Order Of Switching Is Reversed
            c = switchBits(c, 2, 5); 
            c = switchBits(c, 3, 4);
            c = switchBits(c, 0, 1);
            c = switchBits(c, 4, 7);
            c = switchBits(c, 5, 6); // ...
            c = switchBits(c, 0, 3); // Was Second
            c = switchBits(c, 1, 2); // Was First
            password[i] = c;
        }
        return password;
    }

  /* 
    Move the bit in position p1 to position p2, and move the bit
    that was in position p2 to position p1. Precondition: p1 < p2 
  */
    public static char switchBits(char c, int p1, int p2) { // No Changes
        char mask1 = (char) (1 << p1);
        char mask2 = (char) (1 << p2);
        char bit1 = (char) (c & mask1);
        char bit2 = (char) (c & mask2);
        char rest = (char) (c & ~(mask1 | mask2));
        char shift = (char) (p2 - p1);
        char result = (char) ((bit1 << shift) | (bit2 >> shift) | rest);
        return result;
    }

    public static String checkPassword() {
        char[] flag = {
            0xF4, 0xC0, 0x97, 0xF0, 0x77, 0x97, 0xC0, 0xE4, 
            0xF0, 0x77, 0xA4, 0xD0, 0xC5, 0x77, 0xF4, 0x86, 
            0xD0, 0xA5, 0x45, 0x96, 0x27, 0xB5, 0x77, 0xC2, 
            0xD2, 0x95, 0xA4, 0xF0, 0xD2, 0xD2, 0xC1, 0x95, 
        };
        return new String(scramble(flag));
    }

    public static void main(String[] args) {
         System.out.printf(">>> picoCTF{%s}\n", checkPassword());
    } 

}
```

::: tip Flag
`picoCTF{s0m3_m0r3_b1t_sh1fTiNg_89eb3994e}`
:::
