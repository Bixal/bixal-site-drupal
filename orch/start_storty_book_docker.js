#!/usr/bin/env bash

runuser -l node -c 'export NODE_OPTIONS="--max-old-space-size=8192" && node -e '\''console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'\'' > /tmp/node_mem.log && cd /app && npm start' > /tmp/story_book_start.log 2>&1
