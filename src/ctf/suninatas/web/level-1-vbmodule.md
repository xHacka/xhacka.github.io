# Level 1   VBModule

Challenge: [http://suninatas.com/challenge/web01/web01.asp](http://suninatas.com/challenge/web01/web01.asp)

![level-1.png](/assets/ctf/suninatas/web/level-1.png)

```java
<%
    str = Request("str")

    If not str = "" Then
        result = Replace(str,"a","aad")
        result = Replace(result,"i","in")
        result1 = Mid(result,2,2)
        result2 = Mid(result,4,6)
        result = result1 & result2
        Response.write result
        If result = "admin" Then
            pw = "????????"
        End if
    End if
%>
```

To solve this challenge we need to pass a string which in the ends up as `admin`. It can't be just `admin`, because goes through some "modifications"

```java
<%
str = "admin"
result = Replace(str,"a","aad")   // aaddmin
result = Replace(result,"i","in") // aaddminn
result1 = Mid(result,2,2)         // 
result2 = Mid(result,4,6)         
result = result1 & result2
Response.write result  
%>
```

[Replace Function](https://support.microsoft.com/en-us/office/replace-function-6acf209b-01b7-4078-b4b8-e0a4ef67d181)
[Mid Function](https://support.microsoft.com/en-us/office/mid-function-427e6895-822c-44ee-b34a-564a28f2532c)

For better debugging we can rewrite ASP to VBScript:

![level-1-1.png](/assets/ctf/suninatas/web/level-1-1.png)

```vb
Module VBModule
    Sub Main()
        Dim str As String = "ami"
        Dim result As String

        result = Replace(str, "a", "aad")
        Console.WriteLine(result)
        
        result = Replace(result, "i", "in")
        Console.WriteLine(result)
        
        Dim result1 As String = Mid(result, 2, 2)
        Console.WriteLine(result1)
        
        Dim result2 As String = Mid(result, 4, 6)
        Console.WriteLine(result)
        
        result = result1 & result2               
        Console.WriteLine(result)
    End Sub
End Module
```

Correct input is `ami`

> Authkey: `k09rsogjorejv934u592oi`

