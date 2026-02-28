# Lightweight Mail Server on Oracle Cloud (Ubuntu 24.04)

Postfix + Dovecot + Roundcube + OCI Email Delivery on a 1GB VPS, with most Oracle-specific gotchas.

::: danger Disclaimer
Written from post-setup notes. There may be missing details or small errors. Double-check before deployment.
:::

## Architecture

```
Internet --- Port 25 (SMTP) ---> Postfix --- delivers ---> Dovecot
Internet --- Port 993 (IMAPS) --> Dovecot
Internet --- Port 443 (HTTPS) --> Nginx ---> Roundcube (Webmail)
                                              |-- IMAP --> Dovecot
                                              |-- SMTP --> Postfix --> OCI Email Delivery --> Internet
```

**Stack:**

| Component          | Role                    | RAM Usage |
|--------------------|-------------------------|-----------|
| Postfix            | SMTP (send/receive)     | ~20MB     |
| Dovecot            | IMAP (mailbox access)   | ~30MB     |
| Roundcube          | Webmail UI              | ~50MB     |
| Nginx + PHP-FPM    | Web server              | ~60MB     |
| OCI Email Delivery | Outbound SMTP relay     | N/A       |

Total: ~200-300MB, leaving plenty of headroom on a 1GB VPS.

## Prerequisites

- Oracle Cloud VPS (free tier works) with Ubuntu 24.04
- A domain name with DNS access (e.g., `example.com`)
- A static public IP on your VPS

::: warning Oracle_outbound_port25_is_blocked
Oracle Cloud blocks **outbound** port 25 at the platform level. Security list egress rules are not enough.

You **must** use **OCI Email Delivery** as an SMTP relay for sending mail. Receiving mail on port 25 can still work.
:::

---

## Step 1: DNS Records

Set these DNS records (replace `203.0.113.10` with your VPS IP, `example.com` with your domain):

| Type  | Name                         | Value                                          | TTL  |
|-------|------------------------------|-------------------------------------------------|------|
| A     | `mail.example.com`           | `203.0.113.10`                                  | 3600 |
| MX    | `example.com`                | `mail.example.com` (priority 10)                | 3600 |
| TXT   | `example.com`                | `v=spf1 mx -all`                                | 3600 |
| TXT   | `_dmarc.example.com`         | `v=DMARC1; p=quarantine; rua=mailto:postmaster@example.com` | 3600 |

**PTR record (reverse DNS):** Set through Oracle Cloud Console, not your domain registrar. Your VPS IP should resolve back to `mail.example.com`.

**DKIM:** Will be configured later via OCI Email Delivery (Step 8).

---

## Step 2: Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Set hostname
sudo hostnamectl set-hostname mail.example.com

# Add to /etc/hosts
echo "203.0.113.10  mail.example.com  mail" | sudo tee -a /etc/hosts

# Add swap (recommended for 1GB RAM)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Firewall (ufw)
sudo ufw allow 25/tcp    # SMTP (inbound)
sudo ufw allow 587/tcp   # Submission (authenticated SMTP)
sudo ufw allow 993/tcp   # IMAPS
sudo ufw allow 443/tcp   # HTTPS (webmail)
sudo ufw allow 80/tcp    # HTTP (Let's Encrypt)
sudo ufw enable
```

::: warning Oracle_iptables_before_ufw
Oracle Cloud Ubuntu images often have **built-in iptables rules** that run *before* ufw. Even if ufw allows port 25, an earlier iptables REJECT rule can block it first.

Add port 25 to iptables **before** the REJECT rule:

```bash
# Check existing rules
sudo iptables -L INPUT -n --line-numbers

# Add port 25 BEFORE the REJECT rule (adjust the number based on your output)
sudo iptables -I INPUT 11 -m state --state NEW -p tcp --dport 25 -j ACCEPT

