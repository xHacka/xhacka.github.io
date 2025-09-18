# Java Code Analysis!?!

## Description

AUTHOR:  NANDAN DESAI

BookShelf Pico, my premium online book-reading service.I believe that my website is super secure. I challenge you to prove me wrong by reading the 'Flag' book!Here are the credentials to get you started:

-   Username: "user"
-   Password: "user"

Source code can be downloaded  [here](https://artifacts.picoctf.net/c/481/bookshelf-pico.zip).<br>
Website can be accessed  \<Needs Instance Spawned\>

### Analysis

From `README.md` we get very useful information. 

-  **security**: This package contains all the security-related classes like the ones that generate and verify JWTs, Authorization filters etc. The idea is to have all the *models*, *repositories* and *services* which are related to security all in one package.

In `bookshelf-pico\src\main\java\io\github\nandandesai\pico\security\SecretGenerator.java` we find key for forging new JTW tokens. `getServerSecret` Reads existing file and uses it as the key, otherwise creates a new key using `generateRandomString` which just returns `1234` and writes to file for later use. Most probably the key for JWT tokens is `1234`  

In `bookshelf-pico\src\main\java\io\github\nandandesai\pico\configs\BookShelfConfig.java`:

```java
User freeUser = new User();
freeUser.setProfilePicName("default-avatar.png")
        .setRole(FreeRole)
        .setLastLogin(LocalDateTime.now())
        .setFullName("User")
        .setEmail("user")
        .setPassword(passwordEncoder.encode("user"));
userRepository.save(freeUser);

User admin = new User();
admin.setProfilePicName("default-avatar.png")
        .setRole(AdminRole)
        .setLastLogin(LocalDateTime.now())
        .setFullName("Admin")
        .setEmail("admin")
        .setPassword(passwordEncoder.encode("<redacted>"));
userRepository.save(admin);

logger.info("initialized 'admin' and 'user' users.");
```

The server creates 2 users, first user and then admin. 

To become admin we need following requirements:
- [ ] email = admin
- [ ] role = Admin
- [ ] id = 2

## Solution

I used <https://jwt.io> to forge new key. Security token can be found in `Local Storage`. 

![java-code-analysis-1](/assets/ctf/picoctf/java-code-analysis-1.png)

After replacing `auth-token` and `token-payload` view `flag.pdf`

![java-code-analysis-2](/assets/ctf/picoctf/java-code-analysis-2.png)
::: tip Flag
`picoCTF{w34k_jwt_n0t_g00d_ca4d9701}`
:::
 
