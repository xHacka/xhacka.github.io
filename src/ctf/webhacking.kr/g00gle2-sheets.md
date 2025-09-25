# G00gle2    Sheets

URL: [https://docs.google.com/spreadsheets/d/1uCpV_9NriUEwD8ZPqPVsU02n6Hg9JitGZPinbRmmL4I/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1uCpV_9NriUEwD8ZPqPVsU02n6Hg9JitGZPinbRmmL4I/edit?gid=0#gid=0)

We are given an excel form:

![g00gle2.png](/assets/ctf/webhacking.kr/g00gle2.png)

Flag is redacted, but the actual flag comes from different document.

[https://docs.google.com/spreadsheets/d/1x7b8Wwp3jJAr6sgEG8RmuZOh-d7gpSmYvH9tmXWDq_c/edit](https://docs.google.com/spreadsheets/d/1x7b8Wwp3jJAr6sgEG8RmuZOh-d7gpSmYvH9tmXWDq_c/edit)

No access

![g00gle2-1.png](/assets/ctf/webhacking.kr/g00gle2-1.png)

The data exists on the page, but because of ReadOnly property we can't replace `?` with actual content. But data exists! Open `Sources`  tab and do `Ctrl+Shift+F` and search for `FLAG{`, in one of the requests made by Google Sheets we can see the flag value in it.

![g00gle2-2.png](/assets/ctf/webhacking.kr/g00gle2-2.png)

::: tip Flag
`FLAG{now_i_pwned_googl3?}`
:::

