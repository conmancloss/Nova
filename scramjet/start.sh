cat > "/Users/closcon000/Downloads/Nova-main 5/start.sh" << 'EOF'
#!/bin/bash

# Start Nova server in background
node scramjet/server.js &

# Wait for server to start
sleep 3

# Download cloudflared
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O /tmp/cloudflared
chmod +x /tmp/cloudflared

# Start tunnel and log the URL
/tmp/cloudflared tunnel --url http://localhost:1337 2>&1 | tee /tmp/tunnel.log &

# Wait for tunnel URL to appear then print it clearly
sleep 8
grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/tunnel.log | head -1 | xargs -I{} echo "TUNNEL URL: {}"

# Keep container alive
wait
EOF
chmod +x "/Users/closcon000/Downloads/Nova-main 5/start.sh"
