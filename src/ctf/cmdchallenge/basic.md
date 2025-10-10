# Basic

##  1. Your first challenge is to print "hello world" on the terminal in a single command.

```bash
echo hello world
```

![Basic.png](/assets/ctf/cmdchallenge/basic.png)

## 2. Print the current working directory.

```bash
pwd 
```

![Basic-1.png](/assets/ctf/cmdchallenge/basic-1.png)

## 3. List names of all the files in the current directory, one file per line.

```bash
ls
```

![Basic-2.png](/assets/ctf/cmdchallenge/basic-2.png)

## 4. There is a file named `access.log` in the current directory. Print the contents.

```bash
cat access.log
```

![Basic-3.png](/assets/ctf/cmdchallenge/basic-3.png)

## 5. Print the last 5 lines of "access.log".

```bash
tail -5 access.log 
```

![Basic-4.png](/assets/ctf/cmdchallenge/basic-4.png)

## 6. Create an empty file named `take-the-command-challenge` in the current working directory.

```bash
touch take-the-command-challenge
```

![Basic-5.png](/assets/ctf/cmdchallenge/basic-5.png)

## 7. Create a directory named tmp/files in the current working directory

```bash
mkdir tmp/files -p
```

![Basic-6.png](/assets/ctf/cmdchallenge/basic-6.png)

## 8. Copy the file named `take-the-command-challenge` to the directory `tmp/files`

```bash
cp take-the-command-challenge tmp/files
```

![Basic-7.png](/assets/ctf/cmdchallenge/basic-7.png)

## 9. Move the file named `take-the-command-challenge` to the directory `tmp/files`

```bash
mv take-the-command-challenge tmp/files
```

![Basic-8.png](/assets/ctf/cmdchallenge/basic-8.png)

## 10. Create a symbolic link named `take-the-command-challenge` that points to the file `tmp/files/take-the-command-challenge`.

```bash
ln -s tmp/files/take-the-command-challenge take-the-command-challenge 
```

![Basic-9.png](/assets/ctf/cmdchallenge/basic-9.png)

## 11. Delete all of the files in this challenge directory including all subdirectories and their contents.

```bash
find . -delete
```

![Basic-10.png](/assets/ctf/cmdchallenge/basic-10.png)

## 12. There are files in this challenge with different file extensions. Remove all files with the .doc extension recursively in the current working directory.

```bash
find . -name '*.doc' -delete
```

![Basic-11.png](/assets/ctf/cmdchallenge/basic-11.png)

## 13. There is a file named `access.log` in the current working directory. Print all lines in this file that contains the string "GET".

```bash
grep GET access.log
```

![Basic-12.png](/assets/ctf/cmdchallenge/basic-12.png)

## 14. Print all files in the current directory, one per line (not the path, just the filename) that contain the string "500".

```bash
grep -l 500 * 
```

![Basic-13.png](/assets/ctf/cmdchallenge/basic-13.png)

## 15. Print the relative file paths, one path per line for all filenames that start with "access.log" in the current directory.

```bash
find . -name 'access.log*'
```

![Basic-14.png](/assets/ctf/cmdchallenge/basic-14.png)

## 16. Print all matching lines (without the filename or the file path) in all files under the current directory that start with "access.log" that contain the string "500".

```bash
grep 500 . -Rh 
```

![Basic-15.png](/assets/ctf/cmdchallenge/basic-15.png)

## 17. Extract all IP addresses from files that start with "access.log" printing one IP address per line.

```bash
grep -Proh '(\d{1,3}\.){3}\d{1,3}' .
```

![Basic-16.png](/assets/ctf/cmdchallenge/basic-16.png)

## 18. Count the number of files in the current working directory. Print the number of files as a single integer.

```bash
find . -type f -maxdepth 1 | wc -l 
```

![Basic-17.png](/assets/ctf/cmdchallenge/basic-17.png)

## 19. Print the contents of access.log sorted.

```bash
sort access.log 
```

![Basic-18.png](/assets/ctf/cmdchallenge/basic-18.png)

## 20. Print the number of lines in access.log that contain the string "GET".

```bash
grep GET access.log | wc -l
```

![Basic-19.png](/assets/ctf/cmdchallenge/basic-19.png)

## 21. The file split-me.txt contains a list of numbers separated by a `;` character.

```bash
tr ';' '\n' < split-me.txt
```

![Basic-20.png](/assets/ctf/cmdchallenge/basic-20.png)

## 22. Print the numbers 1 to 100 separated by spaces.

```bash
seq -s ' ' 1 100
```

![Basic-21.png](/assets/ctf/cmdchallenge/basic-21.png)

## 23. This challenge has text files (with a .txt extension) that contain the phrase "challenges are difficult". Delete this phrase from all text files recursively.

```bash
find . -type f -name '*.txt' -exec sed -i 's/challenges are difficult//g' {} \; 
```

![Basic-22.png](/assets/ctf/cmdchallenge/basic-22.png)

## 24. The file sum-me.txt has a list of numbers, one per line. Print the sum of these numbers.

```bash
paste -sd+ sum-me.txt | bc
```

![Basic-23.png](/assets/ctf/cmdchallenge/basic-23.png)
## 25. Print all files in the current directory recursively without the leading directory path.

```bash
find . -type f -printf '%f\n' 
```

![Basic-24.png](/assets/ctf/cmdchallenge/basic-24.png)

