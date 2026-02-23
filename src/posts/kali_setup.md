# Kali Linux: Lab Environment Setup

My setup, may have forgotten things

- NOT EXACTLY FINISHED, MAY KEEP UPDATING STUFF
- NOT EXACTLY FINISHED, MAY KEEP UPDATING STUFF
- NOT EXACTLY FINISHED, MAY KEEP UPDATING STUFF
- NOT EXACTLY FINISHED, MAY KEEP UPDATING STUFF
- NOT EXACTLY FINISHED, MAY KEEP UPDATING STUFF

## 1. Initial VM Configuration

### Download

* **Official Images:** [Kali Virtual Machines](https://www.kali.org/get-kali/#kali-virtual-machines)

### VirtualBox Settings

Navigate to your VM settings and apply the following for a better experience:

* **General > Advanced:** Set **Shared Clipboard** to `Bidirectional`.
* **Shared Folders:** - Add a new share.
* Check **Auto-mount**.

* **Display:** (Optional) If using XFCE, turn off **Screensaver** to avoid lockouts during long scans.

::: warning Version Check
Ensure you are using the latest version of VirtualBox before importing the VDI to avoid compatibility issues.
:::

### Guest Additions & Headers

Run the following to ensure your drivers are up to date:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential linux-headers-$(uname -r)
sudo reboot
```

## 2. User & System Identity

### Rename the User

We will rename the default `kali` user to a personalized account and fix the hostname.

1. Press `Ctrl+F6` to drop to a TTY.
2. Login as `kali:kali`.
3. Set a root password: `sudo passwd root`.
4. Logout and log back in as **root** (`Ctrl+F7` for GUI).
5. Execute the transformation:

```bash
# Rename user and move home directory
usermod -l woyag -d /home/woyag -m kali
groupmod -n woyag kali
passwd woyag

# Cleanup any lingering processes if above fails
# killall -u kali

```

### Permission Groups

Create an `opt` group to manage shared tools without needing `sudo` every time.

```bash
sudo groupadd opt
sudo chown :opt /opt
sudo chmod 775 /opt
sudo usermod -aG opt woyag
```

### Identity

```bash
sudo hostnamectl set-hostname kraken
```

## 3. Environment & Shell Setup

### Typography (Nerd Fonts)

Installing JetBrainsMono Nerd Font for proper icon support in `tmux` and `alacritty`.

```bash
FONT=JetBrainsMono.tar.xz
OUTPUT=/usr/local/share/fonts/jetbrains-mono
sudo mkdir -p "$OUTPUT" \
&& sudo wget -P "$OUTPUT" "https://github.com/ryanoasis/nerd-fonts/releases/latest/download/$FONT" \
&& cd "$OUTPUT" \
&& sudo tar -xJf "$FONT" --wildcards "*.ttf" \
&& sudo rm "$FONT" \
&& sudo fc-cache -fv "$OUTPUT"

```

### The Tooling Stack

A massive one-liner to get all essential binaries:

```bash
sudo apt install -y \
  seclists \          # Comprehensive wordlists for brute-forcing and fuzzing
  feroxbuster \       # High-performance recursive directory and file discovery
  ffmpeg \            # Multimedia framework for video and audio processing
  eza \               # Modern, colorful replacement for 'ls'
  bat \               # 'cat' clone with syntax highlighting and git integration
  neovim \            # Extensible, modern Vim-based text editor
  xclip \             # Command-line interface to the X11 clipboard
  tmux \              # Terminal multiplexer for persistent sessions
  golang-go \         # Go programming language compiler and tooling
  build-essential \   # Compilers and tools required for building software
  curl \              # Tool for transferring data with URLs
  git \               # Distributed version control system
  xfce4-terminal \    # Lightweight terminal emulator for XFCE
  alacritty \         # GPU-accelerated terminal emulator
  mariadb-server \    # Open-source relational database (MySQL-compatible)
  stegseek \          # Fast cracker for steganography hidden in images
  ghidra \            # NSA-developed software reverse engineering suite
  python3-dev \       # Header files for building Python C extensions
  libkrb5-dev \       # Development files for Kerberos 5 authentication
  tldr \              # Simplified, community-driven man pages
  rlwrap \            # Adds readline editing and history to CLI tools
  ncat \              # Versatile networking tool (Netcat from Nmap)
  sshpass \           # Non-interactive SSH password authentication
  ansifilter \        # Strips or converts ANSI escape sequences from output
  cupp \              # Common User Passwords Profiler for wordlist generation
  translate-shell \   # Command-line translator using online translation services
  jq \                # Lightweight and flexible JSON processor
  enum4linux-ng \     # Active Directory and SMB enumeration tool
  nuclei \            # Fast vulnerability scanner using templated checks
  ltrace \            # Library call tracer for debugging binaries
  strace \            # System call tracer for analyzing program behavior
  tesseract-ocr \     # Optical Character Recognition engine for extracting text from images
  lolcat \            # Utility for rainbow-coloring terminal output
  steghide \          # Steganography tool for hiding data in images and audio files
  bettercap \         # Comprehensive framework for network attacks and monitoring
  ncat \              # Versatile networking tool for reading, writing, and redirecting data
  gdb \               # The GNU Project debugger for low-level binary analysis
  ropper              # Tool to display information about files and find ROP gadgets
  foremost
  npm
  libreoffice
  gradle
  freerdp3-dev
  remmina
  pngcheck
```

### Language Runtimes

```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Python (via UV)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## 4. Modern Python Tooling (via UV)

Replace `pip` with `uv` for lightning-fast, isolated tool management.

```bash
uv tool install 'evil-winrm-py[kerberos]'
uv tool install bloodhound-ce
uv tool install certipy-ad
uv tool install ldapdomaindump
uv tool install pwntools
uv tool install registryspy
uv tool install uncompyle6
uv tool install git+https://github.com/aniqfakhrul/powerview.py
uv tool install git+https://github.com/brightio/penelope
uv tool install git+https://github.com/CravateRouge/bloodyAD.git
uv tool install git+https://github.com/mitmproxy/mitmproxy.git
uv tool install git+https://github.com/Paradoxis/Flask-Unsign.git
uv tool install git+https://github.com/Pennyw0rth/NetExec.git
uv tool install git+https://github.com/RsaCtfTool/RsaCtfTool
uv tool install git+https://github.com/arthaud/git-dumper.git

pip install pytesseract --break-system-packages
```

## 5. Extra Binaries

```bash
# fzf
tar -xzvf <(curl -Ls https://github.com/junegunn/fzf/releases/download/v0.67.0/fzf-0.67.0-linux_amd64.tar.gz -o-)
sudo mv fzf /usr/local/bin

# htmlq
└─$ tar -xzvf <(curl -Ls https://github.com/mgdm/htmlq/releases/download/v0.4.0/htmlq-x86_64-linux.tar.gz -o-)
└─$ sudo mv htmlq /usr/local/bin

# Websocat
└─$ curl -LOs https://github.com/vi/websocat/releases/download/v1.14.1/websocat.i686-unknown-linux-musl
└─$ chmod +x websocat.i686-unknown-linux-musl
└─$ sudo mv websocat.i686-unknown-linux-musl /usr/local/bin/websocat

# Exploit Development and Reverse Engineering with GDB & LLDB Made Easy
└─$ curl -qsL 'https://install.pwndbg.re' | sh -s -- -t pwndbg-gdb

# NoMore403
git clone https://github.com/devploit/nomore403 /opt/nomore403
cd /opt/nomore403 && go get && go build
sudo ln -s /opt/nomore403/nomore403 /usr/local/bin/nomore403

# Repos
git clone https://github.com/r3motecontrol/Ghostpack-CompiledBinaries.git /opt/Ghostpack-CompiledBinaries
git clone https://github.com/dirkjanm/PKINITtools.git /opt/PKINITtools

# Cutter
curl -L https://github.com/rizinorg/cutter/releases/download/v2.4.1/Cutter-v2.4.1-Linux-x86_64.AppImage -o ~/Desktop/Cutter.AppImage
chmod +x ~/Desktop/Cutter.AppImage
```

- [https://my.hex-rays.com/dashboard/download-center/installers/release/9.2/ida-free](https://my.hex-rays.com/dashboard/download-center/installers/release/9.2/ida-free) (Needs account...)
- [https://code.visualstudio.com/docs/setup/linux](https://code.visualstudio.com/docs/setup/linux)

## 6. Dockerized Services

We use the Debian Trixie/Rolling repositories for Docker to ensure we have the latest `compose` plugin.

```bash
# Update source to Trixie
sudo sed -i 's/kali-rolling/trixie/' /etc/apt/sources.list.d/docker.sources
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

```bash
sudo docker pull wpscanteam/wpscan
sudo docker pull ticarpi/jwt_tool
sudo docker pull rustscan/rustscan 
sudo docker pull specterops/bloodhound
sudo docker pull frohoff/ysoserial
```

## 7. Configuration Files

### Zsh Profile (`~/.zshrc`)

```bash
# History configurations
HISTFILE=~/.zsh_history
HISTSIZE=1000000000
SAVEHIST=1000000000
setopt hist_expire_dups_first
setopt hist_ignore_dups
setopt hist_ignore_space
setopt hist_verify
setopt share_history
...
# https://stackoverflow.com/a/2867936
# Source modular scripts
[ -d /etc/.zsh.d ] && for f in /etc/.zsh.d/*.sh; do [ -r "$f" ] && . "$f"; done

PATH="/sbin:/usr/sbin:/usr/local/sbin:/bin:/usr/bin:/usr/local/bin:/home/$USER/go/bin:/home/$USER/.local/bin:/home/$USER/.local/share/gem/ruby/3.1.0/bin:/home/$USER/.cargo/bin:/home/$USER/.local/share/gem/ruby/3.3.0/bin:$PATH"

source <(fzf --zsh)
[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"
```

### Alacritty (`~/.config/alacritty/alacritty.toml`)

Pwetty terminal
```bash
[cursor.style]
shape = "Underline"

[terminal.shell]
program = "/bin/bash"
args = ["-lc", 'tmux attach || tmux new']

[[keyboard.bindings]]
action = "Paste"
key = "V"
mods = "Control|Shift"

[[keyboard.bindings]]
action = "Copy"
key = "C"
mods = "Control|Shift"

[[keyboard.bindings]]
action = "ResetFontSize"
key = "Key0"
mods = "Control"

[[keyboard.bindings]]
action = "IncreaseFontSize"
key = "Plus"
mods = "Control"

[[keyboard.bindings]]
action = "DecreaseFontSize"
key = "Minus"
mods = "Control"

[[keyboard.bindings]]
action = "Paste"
key = "Paste"

[[keyboard.bindings]]
action = "Copy"
key = "Copy"

[[keyboard.bindings]]
action = "ClearLogNotice"
key = "L"
mods = "Control"

[[keyboard.bindings]]
chars = "\f"
key = "L"
mods = "Control"

[[keyboard.bindings]]
action = "ScrollPageUp"
key = "PageUp"
mode = "~Alt"
mods = "Shift"

[[keyboard.bindings]]
action = "ScrollPageDown"
key = "PageDown"
mode = "~Alt"
mods = "Shift"

[[keyboard.bindings]]
action = "ScrollToTop"
key = "Home"
mode = "~Alt"
mods = "Shift"

[[keyboard.bindings]]
action = "ScrollToBottom"
key = "End"
mode = "~Alt"
mods = "Shift"

[scrolling]
history = 42690
multiplier = 3

[window]
dynamic_padding = true
opacity = 0.8765

[window.dimensions]
columns = 110
lines = 20

[window.padding]
x = 10
y = 10

[window.position]
x = 495
y = 270

[font]
size = 12.0

[font.bold]
style = "Bold"
family = "JetBrainsMonoNerdFont"

[font.bold_italic]
style = "Bold Italic"
family = "JetBrainsMonoNerdFont"

[font.italic]
style = "Italic"
family = "JetBrainsMonoNerdFont"

[font.normal]
style = "Regular"
family = "JetBrainsMonoNerdFont"

[terminal]
```

### Tmux Configuration (`~/.config/tmux/tmux.conf`)

Ensure you have the [TPM Manager](https://github.com/tmux-plugins/tpm) installed first.
- `git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm`

Download theme
```bash
mkdir -p ~/.tmux/themes/tmux-snazzy && cd $_
curl -Ls https://raw.githubusercontent.com/ivnvxd/tmux-snazzy/refs/heads/main/.tmux.snazzy.theme -o snazzy.theme
```

```bash
# Variables
set -g mouse on
set -g history-limit 1000000

# Plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-logging'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-open'
set -g @plugin 'tmux-plugins/tpm'

# Theme
source-file "/home/$USER/.tmux/themes/tmux-snazzy/snazzy.theme"

# Use xclip to copy and paste with the system clipboard
bind C-c run "tmux save-buffer - | xclip -i -sel clip"
bind C-v run "tmux set-buffer $(xclip -o -sel clip); tmux paste-buffer"
# Linux only # https://unix.stackexchange.com/a/318285
bind -n WheelUpPane if-shell -F -t = "#{mouse_any_flag}" "send-keys -M" "if -Ft= '#{pane_in_mode}' 'send-keys -M' 'select-pane -t=; copy-mode -e; send-keys -M'"
bind -n WheelDownPane select-pane -t= \; send-keys -M
bind -n C-WheelUpPane select-pane -t= \; copy-mode -e \; send-keys -M
bind -T copy-mode-vi    C-WheelUpPane   send-keys -X halfpage-up
bind -T copy-mode-vi    C-WheelDownPane send-keys -X halfpage-down
bind -T copy-mode-emacs C-WheelUpPane   send-keys -X halfpage-up
bind -T copy-mode-emacs C-WheelDownPane send-keys -X halfpage-down

# To copy, left click and drag to highlight text in yellow,
# once you release left click yellow text will disappear and will automatically be available in clibboard
# # Use vim keybindings in copy mode
setw -g mode-keys vi
# Update default binding of `Enter` to also use copy-pipe
unbind -T copy-mode-vi Enter
bind-key -T copy-mode-vi Enter send-keys -X copy-pipe "xclip -selection c" # copy-pipe-and-cancel if you want to jump to bottom right away
bind-key -T copy-mode-vi MouseDragEnd1Pane send-keys -X copy-pipe "xclip -in -selection clipboard"

# https://unix.stackexchange.com/a/118381
# Split windows, but keep the current working directory
bind '"' split-window -c "#{pane_current_path}" # run-shell
bind % split-window -h -c "#{pane_current_path}"
bind c new-window -c "#{pane_current_path}"

run '~/.tmux/plugins/tpm/tpm'
``` 

## 8. XFCE Taskbar Optimization

To keep your most-used tools one click away, configure the XFCE panel:

1. **Open Settings:** `Taskbar` -> `Panel` -> `Panel Preferences` -> `Items`
2. **Add Launchers:**
* Click **Add** -> **Launcher** (Repeat this twice).
3. **Configure Chromium:**
* Select the first Launcher -> **Double Click**.
* Click **Plus (+)** -> Search for **Chromium** -> **Add** -> **Close**.
4. **Configure Burp Suite:**
* Select the second Launcher -> **Double Click**.
* Click **Plus (+)** -> Search for **Burpsuite** -> **Add** -> **Close**.
5. **Placement:** Use the **Up/Down arrows** to move them next to the Application Menu or your Terminal icon.

## 9. Essential Browser Extensions

Install these in Chromium/Firefox to streamline web pentesting and reduce eye strain:

* **Dark Reader:** Force dark mode on every site (essential for late-night labs).
* **FoxyProxy:** Quickly switch between your system proxy and Burp Suite (8080).
* **ModHeader:** Add or modify HTTP request headers on the fly.
* **Wappalyzer:** Instantly identify the tech stack (CMS, Frameworks, DBs) of a target.

## 10. SSH

For lab environments, skip the "Strict Host Key" prompts:

```bash
$ nano ~/.ssh/config
Host *
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
```
