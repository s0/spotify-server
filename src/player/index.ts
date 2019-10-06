function start() {
  const ws = new WebSocket(`ws://${location.host}/${location.pathname}`);

  ws.addEventListener('close', () => {
    console.log('Socket Closed, reconnecting in 1 second');
    setTimeout(start, 1000);
  });

  ws.addEventListener('error', err => {
    console.error(err);
  });

  ws.addEventListener('open', () => {
    console.log('open!');
    ws.send('foo');
  });

  ws.addEventListener('message', msg => {
    console.log(msg);
  });

}

start();