# Save rules to persist across reboots
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
```
:::

::: tip Hostname_note
Setting the hostname to `mail.example.com` only changes the server's internal name. It doesn't change your domain registration or other apps.

For deliverability, it helps if **hostname = PTR = A = MX** (all consistent).
:::

---

## Step 3: TLS Certificate with Let's Encrypt

```bash
sudo apt install -y certbot
sudo certbot certonly --standalone -d mail.example.com
```

Certificates are saved at:
- `/etc/letsencrypt/live/mail.example.com/fullchain.pem`
- `/etc/letsencrypt/live/mail.example.com/privkey.pem`

Certbot auto-renews via systemd timer.

---

## Step 4: Install and Configure Postfix

```bash
sudo apt install -y postfix libsasl2-modules
```

During install, choose **Internet Site** and set system mail name to `example.com`.

::: warning SASL_modules_required
Install `libsasl2-modules` alongside Postfix. Without it, SASL auth to OCI Email Delivery will fail with: `no mechanism available`.
:::

Edit `/etc/postfix/main.cf`:

```ini
myhostname = mail.example.com
mydomain = example.com
myorigin = $mydomain
mydestination = $myhostname, $mydomain, localhost
mynetworks = 127.0.0.0/8 [::1]/128

# TLS
smtpd_tls_cert_file = /etc/letsencrypt/live/mail.example.com/fullchain.pem
smtpd_tls_key_file = /etc/letsencrypt/live/mail.example.com/privkey.pem
smtpd_tls_security_level = may

# Authentication via Dovecot
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes

# Restrictions
smtpd_recipient_restrictions = permit_sasl_authenticated, permit_mynetworks, reject_unauth_destination

# Mailbox
home_mailbox = Maildir/

# Size limits
message_size_limit = 26214400
mailbox_size_limit = 0

# OCI Email Delivery relay (required on Oracle Cloud)
relayhost = [smtp.email.eu-zurich-1.oci.oraclecloud.com]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt
```

::: tip Relayhost_endpoint
Replace the `relayhost` with your OCI region's SMTP endpoint (see Step 7e).
:::

::: warning Remove_PostfixAdmin_mysql_maps
Do **not** keep any `virtual_mailbox_domains`, `virtual_alias_maps`, `virtual_mailbox_maps`, or `virtual_mailbox_base` lines pointing to MySQL.

If they exist (often from a previous PostfixAdmin setup), comment them out or Postfix will throw errors like `Temporary lookup failure` when sending.
:::

Enable submission port (587) in `/etc/postfix/master.cf` -- **uncomment the `submission` line**:

```
submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject
```

::: warning Postfix_submission_port
In the default `master.cf`, the `submission` line is often commented out while the `-o` lines below are not. You must uncomment the **`submission` line itself** or port **587** won't open.
:::

---

## Step 5: Install and Configure Dovecot

```bash
sudo apt install -y dovecot-core dovecot-imapd dovecot-lmtpd
```

### Mail location

`/etc/dovecot/conf.d/10-mail.conf`:
```
mail_location = maildir:~/Maildir
first_valid_uid = 1000
last_valid_uid = 65534
```

::: warning Dovecot_mail_location_override
Also check `/etc/dovecot/dovecot.conf` for a `mail_location` line. If one exists there (e.g., `mail_location = maildir:/var/vmail/%d/%u` from a previous setup), it will **override** the setting in `10-mail.conf`.

Comment it out:

```
#mail_location = maildir:/var/vmail/%d/%u
```
:::

::: warning Postfix_virtual_transport_conflict
Also check for and comment out any `virtual_transport` line in `/etc/postfix/main.cf` (e.g., `virtual_transport = lmtp:unix:private/dovecot-lmtp`). This can conflict with local delivery via `home_mailbox = Maildir/`.
:::

### Authentication

`/etc/dovecot/conf.d/10-auth.conf`:
```
disable_plaintext_auth = yes
auth_mechanisms = plain login
```

In the same file, make sure **only** `auth-passwdfile.conf.ext` is uncommented:

```
#!include auth-system.conf.ext
#!include auth-sql.conf.ext
!include auth-passwdfile.conf.ext
```

::: tip Why_not_PAM
On Ubuntu 24.04, PAM authentication for Dovecot can be finicky. A passwd-file (`/etc/dovecot/users`) is often simpler and more reliable for a small setup.
:::

::: tip Why_not_SQL
If you have leftover PostfixAdmin/MySQL config, Dovecot will try to connect to MySQL on every auth attempt and fail. Remove any SQL auth includes.
:::

### Password file authentication

`/etc/dovecot/conf.d/auth-passwdfile.conf.ext`:
```
passdb {
  driver = passwd-file
  args = scheme=CRYPT username_format=%u /etc/dovecot/users
}

