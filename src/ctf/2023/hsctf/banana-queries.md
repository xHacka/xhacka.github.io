# Banana Queries

## Description

algo/banana-queries (by Turtlez200) | 441  points

`nc banana-queries.hsctf.com 1337`

Downloads: [banana-queries.pdf](https://hsctf-10-resources.storage.googleapis.com/uploads/486cab9f6aa0dde524ac099df21bd9bb719361deca4f59be6dfd831458e4229e/banana-queries.pdf)

## Solution

```py
array_size = 1000 # Value from challenge
array = [ ... ]   # Value from challenge
  
biggest_subarray = 0
for i in range(array_size + 1):
    for j in range(i + 1, array_size + 1): 
        subarray_len = j - i # Calculate length
        if subarray_len < biggest_subarray: # Ignore subarray which length 
            continue                        # is less then already biggest

        subarray = array[i:j] # Extract subarray
        if sum(subarray) % subarray_len == 0:
            biggest_subarray = subarray_len 
        
        print(f"{i=}\t{j=} ", end='\r') # Progress Bar

print()
print(f"Biggest Subarray Length: {biggest_subarray}")
```

```powershell
➜ py .\banana-queries.py
...
Biggest Subarray Length: {LENGTH}

➜ ncat banana-queries.hsctf.com 1337
...
...
Output:
{LENGTH}
flag{REDACTED}
```

<small>Note: Commands are run in windows. py -> python3, ncat -> nc</small>