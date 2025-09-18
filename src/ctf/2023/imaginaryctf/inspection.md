# Inspection

## Description

by `Eth007`

Here's a freebie: the flag is ictf.

## Solution

Because it's a web challenge flag is somewhere on website and inpect is also a hint. Using `Inpect Tool` to look around I found:

```html
<div class="modal-body pb-0">
    <b>Description</b>
    <p m4rkdown_parser_fail_1a211b44="">Here's a freebie: the flag is ictf.</p>

    <b>Attachments</b>
    <p>N/A</p>
</div>
```

It was a bit tricky because `ictf` wasn't in flag.
::: tip Flag
`ictf{m4rkdown_parser_fail_1a211b44}`
:::