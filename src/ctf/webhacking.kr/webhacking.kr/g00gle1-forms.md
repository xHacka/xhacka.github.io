# G00gle1    Forms

URL: [https://docs.google.com/forms/d/e/1FAIpQLSd5S_aJDd8jMiGEpabw1l4NCObP-4Zwdd5l0uAQU5NElpsrCw/viewform](https://docs.google.com/forms/d/e/1FAIpQLSd5S_aJDd8jMiGEpabw1l4NCObP-4Zwdd5l0uAQU5NElpsrCw/viewform)

We are given a google form:

![g00gle1.png](/assets/ctf/webhacking.kr/g00gle1.png)

Selecting any field restricts us from proceeding...

![g00gle1-1.png](/assets/ctf/webhacking.kr/g00gle1-1.png)

If we unselect it says it required...

![g00gle1-2.png](/assets/ctf/webhacking.kr/g00gle1-2.png)

How to select without selecting then?

If we inspect the source we can find relevant words in this script and we can also see the flag:
```js
<script nonce="JvXlto-r20o4rllklX2o1Q">
            var FB_PUBLIC_LOAD_DATA_ = [null, [null, [[46995807, "Do you want flag?", null, 4, [[1748584378, [["yes", null, null, null, 0], ["sure", null, null, null, 0]], 1, null, [[7, 204, [""]]], null, null, null, 0]], null, null, null, null, null, null, [null, "Do you want flag?"]]], ["ok. here is what you want. FLAG{how_can_i_pwn_googl3?}", 1, 0, 1, 0], null, null, [null, 0], null, [1, ""], "g00gle1", 51, [null, null, null, 2, null, null, 1], null, null, null, null, [2], [[1, 1, 1, 1, 1], 1], null, null, null, null, null, null, null, null, [null, "g00gle1"]], "/forms", "webhacking.kr_g00gle1", null, null, null, "", null, 0, 0, null, "", 0, "e/1FAIpQLSd5S_aJDd8jMiGEpabw1l4NCObP-4Zwdd5l0uAQU5NElpsrCw", 0, "[]", 0, 0];
        </script>
```