# Old 04    Hash Generation

URL: [https://webhacking.kr/challenge/web-04/?view-source=1](https://webhacking.kr/challenge/web-04/?view-source=1)

![old-04.png](/assets/ctf/webhacking.kr/old-04.png)

```php
<?php
include "../../config.php";
if ($_GET["view-source"] == 1) {
    view_source();
}
?>
...
<?php
sleep(1); // anti brute force
if (isset($_SESSION["chall4"]) && $_POST["key"] == $_SESSION["chall4"]) {
    solve(4);
}
$hash = rand(10000000, 99999999) . "salt_for_you";
$_SESSION["chall4"] = $hash;
for ($i = 0; $i < 500; $i++) { $hash = sha1($hash); }
?>
```

Looks like we are given a `sha1` hash which is generated from random number + salt, then iterated 500 on itself...

I used Golang to do multithreading and logging the already iterated hashes:
```go
package main

import (
	"crypto/sha1"
	"fmt"
	"log"
	"os"
	"sync"
)

const (
	targetHash = "f7891b7643c730747b97122ca5317eecb4e946fb"
	saltString = "salt_for_you"
)

func main() {
	logFile, err := os.OpenFile("old-04.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("Failed to open log file: %v", err)
	}
	defer logFile.Close()
	logger := log.New(logFile, "", log.LstdFlags)

	var buffSize int = 100
	var wg sync.WaitGroup
	ch := make(chan int, buffSize)
	done := make(chan bool)

	for i := 0; i < buffSize; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for num := range ch {
				hash := generateHash(num)
				if hash == targetHash {
					logger.Printf("Target hash found: %d", num)
					fmt.Printf("Target hash found: %d\n", num)
					close(done)
					return
				} else {
					logger.Printf("Number: %d, Hash: %s", num, hash)
				}
			}
		}()
	}

	for i := 10000000; i <= 99999999; i++ {
		ch <- i
	}
	close(ch)

	<-done
	wg.Wait()
}

func generateHash(num int) string {
	hash := fmt.Sprintf("%d%s", num, saltString)
	for i := 0; i < 500; i++ {
		hash = fmt.Sprintf("%x", sha1.Sum([]byte(hash)))
	}
	return hash
}
```

After ~40min there was no success, so I decided grep generated hashes (around ~20mil) 

The very first hash was success, but I was kicked out of my session lol. After logging in and try last number + salt we can pwn the challenge.
```bash
└─$ ls -lh ./old-04.log
Permissions Size User Date Modified Name
.rwxrwx---  976M root 14 Jul 15:52   ./old-04.log
└─$ wc old-04.log
 11477965  68867790 975627025 old-04.log
...
└─$ grep edbb8a4b9adb046b2d79c46c315414716175cee3 old-04.log
2024/07/14 23:45:01 Number: 19990463, Hash: edbb8a4b9adb046b2d79c46c315414716175cee3
└─$ grep f4fb121eb46844f65024d4655fd048c4a90a6417 old-04.log
└─$ grep a4e9e9c73a04f85cb2632ac60f6e3352c7627ef4 old-04.log
└─$ grep a8746ee26e56ece35a41b1a31ffa2c6242d17dbb old-04.log
└─$ grep e6d3f7c8e836ae3504f4cf48752f2030749c075c old-04.log
2024/07/14 23:08:29 Number: 11635831, Hash: e6d3f7c8e836ae3504f4cf48752f2030749c075c
```

![old-04-1.png](/assets/ctf/webhacking.kr/old-04-1.png)

> **Note**: The image shows my first attempt, not second. Results still same.

Submit and pwned!