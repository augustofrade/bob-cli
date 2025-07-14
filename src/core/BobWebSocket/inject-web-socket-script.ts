export default function injectWebSocketClientScript(html: string, port: number): string {
  const script = `
    <script>
      const ws = new WebSocket('ws://localhost:${port}');
      ws.onopen = () => console.info('BobWebSocket: connection established');
      ws.onmessage = (event) => {
        if(event.data === 'reload') {
          console.info('BobWebSocket: reloading page');
          window.location.reload();
        }
      }
    </script>
  `;

  html = html.replace(/<\/body>/gi, `${script}</body>`);
  return html;
}
