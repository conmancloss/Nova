#!/bin/bash
node server.js &
sleep 3
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /tmp/cloudflared
chmod +x /tmp/cloudflared
/tmp/cloudflared tunnel --url http://localhost:1337 2>&1 | tee /tmp/tunnel.log &
sleep 8
grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/tunnel.log | head -1 | xargs -I{} echo "TUNNEL URL: {}"
wait