::: info Note
Quotes around format string important to include the newline.
:::
## 26. Rename all files removing the extension from them in the current directory recursively.

```bash
find . -type f | while read -r file; do
  base=$(basename "$file");
  new_base="${base%.*}"; # Bash Parameter Expansion
  mv "$file" "$(dirname "$file")/$new_base";
done 2>/dev/null         # For files with same name
```

```bash
find . -type f | while read -r file; do base=$(basename "$file"); new_base="${base%.*}"; mv "$file" "$(dirname "$file")/$new_base"; done 2>/dev/null
```

![Basic-25.png](/assets/ctf/cmdchallenge/basic-25.png)
## 27. The files in this challenge contain spaces. List all of the files (filenames only) in the current directory but replace all spaces with a '.' character.

```bash
find . -type f -printf "%f\n" | sed 's/ /./g' 
```

![Basic-26.png](/assets/ctf/cmdchallenge/basic-26.png)
## 28. In this challenge there are some directories containing files with different extensions. Print all directories, one per line without duplicates that contain one or more files with a ".tf" extension.

```bash
find . -type f -name '*.tf' -printf "%h\n" | sort -u
```

![Basic-27.png](/assets/ctf/cmdchallenge/basic-27.png)
## 29. There are a mix of files in this directory that start with letters and numbers. Print the filenames (just the filenames) of all files that start with a number recursively in the current directory.

```bash
find . -type f -name '[0-9]*' -printf "%f\n"
```

![Basic-28.png](/assets/ctf/cmdchallenge/basic-28.png)
## 30. Print the 25th line of the file faces.txt

```bash
sed -n 25p faces.txt 
```

![Basic-29.png](/assets/ctf/cmdchallenge/basic-29.png)

## 31. Print the lines of the file `reverse-me.txt` in this directory in reverse line order so that the last line is printed first and the first line is printed last.

```bash
tac reverse-me.txt
```

![Basic-30.png](/assets/ctf/cmdchallenge/basic-30.png)

## 32. Print the file faces.txt, but only print the first instance of each duplicate line, even if the duplicates don't appear next to each other.

```bash
awk '!array[$0]++' faces.txt
```

![Basic-31.png](/assets/ctf/cmdchallenge/basic-31.png)

::: info Note
Looks like there was no escaping from `awk` in this challenge.
:::
## 33. The file `random-numbers.txt` contains a list of 100 random integers. Print the number of unique prime numbers contained in the file.

```bash
count=0; 
while read -r number; do 
	if [[ $(factor $number | wc -w) == 2 ]]; then 
		(( count++ )); 
	fi; 
done < <(sort random-numbers.txt | uniq); 
echo $count; 
```

```bash
count=0; while read -r number; do if [[ $(factor $number | wc -w) == 2 ]]; then (( count++ )); fi; done < <(sort random-numbers.txt | uniq); echo $count; 
```

![Basic-32.png](/assets/ctf/cmdchallenge/basic-32.png)
## 34. Print the IP addresses common to both files, one per line.

```bash
comm -12 <(sort access.log.1 | cut -d' ' -f1) <(sort access.log.2 | cut -d' ' -f1) 
```

![Basic-33.png](/assets/ctf/cmdchallenge/basic-33.png)

## 35. Print all matching lines (without the filename or the file path) in all files under the current directory that start with "access.log", where the next line contains the string "404".

```bash
grep -h -B1 '404' **/access.log* | grep -vE '404|--' 
```

![Basic-34.png](/assets/ctf/cmdchallenge/basic-34.png)

## 36. Print all files with a `.bin` extension in the current directory that are different than the file named base.bin.

```bash
h=$(md5sum base.bin | awk '{print($1)}'); md5sum *.bin | grep -v "$h" | awk '{print($2)}' 
```

![Basic-35.png](/assets/ctf/cmdchallenge/basic-35.png)

## 37. There is a file: `./.../ /. .the flag.txt` Show its contents on the screen.

```bash
find . -type f -exec cat {} \; 
```

![Basic-36.png](/assets/ctf/cmdchallenge/basic-36.png)

## 38. How many lines contain tab characters in the file named `file-with-tabs.txt` in the current directory.

```bash
awk '/\t/ {count++} END {print count}' file-with-tabs.txt 
```

![Basic-37.png](/assets/ctf/cmdchallenge/basic-37.png)

## 38. Remove all files without the .txt and .exe extensions recursively in the current working directory.

```bash
find . ! -name '*.txt' ! -name '*.exe' -type f -delete 
```

![Basic-38.png](/assets/ctf/cmdchallenge/basic-38.png)

## 39. There are some files in this directory that start with a dash in the filename. Remove those files.

```bash
find . -type f -name '-*' -delete
```

![Basic-39.png](/assets/ctf/cmdchallenge/basic-39.png)

## 40. There are two files in this directory, ps-ef1 and ps-ef2. Print the contents of both files sorted by PID and delete repeated lines.

```bash
cat ps-ef1 ps-ef2 | sort -k 2n -u 
```

![Basic-40.png](/assets/ctf/cmdchallenge/basic-40.png)

## 41. Print all the IPv4 listening ports sorted from the higher to lower.

```bash
grep -P '(\d{1,3}\.){3}\d{1,3}.*LISTEN' netstat.out | awk '{split($4,arr,":"); print arr[2]}' | sort -nr
```

![Basic-41.png](/assets/ctf/cmdchallenge/basic-41.png)






