userdb {
  driver = passwd
}
```

::: tip userdb_driver_passwd
`userdb { driver = passwd }` reads UID/GID/home from `/etc/passwd` (not `/etc/shadow`), so no passwords are involved.

Avoid `driver = static` with `uid=%u` — Dovecot needs **numeric** UIDs, not usernames.
:::

Each mail user needs a corresponding Linux system user (for UID/GID/home resolution):

```bash
# Create a system user for mail (with a home directory but no login shell)
sudo adduser tom
# Set their password when prompted (this is also used for Dovecot auth below)
```

Create user credentials:

```bash
# Generate a password hash
sudo doveadm pw -s SHA512-CRYPT -p YOUR_PASSWORD_HERE

# Create the users file
sudo nano /etc/dovecot/users
```

Format of `/etc/dovecot/users` (one user per line):
```
tom:{SHA512-CRYPT}$6$generated_hash_here
alice:{SHA512-CRYPT}$6$another_hash_here
```

```bash
# Must be readable by Dovecot's auth-worker process
sudo chown root:root /etc/dovecot/users
sudo chmod 644 /etc/dovecot/users
```

::: warning Dovecot_users_file_permissions
Do not use `chmod 600` with `chown dovecot:dovecot` for `/etc/dovecot/users`. The auth-worker can run as a different user and fail with `Permission denied`.

Use `root:root` + `644` so it is readable.
:::

Create the Maildir for each user:
```bash
sudo mkdir -p /home/tom/Maildir/{new,cur,tmp}
sudo chown -R tom:tom /home/tom/Maildir
```

Verify authentication and user lookup works:
```bash
sudo doveadm auth test tom YOUR_PASSWORD_HERE
# Should output: passdb: tom auth succeeded

sudo doveadm user tom
# Should output uid, gid, home=/home/tom, mail=maildir:/home/tom/Maildir
```

### SSL

`/etc/dovecot/conf.d/10-ssl.conf`:
```
ssl = required
ssl_cert = </etc/letsencrypt/live/mail.example.com/fullchain.pem
ssl_key = </etc/letsencrypt/live/mail.example.com/privkey.pem
ssl_min_protocol = TLSv1.2
```

### Postfix auth socket

`/etc/dovecot/conf.d/10-master.conf` -- add inside `service auth`:
```
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
}
```

---

## Step 6: Install Nginx + Roundcube (Webmail)

```bash
sudo apt install -y nginx php-fpm php-mbstring php-xml php-intl \
    php-zip php-pdo php-sqlite3 php-curl php-gd roundcube roundcube-sqlite3
```

### Nginx configuration

Create `/etc/nginx/sites-available/webmail`:

```nginx
server {
    listen 443 ssl http2;
    server_name mail.example.com;

    ssl_certificate /etc/letsencrypt/live/mail.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mail.example.com/privkey.pem;

    root /var/lib/roundcube/public_html;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    }

    location ~ /\. { deny all; }
}

