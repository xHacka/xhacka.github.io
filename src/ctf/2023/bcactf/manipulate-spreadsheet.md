# Manipulate Spreadsheet 

## Description 

Manipulate Spreadsheet | 50  points | By  `Michael`

They said the flag was in  [this spreadsheet](https://docs.google.com/spreadsheets/d/10UYPl1kzuSTLJbN6kLkJR4aVFxo3nXUrKIiLLTQyOb8/), but it appears completely empty to me! Can you help me find it?

## Analysis

I first downloaded the document to work on it.

When the A1 cell is selected formula bar shows `index`, I tried selecting the table using `Ctrl + A` and discovered that there's a "hidden" table (A1:B1000). Using `Font Color` I changed the color to black and data is now displayed.

## Solution

Characters are mapped with indexes, first we need to sort but to sort we can't have empty cells.<br>
Stand in any blank row in B column, `F5 -> Special... -> Blanks -> ..Wait.. -> Delete (from ribbon) -> Delete Sheet Rows`

Stand in table -> `Sort&Filter` -> `Sort Smallest to Largest -> copy column B -> remove spaces`

<small>Note: I simply pasted column in browser url bar since newlines aren't allowed, simple trick</small>

Flag: `bcactf{goO913_shee75_i5_coOl_4wce98Nu}`