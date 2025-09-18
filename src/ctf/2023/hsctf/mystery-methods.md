# mystery-methods

## Description

rev/mystery-methods (by Dread) | 293  points

vqx jung gb fnl urer

[mysteryMethods.java](https://hsctf-10-resources.storage.googleapis.com/uploads/8f40697b942f04374a3860cc054c8704ad338392b7df6a0511da2fd49d18c9f4/mysteryMethods.java)

## Analysis 

```java
import java.util.Base64;
import java.util.Scanner;

public class mysteryMethods{
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Flag: ");
        String userInput = scanner.nextLine();
        String encryptedInput = encryptInput(userInput);

        if (checkFlag(encryptedInput)) {
            System.out.println("Correct flag! Congratulations!");
        } else {
            System.out.println("Incorrect flag! Please try again.");
        }
    }

    public static String encryptInput(String input) {
        String flag = input;
        flag = toBase64(flag, 345345345);
        flag = reverseStr(flag);
        flag = toBase64(flag, 00000);
        flag = shift(flag, 25);
        return flag;
    }

    public static boolean checkFlag(String encryptedInput) {
        return encryptedInput.equals("OS1QYj9VaEolaDgTSTXxSWj5Uj5JNVwRUT4vX290L1ondF1z");
    }

    public static String shift(String input, int amount) {
        StringBuilder result = new StringBuilder();
        for (char c : input.toCharArray()) {
            if (Character.isLetter(c)) {
                char base = Character.isUpperCase(c) ? 'A' : 'a';
                int offset = (c - base + amount) % 26;
                if (offset < 0) {
                    offset += 26;
                }
                c = (char) (base + offset);
            }
            result.append(c);
        }
        return result.toString();
    }

    public static String reverseStr(String xyz) {
        return new StringBuilder(xyz).reverse().toString();
    }

    public static String toBase64(String xyz, int integer) {
        return Base64.getEncoder().encodeToString(xyz.getBytes());
    }
}
```
<small>Note: I renamed variables/functions for more readability</small>

The Java code takes in input, performs encryption and compares to final output (which should be the flag).

To get the Flag we must reverse the encryption.

Encryption: 
```java
public static String encryptInput(String input) {
    String flag = input;
    flag = toBase64(flag, 345345345); // Convert flag to Base64
    flag = reverseStr(flag);          // Reverse string
    flag = toBase64(flag, 00000);     // Convert flag to Base64 (again)
    flag = shift(flag, 25);           // Shift characters by 25
    return flag;
}
```

Decryption would be `Shift -> Base64Decode -> Reverse -> Base64Decode -> Flag`

To reverse the ROT25 encryption, you simply need to apply ROT1 encryption to the text. ROT25 is essentially the same as ROT1, as shifting the letters by 25 positions in the alphabet is equivalent to shifting them by just one position.

## Solution

In CyberChef
![mystery-methods-1](/assets/ctf/hsctf/mystery-methods-1.png)