server {
    listen 80;
    server_name mail.example.com;
    return 301 https://$host$request_uri;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/webmail /etc/nginx/sites-enabled/
```

::: tip Roundcube_web_root
On Ubuntu 24.04, `index.php` may be in `/var/lib/roundcube/` or `/var/lib/roundcube/public_html/`. Verify with:

```bash
ls /var/lib/roundcube/public_html/index.php
```

If it doesn't exist, use `root /var/lib/roundcube/;`.
:::

::: warning Certbot_nginx_conflicts
If you ran `certbot` with `--nginx` (or Certbot auto-edited Nginx), it may have added duplicate `server_name mail.example.com` blocks into `/etc/nginx/sites-available/default`.

That causes `nginx -t` warnings like `conflicting server name \"mail.example.com\"` and your `webmail` config gets **ignored**.

Check:

```bash
sudo nginx -t
```

If you see conflicts, remove the duplicate `mail.example.com` server blocks from the default site.
:::

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Roundcube configuration

Edit `/etc/roundcube/config.inc.php`:

```php
$config['imap_host'] = 'ssl://localhost:993';
$config['smtp_host'] = 'tls://localhost:587';
$config['smtp_user'] = '%u';
$config['smtp_pass'] = '%p';
$config['mail_domain'] = 'example.com';

// Required: skip SSL verification for localhost
// (the cert is for mail.example.com, not localhost)
$config['imap_conn_options'] = [
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
    ],
];
$config['smtp_conn_options'] = [
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
    ],
];
```

::: tip Roundcube_local_storage_error
Roundcube's **\"Connection to local storage failed\"** means it can't connect to Dovecot (IMAP) — not a disk problem.

Common causes:
- Dovecot not running
- SSL hostname mismatch when connecting to `localhost`
- Wrong auth backend (e.g., leftover MySQL/PostfixAdmin configs)
:::

::: warning Roundcube_mail_domain_identity
Set `mail_domain` **before** your first Roundcube login. Roundcube creates the user identity on first login.

If you log in before setting it, you'll get `tom@localhost` as your From address. Fix it via **Settings → Identities**.
:::

---

## Step 7: OCI Email Delivery Setup (Oracle Cloud SMTP Relay)

Oracle Cloud blocks outbound port 25 at the platform level. You must use OCI Email Delivery to relay outgoing mail.

### 7a. Add Email Domain

1. Oracle Cloud Console > **Developer Services > Email Delivery > Email Domains**
2. Add `example.com` (your email domain, not `mail.example.com`)

### 7b. Configure DKIM

1. In your email domain, click **Generate DKIM**
2. Choose a selector name (e.g., `oci` or `mail`)
3. OCI will give you a **CNAME record** to add to your DNS:
   - **Name:** `selector._domainkey` (e.g., `oci._domainkey`)
   - **Value:** something like `selector.example.com.dkim.region.oracleemaildelivery.com`
4. Add the CNAME in your DNS provider
5. Wait a few minutes, then click **Verify** in OCI

### 7c. Add Approved Sender

1. Go to **Email Delivery > Approved Senders**
2. Add `tom@example.com` (and any other addresses you'll send from)

### 7d. Generate SMTP Credentials

1. Click your **profile icon** (top right) > **My Profile**
2. Under Resources, find **SMTP Credentials**
3. Click **Generate SMTP Credentials**
4. Copy the **username** and **password** immediately (password is shown only once)

### 7e. Find SMTP Endpoint

1. Go to **Email Delivery > Configuration**
2. Note the SMTP endpoint for your region (e.g., `smtp.email.eu-zurich-1.oci.oraclecloud.com`)

### 7f. Configure Postfix Relay

Create `/etc/postfix/sasl_passwd`:
```
[smtp.email.eu-zurich-1.oci.oraclecloud.com]:587 your-smtp-username:your-smtp-password
```

```bash
sudo postmap /etc/postfix/sasl_passwd
sudo chmod 600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
```

The relay settings in `main.cf` were already added in Step 4. Restart and flush:

```bash
sudo systemctl restart postfix
sudo postqueue -f
```

---

## Step 8: Start Everything

```bash
sudo systemctl restart postfix dovecot nginx php8.3-fpm
sudo systemctl enable postfix dovecot nginx php8.3-fpm
```

---

## Step 9: Security Hardening

```bash
sudo apt install -y fail2ban

cat <<EOF | sudo tee /etc/fail2ban/jail.local
[postfix]
enabled = true

[dovecot]
enabled = true

[postfix-sasl]
enabled = true
EOF

sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

---

## Step 10: Testing

1. Log into Roundcube at `https://mail.example.com`
2. Go to **Settings > Identities** and verify the email shows `you@example.com` (not `@localhost`)
3. Send a test email to a Gmail/Outlook address
4. Check your score at [mail-tester.com](https://www.mail-tester.com/)
5. Reply from Gmail/Outlook to test receiving

---

## Troubleshooting Quick Reference

| Problem | Cause | Fix |
|---------|-------|-----|
| Nginx 404 on webmail | Wrong `root` path, or Certbot created duplicate server blocks in `default` config | Check `root` path; run `nginx -t` and fix conflicting server names |
| "Connection to local storage failed" in Roundcube | Dovecot auth misconfigured or SSL mismatch | Use `verify_peer: false` for localhost; fix Dovecot auth backend |
| Dovecot auth fails (MySQL errors) | Leftover PostfixAdmin/SQL config | Comment out `auth-sql.conf.ext`, enable `auth-passwdfile.conf.ext` |
| Dovecot auth fails (PAM) | Dovecot can't read `/etc/shadow` or PAM issues | Switch to passwd-file auth instead |
| Dovecot "Invalid UID value '%u'" | `uid=%u` in static userdb -- Dovecot needs numeric UIDs | Use `userdb { driver = passwd }` instead of static |
| Dovecot "UID not permitted" | `first_valid_uid` too high for your user | Set `first_valid_uid = 1000` and `last_valid_uid = 65534` in `10-mail.conf` |
| Dovecot "Permission denied" on users file | `/etc/dovecot/users` not readable by auth-worker | Use `chmod 644` and `chown root:root` |
| Dovecot reads wrong mail path | `mail_location` in `dovecot.conf` overrides `10-mail.conf` | Comment out `mail_location` in `/etc/dovecot/dovecot.conf` |
| Dovecot "stat /var/vmail/ Permission denied" | Old `mail_location` or `virtual_transport` pointing to `/var/vmail/` | Comment out both; ensure `mail_location = maildir:~/Maildir` |
| SMTP "Temporary lookup failure" | Postfix configured with MySQL virtual maps | Comment out `virtual_mailbox_*` and `virtual_transport` lines in `main.cf` |
| SMTP "Connection timed out" (outbound) | Oracle blocks outbound port 25 | Use OCI Email Delivery as relay |
| SMTP "Connection timed out" (inbound) | Oracle iptables blocks port 25 before ufw sees it | Add port 25 to iptables directly (see Step 2) |
| SMTP "no mechanism available" | Missing SASL library | Install `libsasl2-modules` |
| From address shows `@localhost` | `mail_domain` not set in Roundcube | Add `$config['mail_domain'] = 'example.com';` and fix identity in Settings |
| `nginx -t` permission error on certs | Ran without `sudo` | Always use `sudo nginx -t` |

---

## Useful Commands

```bash
# Check mail queue
sudo mailq

# Flush (retry) queued mail
sudo postqueue -f

# Delete all queued mail
sudo postsuper -d ALL

# Test Dovecot auth
sudo doveadm auth test username password

# Check Postfix logs (Ubuntu 24.04 uses journalctl, not /var/log/mail.log)
sudo journalctl -u postfix --since "5 min ago" --no-pager
sudo journalctl -u postfix -f  # follow live

# Check Dovecot logs
sudo journalctl -u dovecot -f

# Verify Dovecot user lookup (check uid, home, mail path)
sudo doveadm user tom

# Check Roundcube logs
sudo tail -f /var/lib/roundcube/logs/errors.log

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test outbound SMTP (should timeout on Oracle without relay)
curl -s telnet://smtp.google.com:25 --connect-timeout 5
```
