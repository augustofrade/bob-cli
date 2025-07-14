export default function injectWebSocketClientScript(html: string, port: number): string {
  const script = `
    <!-- BobWebSocket client script injected by BobServer -->
    <script>
      if("WebSocket" in window)  {
        const ws = new WebSocket('ws://localhost:${port}');
        ws.onopen = () => console.info('BobWebSocket: connection established');
        ws.onmessage = (event) => {
          if(event.data === 'reload') {
            console.info('BobWebSocket: reloading page');
            window.location.reload();
          }
        }
      } else {
        console.warn('BobWebSocket: WebSocket is not supported in this browser');
      }
    </script>
  `;

  html = html.replace(/<\/body>/gi, `${script}</body>`);
  return html;
}
