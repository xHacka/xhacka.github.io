# A Rap Beef

## Tables

| Table Name            | Description                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| AuthenticationEvents  | Records successful and failed logins to devices on the company network. This includes logins to the company’s mail server. |
| Email                 | Records emails sent and received by employees.                                                                             |
| Employees             | Contains information about the company’s employees.                                                                        |
| FileCreationEvents    | Records files stored on employee’s devices.                                                                                |
| InboundNetworkEvents  | Records inbound network events including browsing activity from the Internet to devices within the company network.        |
| OutboundNetworkEvents | Records outbound network events including browsing activity from within the company network out to the Internet.           |
| PassiveDns (External) | Records IP-domain resolutions.                                                                                             |
| ProcessEvents         | Records processes created on employee’s devices.                                                                           |
| SecurityAlerts        | Records security alerts from an employee’s device or the company’s email security system.                                  |

## Enough beef for a burger

### 4. What is the name of the OWL Records CEO?

```sql
Employees
| where role == "CEO"
| project name
```

::: tip Flag
`Sean Crater`
:::

### 5. You can use the following query to search for browsing activity to your company's website. How many results (rows) did you get back?

```sql
InboundNetworkEvents
| where timestamp between (datetime("2024-04-10T00:00:00") .. datetime("2024-04-11T00:00:00"))
| where src_ip has "18.66.52.227"
| count 
```

::: tip Flag
`19`
:::

### 6. What piece of information were they looking to get for Dwake? (two words)

```sql
InboundNetworkEvents
| where url has "Dwake"
| project url
```

