# Java Script Kiddie

## Java Script Kiddie 1

### Description

AUTHOR:  JOHN JOHNSON

The image link appears broken... 
<https://jupiter.challenges.picoctf.org/problem/58112> or <http://jupiter.challenges.picoctf.org:58112>

### Analysis

```html
<html>
	<head>    
		<script src="jquery-3.3.1.min.js"></script>
		<script>
			var bytes = [];
			$.get("bytes", function(resp) {
				bytes = Array.from(resp.split(" "), x => Number(x));
			});

			function assemble_png(u_in){
				var LEN = 16;
				var key = "0000000000000000";
				var shifter;
				if(u_in.length == LEN){
					key = u_in;
				}
				var result = [];
				for(var i = 0; i < LEN; i++){
					shifter = key.charCodeAt(i) - 48;
					for(var j = 0; j < (bytes.length / LEN); j ++){
						result[(j * LEN) + i] = bytes[(((j + shifter) * LEN) % bytes.length) + i]
					}
				}
				while(result[result.length-1] == 0){
					result = result.slice(0,result.length-1);
				}
				document.getElementById("Area").src = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(result)));
				return false;
			}
		</script>
	</head>
	<body>
		<center>
			<form action="#" onsubmit="assemble_png(document.getElementById('user_in').value)">
				<input type="text" id="user_in">
				<input type="submit" value="Submit">
			</form>
			<img id="Area" src=""/>
		</center>
	</body>
</html>
```

