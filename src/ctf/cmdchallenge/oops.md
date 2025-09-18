# Oops

## 1. For now, all you need to do is figure out where you are, print the current working directory.

```bash
pwd
echo $PWD
```

![Oops.png](/assets/ctf/cmdchallenge/oops.png)

## 2. Great, now that you know which directory you are in, you want to see what else is here. List all of the files on a single line, in the current working directory.

```bash
echo * 
```

![Oops-1.png](/assets/ctf/cmdchallenge/oops-1.png)

## 3. Oh no! You now remember there is a very important file in this directory.

```bash
echo "$(< my-dissertation.txt)"
while read -r; do echo $REPLY; done < my-dissertation.txt 
while read -r line; do echo $line; done < my-dissertation.txt 
```

![Oops-2.png](/assets/ctf/cmdchallenge/oops-2.png)

## 4. You know there is a process on machine that is deleting files, the first thing you want to do is identify the name of it. Print the name of the process.

```bash
for i in {1..100}; do [ -f /proc/$i/cmdline ] && echo "Proc $i $(< /proc/$i/cmdline)" 2>/dev/null; done
echo oops-this-will-delete-bin-dirs
```

![Oops-3.png](/assets/ctf/cmdchallenge/oops-3.png)

## 5. You managed to save your important file. Now that you know the process name it will be good to kill it before it does any more damage.

```bash
# Test
for dir in /proc/[0-9]*; do if [ -r "$dir/cmdline" ]; then IFS= read -r -d '' cmdline < "$dir/cmdline"; pid="${dir##*/}"; echo "PID: $pid | CMDLINE: $cmdline"; fi; done
# Solve
for dir in /proc/[0-9]*; do if [ -r "$dir/cmdline" ]; then IFS= read -r -d '' cmdline < "$dir/cmdline"; pid="${dir##*/}"; [ "$cmdline" == "oops-this-will-delete-bin-dirs" ] && kill -9 $pid; fi; done 
```

![Oops-4.png](/assets/ctf/cmdchallenge/oops-4.png)