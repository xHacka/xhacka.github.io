# L33tcoder

## Description

Six rounds of interviews and you still have to do this?

Source: [l33tcoder.zip](https://ctf.uscybergames.com/files/70e4288f7f8740f5701fc57ed10ba80c/l33tcoder.zip?token=eyJ1c2VyX2lkIjoxMDY4LCJ0ZWFtX2lkIjpudWxsLCJmaWxlX2lkIjo1fQ.aEmtAg.uL662FeXUZCBSTCce-0EPEphS-Y)

Author: [@tsuto](https://github.com/jselliott)

## Solution

Application is a sandbox for Python, we are given assignment but as always we need RCE to read the `flag.txt`

![L33tcoder.png](/assets/ctf/uscybergames/l33tcoder.png)

Application comes with custom module called `uscg-leetcode-validator`, which is the sandboxing software~ It always has `code_path (argv[1])` and `test_path (argv[2])`.

![L33tcoder-1.png](/assets/ctf/uscybergames/l33tcoder-1.png)

`leetcode_validator/main.py`:
```python
ALLOWED_NODES = {
    ast.Module, ast.FunctionDef, ast.arguments, ast.arg,
    ast.Assign, ast.AugAssign, ast.Return,
    ast.For, ast.While, ast.If, ast.Break, ast.Continue,
    ast.Expr,
    ast.Name, ast.Load, ast.Store,
    ast.Constant, ast.BinOp, ast.UnaryOp, ast.BoolOp, ast.Compare,
    ast.Subscript, ast.List, ast.Tuple,
    ast.Call,
    ast.Add, ast.Sub, ast.Mult, ast.Div, ast.FloorDiv, ast.Mod, ast.Pow,
    ast.And, ast.Or, ast.Not,
    ast.Eq, ast.NotEq, ast.Lt, ast.LtE, ast.Gt, ast.GtE,
}

SAFE_FUNCTIONS = {"len", "range", "min", "max", "sum", "abs", "enumerate"}

def validate_code(path):
    with open(path, "r") as f: source = f.read()
    tree = ast.parse(source)

    # Must be a single top-level function
    if len(tree.body) != 1 or not isinstance(tree.body[0], ast.FunctionDef):
        raise ValueError("Submission must contain exactly one top-level function.")

    for node in ast.walk(tree):
        if type(node) not in ALLOWED_NODES:
            raise ValueError(f"Disallowed AST node: {type(node).__name__}")

        # Disallow all imports
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            raise ValueError("Imports are not allowed.")

        # Allow safe function calls only
        if isinstance(node, ast.Call):
            if not isinstance(node.func, ast.Name) or node.func.id not in SAFE_FUNCTIONS:
                raise ValueError(f"Function call to '{getattr(node.func, 'id', '?')}' is not allowed.")

    return tree.body[0].name

def load_player_function(path):
    """
    Validate and load the player's submitted function from a file.
    Returns the function object.
    """
    func_name = validate_code(path)
    spec = importlib.util.spec_from_file_location("player_code", path)
    module = importlib.util.module_from_spec(spec)
    sys.modules["player_code"] = module
    spec.loader.exec_module(module)

    if not hasattr(module, func_name): raise RuntimeError("Function not found after module load.")

    func = getattr(module, func_name)
    if not callable(func): raise RuntimeError("Submitted object is not callable.")
    return func
```

We are very limited in terms of code execution. 

Code may only have
1. 1 top level function
2. No imports
3. defined safe functions

By normal standards we cannot execute any python code via function itself.

After some research I found similar web challenge writeup: [https://blog.arkark.dev/2022/11/18/seccon-en/#misc-latexipy](https://blog.arkark.dev/2022/11/18/seccon-en/#misc-latexipy) and [https://note.tonycrane.cc/writeups/seccon2022/](https://note.tonycrane.cc/writeups/seccon2022/)

Turns out python has "Magic Comments" ([How does the "magic lines(s)" in python work, when specifying encoding in python file?](https://stackoverflow.com/questions/6077479/how-does-the-magic-liness-in-python-work-when-specifying-encoding-in-python)) which we can abuse.

![L33tcoder-2.png](/assets/ctf/uscybergames/l33tcoder-2.png)

::: tip Flag
`SVUSCG{a400dcfadd525006cb3747846c3d60cc}`
:::