1. Form takes in user input and creates png.
2. PNG gets data is collected from `/bytes` path. [here](https://jupiter.challenges.picoctf.org/problem/58112/bytes)
3. Key length is 16.
4. If user input matches key length the user input becomes key.
5. PNG image gets mangled by shifter.
6. `shifter = key.charCodeAt(i) - 48;` Converts string into integer. ("0" -> 0)
7. Mangling happens on each column of PNG image.

To get the correct key we need to match first 16 Bytes with the correct PNG Image. The program mangles 16 column and first 16 Bytes of PNG is already known from [Wikipedia](https://www.wikiwand.com/en/PNG#Examples).<br>
`89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52`

If we match first byte of column to header byte we can get the key. 

### Solution

```py
LEN = 16
PNG_HEADER = '89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52'
PNG_BYTES = '''128 252 182 115 177 211 142 252 189 248 130 93 154 0 68 90 131 255 204 170 239 167 18 51 233 43 0 26 210 72 95 120 227 7 195 126 207 254 115 53 141 217 0 11 118 192 110 0 0 170 248 73 103 78 10 174 208 233 156 187 185 65 228 0 137 128 228 71 159 10 111 10 29 96 71 238 141 86 91 82 0 214 37 114 7 0 238 114 133 0 140 0 38 36 144 108 164 141 63 2 69 73 15 65 68 0 249 13 0 64 111 220 48 0 55 255 13 12 68 41 66 120 188 0 73 27 173 72 189 80 0 148 0 64 26 123 0 32 44 237 0 252 36 19 52 0 78 227 98 88 1 185 1 128 182 177 155 44 132 162 68 0 1 239 175 248 68 91 84 18 223 223 111 83 26 188 241 12 0 197 57 89 116 96 223 96 161 45 133 127 125 63 80 129 69 59 241 157 0 105 57 23 30 241 62 229 128 91 39 152 125 146 216 91 5 217 16 48 159 4 198 23 108 178 199 14 6 175 51 154 227 45 56 140 221 0 230 228 99 239 132 198 133 72 243 93 3 86 94 246 156 153 123 1 204 200 233 143 127 64 164 203 36 24 2 169 121 122 159 40 4 25 64 0 241 9 94 220 254 221 122 8 22 227 140 221 248 250 141 66 78 126 190 73 248 105 5 14 26 19 119 223 103 165 69 177 68 61 195 239 115 199 126 61 41 242 175 85 211 11 5 250 93 79 194 78 245 223 255 189 0 128 9 150 178 0 112 247 210 21 36 0 2 252 144 59 101 164 185 94 232 59 150 255 187 1 198 171 182 228 147 73 149 47 92 133 147 254 173 242 39 254 223 214 196 135 248 34 146 206 63 127 127 22 191 92 88 69 23 142 167 237 248 23 215 148 166 59 243 248 173 210 169 254 209 157 174 192 32 228 41 192 245 47 207 120 139 28 224 249 29 55 221 109 226 21 129 75 41 113 192 147 45 144 55 228 126 250 127 197 184 155 251 19 220 11 241 171 229 213 79 135 93 49 94 144 38 250 121 113 58 114 77 111 157 146 242 175 236 185 60 67 173 103 233 234 60 248 27 242 115 223 207 218 203 115 47 252 241 152 24 165 115 126 48 76 104 126 42 225 226 211 57 252 239 21 195 205 107 255 219 132 148 81 171 53 79 91 27 174 235 124 213 71 221 243 212 38 224 124 54 77 248 252 88 163 44 191 109 63 189 231 251 189 242 141 246 249 15 0 2 230 7 244 161 31 42 182 219 15 221 164 252 207 53 95 99 60 190 232 78 255 197 16 169 252 100 164 19 158 32 189 126 140 145 158 116 245 68 94 149 111 252 74 135 189 83 74 71 218 99 220 208 87 24 228 11 111 245 1 0 98 131 46 22 94 71 244 22 147 21 83 155 252 243 90 24 59 73 247 223 127 242 183 251 124 28 245 222 199 248 122 204 230 79 219 147 11 225 202 239 24 132 55 89 221 143 151 137 63 150 79 211 8 16 4 60 63 99 65 0 2'''
# PNG_BYTES = __import__("requests").get("https://jupiter.challenges.picoctf.org/problem/58112/bytes").text # Get Bytes Automatically

png_header = list(map(lambda i: int(i, 16), PNG_HEADER.split()))
png_bytes  = list(map(int,                  PNG_BYTES .split()))
png_bytes_len = len(png_bytes)

key = ""
for i in range(LEN):
    for shifter in range(10):
        index = (shifter * LEN) % png_bytes_len + i
        if png_header[i] == png_bytes[index]:
            key += str(shifter)
            break

print(f"{key=}")
```
::: tip
Key: 4894748485167104
:::

![java-script-kiddie-1](/assets/ctf/picoctf/java-script-kiddie-1.png)

Using online [QRCode Decoder](https://qrcode-decoder.com) we get the flag.

![java-script-kiddie-2](/assets/ctf/picoctf/java-script-kiddie-2.png)
::: tip Flag
`picoCTF{7b15cfb95f05286e37a22dda25935e1e}`
:::

## Java Script Kiddie 2

### Description

The image link appears broken... twice as badly... <br>
<https://jupiter.challenges.picoctf.org/problem/42899> or <http://jupiter.challenges.picoctf.org:42899>

### Analysis

```js
function assemble_png(u_in){
	var LEN = 16;
	var key = "00000000000000000000000000000000";
	var shifter;
	if(u_in.length == key.length){
		key = u_in;
	}
	var result = [];
	for (var i = 0; i < LEN; i++) {
		shifter = Number(key.slice((i*2),(i*2)+1));
		for(var j = 0; j < (bytes.length / LEN); j ++){
			result[(j * LEN) + i] = bytes[(((j + shifter) * LEN) % bytes.length) + i]
	}
}
```

The program is a little different from previous challenge. Here we have key with length of 32. <br>
`shifter =  Number(key.slice((i*2),(i*2)+1));` shifter is the key located at odd index values in incremental order. 
* If key="1234...", shifter = 1 -> shifter = 3 -> ... (Essentially every second item is discarded.)

### Solution

```py
LEN = 16
PNG_HEADER = '89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52'
PNG_BYTES = '''252 127 185 254 13 114 103 73 255 0 0 13 231 72 219 16 59 96 78 211 0 159 239 10 62 0 0 0 66 192 242 71 20 140 1 9 118 53 68 114 248 120 156 237 73 81 162 187 160 125 0 134 173 73 60 65 112 14 208 163 0 55 252 71 48 119 134 121 244 29 251 116 69 192 229 223 155 201 223 0 157 186 146 0 134 157 175 251 0 227 124 15 56 33 255 82 191 80 12 71 181 0 170 31 1 56 239 188 7 206 232 108 137 0 241 114 98 10 119 17 84 253 34 83 2 209 130 227 0 0 95 2 227 0 0 80 97 36 145 72 243 57 68 35 164 12 7 127 183 73 26 120 113 239 252 247 17 98 95 58 48 213 8 163 33 3 1 171 66 13 236 67 146 113 138 254 205 192 145 219 156 0 68 208 14 2 246 56 248 79 216 239 203 10 136 147 64 122 121 231 6 81 142 181 237 249 73 136 165 243 57 241 125 252 5 20 144 20 40 19 255 146 89 51 188 76 244 218 127 107 145 68 217 202 41 3 199 149 59 42 136 246 123 182 242 252 250 72 61 127 16 175 0 121 135 73 128 36 112 88 8 33 0 123 250 1 246 56 50 88 144 240 83 186 27 136 208 239 163 238 1 156 205 221 249 191 17 240 124 99 0 19 155 0 243 172 228 114 48 215 255 28 254 51 121 122 28 90 223 25 25 43 203 243 246 45 7 115 252 72 145 108 219 156 200 21 44 210 156 101 172 161 166 123 231 82 255 0 255 211 22 40 9 173 219 58 155 187 144 212 245 221 25 169 157 43 46 249 63 172 208 204 201 90 75 133 145 245 234 50 143 32 183 84 191 252 144 172 161 160 91 41 39 128 143 195 178 151 123 114 88 197 94 51 4 241 110 92 190 77 199 254 63 35 40 107 240 62 101 130 152 143 155 199 31 162 253 112 214 118 130 252 113 211 90 243 34 35 42 90 44 112 233 87 158 242 237 99 19 160 5 222 40 203 178 14 172 201 235 10 222 223 128 191 75 241 37 135 217 227 69 99 5 74 201 103 16 251 75 249 115 41 25 171 34 214 185 252 154 95 104 68 245 127 156 67 115 221 21 233 251 74 252 253 213 103 171 32 233 129 251 230 245 206 210 173 156 246 186 111 195 129 7 242 207 111 6 0 190 144 91 163 233 250 218 247 126 242 240 110 108 255 176 116 155 114 136 41 211 101 251 165 249 181 51 238 185 69 181 147 151 210 249 154 62 105 85 123 127 237 155 95 254 234 251 116 25 43 230 91 59 56 48 223 146 35 191 223 61 147 42 230 111 90 131 95 245 174 57 248 249 252 140 155 95 177 158 163 25 146 149 57 93 7 114 16 252 54 191 159 183 210 121 239 192 5 198 30 31 91 103 129 219 69 78 201 29 12 150 201 149 157 173 63 217 41 0 215 175 105 63 119 122 203 201 113 58 190 48 252 85 183 147 248 252 247 237 207 99 242 231 229 57 121 212 254 15 91 127 30 227 246 207 252 222 240 0 254 172 254 112 78 68 174 188 96 141 140'''
# PNG_BYTES = __import__("requests").get("https://jupiter.challenges.picoctf.org/problem/42899/bytes").text # Get Bytes Automatically

png_header = list(map(lambda i: int(i, 16), PNG_HEADER.split()))
png_bytes  = list(map(int,                  PNG_BYTES .split()))
png_bytes_len = len(png_bytes)

key = ""
for i in range(LEN):
    for shifter in range(10):
        index = (shifter * LEN) % png_bytes_len + i
        if png_header[i] == png_bytes[index]:
            key += str(shifter) + "0" # <- Only Change, Added Padding
            break

print(f"{key=}")
```
::: tip
Key: 70601060007090105000000020008050
:::

Using online [QRCode Decoder](https://qrcode-decoder.com) recover the flag.
::: tip Flag
`picoCTF{227c2d3465a6a4bcc8a1bc599e34f074}`
:::