| url                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [https://owl-records.com/search=why+is+Dwake+music+much+soo+trasshhhh](https://owl-records.com/search=why+is+Dwake+music+much+soo+trasshhhh)                                                               |
| [https://owl-records.com/search=whats+Dwake%27s+email+address%3F](https://owl-records.com/search=whats+Dwake%27s+email+address%3F)                                                                         |
| [https://owl-records.com/search=how+do+i+email+Dwake%3F%3F](https://owl-records.com/search=how+do+i+email+Dwake%3F%3F)                                                                                     |
| [https://owl-records.com/search=can+i+book+Dwake+for+a+party%3F](https://owl-records.com/search=can+i+book+Dwake+for+a+party%3F)                                                                           |
| [https://owl-records.com/search=Dwake+booking+info+pls](https://owl-records.com/search=Dwake+booking+info+pls)                                                                                             |
| [https://owl-records.com/artists/Dwake/](https://owl-records.com/artists/Dwake/)                                                                                                                           |
| [https://owl-records.com/account/reset-password?username=dwaubrey&email=dwake_audrey@owl-records.com](https://owl-records.com/account/reset-password?username=dwaubrey&email=dwake_audrey@owl-records.com) |
::: tip Flag
`email`
:::

### 7. The operator is wondering why Dwake's music is so _

From previous query: `https://owl-records.com/search=why is Dwake music much soo trasshhhh`

::: tip Flag
`trash`
:::

### 8. What is Dwake's email address?

```sql
Employees
| where name has "Dwake"
| project email_addr
```

::: tip Flag
`dwake_audrey@owl-records.com`
:::

### 9. Which of the following did Dwake disclose in his verse? (pick one)

![writeup.png](/assets/soc/kc7cyber/a-rap-beef/writeup.png)

::: tip Flag
`1 and 3`
:::

### 10. What is Dwake's mother's maiden name?

::: tip Flag
`Washington`
:::

### 11. What is the name of Dwake's childhood pet?

::: tip Flag
`Fluffy`
:::

### 12. Copy and paste the full URL that shows the operator resetting the password to Dwake’s account.

```sql
InboundNetworkEvents
| where timestamp between (datetime("2024-04-10T00:00:00") .. datetime("2024-04-11T00:00:00"))
| where url has_any("washington", "fluffy")
| where has_ipv4(src_ip, "18.66.52.227")
| project url
```

::: tip Flag
`https://owl-records.com/account/security-questions?question_1=mother's+maiden+name&answer_1=Washington&question_2=first+pet's+name&answer_2=Fluffy`
:::

## Less beef, more phish
### 3. What domain did IP 18.66.52.227 resolve to?

```sql
PassiveDns
| where ip == "18.66.52.227"
| distinct domain
```

::: tip Flag
`betterlyrics4u.com`
:::

### 4. Which column in the email table is most likely to contain our domain?

![writeup-1.png](/assets/soc/kc7cyber/a-rap-beef/writeup-1.png)

::: tip Flag
`link`
:::

### 5. How many results did we get from this query?

```sql
Email
| where link has "betterlyrics4u.com"
| count 
```

::: tip Flag
`13`
:::

### 6. Which email address was used to send most of these emails?

```sql
Email
| where link has "betterlyrics4u.com"
| summarize count=count() by sender
```

| sender                               | count |
| ------------------------------------ | ----- |
| ghostwritersanonymous@protonmail.com | 11    |
| wemakebeatz@gmail.com                | 2     |
::: tip Flag
`ghostwritersanonymous@protonmail.com`
:::

### 7. What was the other email address used to send these phishing emails?

::: tip Flag
`wemakebeatz@gmail.com`
:::

### 8. Which role was targeted the most of all?

```sql
let _targets = Email
| where link has "betterlyrics4u.com"
| distinct recipient;
Employees
| where email_addr in (_targets)
| summarize count=count() by role
```

| role        | count |
| ----------- | ----- |
| Rapper      | 9     |
| Lead Rapper | 1     |
::: tip Flag
`Rapper`
:::

### 9. Which role (other than Rapper) was targeted by this phishing campaign?

::: tip Flag
`Lead Rapper`
:::

### 10. And what is the name of the Lead Rapper?

```sql
Employees
| where role == 'Lead Rapper'
| project name
```

::: tip Flag
`Dwake Audrey`
:::

### 11. What is Dwake's IP address?

```sql
Employees
| where role == 'Lead Rapper'
| project ip_addr
```

::: tip Flag
`10.10.0.5`
:::

### 12. What was the subject of the email sent to Dwake?

```sql
Email
| where link has 'betterlyrics4u.com'
| where recipient == 'dwake_audrey@owl-records.com'
| project subject
```

::: tip Flag
`[EXTERNAL] RE: Need a ghostwriter for your next hit?`
:::

### 13. What link did the adversaries include in their phishing email targeting Dwake?

Change `project subject` to `project link` in previous query.

::: tip Flag
`http://betterlyrics4u.com/share/online/published/enter`
:::

### 14. What was the verdict of the email sent to Dwake?

Change `project subject` to `project verdict` in previous query.

::: tip Flag
`CLEAN`
:::

### 15. What name (or nickname) did the adversaries sign the email with?

![writeup-2.png](/assets/soc/kc7cyber/a-rap-beef/writeup-2.png)

::: tip Flag
`GhostWriter`
:::

### 16. When did Dwake click on the link in email? (copy and paste the time exactly)

```sql
OutboundNetworkEvents
| where url has "betterlyrics4u.com"
| where src_ip == "10.10.0.5"
```
  
| timestamp            | method | src_ip    | user_agent                                                                                                          | url                                                                                                              |
| -------------------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 2024-04-15T12:03:12Z | GET    | 10.10.0.5 | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36 | [http://betterlyrics4u.com/share/online/published/enter](http://betterlyrics4u.com/share/online/published/enter) |
::: tip Flag
`2024-04-15T12:03:12Z`
:::

### 17. What is written in the submit button for this login portal?

![writeup-3.png](/assets/soc/kc7cyber/a-rap-beef/writeup-3.png)

::: tip Flag
`Login to speak with GHOST WRITER`
:::

### 18. When did the adversaries attempt to login to Dwake's account?

```sql
AuthenticationEvents
| where username == "dwaudrey"
| where src_ip == "18.66.52.227"
| project timestamp
```

::: tip Flag
`2024-04-15T13:03:12Z`
:::

### 19. When did the adversaries attempt to login to Dwake's account?

```sql
AuthenticationEvents
| where username == "dwaudrey"
| where src_ip == "18.66.52.227"
| project result
```

::: tip Flag
`Successful Login`
:::

### 20. How many results do we get?

```sql
InboundNetworkEvents
| where timestamp between (datetime("2024-04-12T00:00:00") .. datetime("2024-05-01T00:00:00"))
| where url has "dwaudrey" 
| where src_ip == "18.66.52.227"
| count 
```

::: tip Flag
`10`
:::

### 21. What was the name of the zip file they used to steal information from Dwake's account?

```sql
InboundNetworkEvents
| where src_ip == "18.66.52.227"
| where url endswith "zip"
| project parse_url(url)['Query Parameters']
```

```json
"Query Parameters": {
	"download": "true",
	"mailbox_folder": "Drafts",
	"output": "DwakesDirtySecrets.zip",
	"user": "dwaudrey%40owl-records.com"
}
```

::: tip Flag
`DwakesDirtySecrets.zip`
:::

