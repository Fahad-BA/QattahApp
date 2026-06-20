#!/bin/bash
# Performance benchmark for Qattah App
# Repeatable benchmark: same conditions, same order, warm-up round

HOST="http://localhost:3000"
ROUNDS=10
RESULTS_FILE="bench-results.txt"

# Dynamically discover all endpoints from dist/
ENDPOINTS=()

# Always test root HTML
ENDPOINTS+=("/|HTML")

# Discover JS/CSS assets
for f in dist/assets/*.js; do
  name=$(basename "$f")
  path="/assets/$name"
  if [[ "$name" == *"vendor-react"* ]]; then
    ENDPOINTS+=("$path|JS-React(177KB)")
  elif [[ "$name" == *"vendor-icons"* ]]; then
    ENDPOINTS+=("$path|JS-Icons(15KB)")
  elif [[ "$name" == *"vendor-other"* ]]; then
    ENDPOINTS+=("$path|JS-Other(4KB)")
  elif [[ "$name" == *"index"* ]]; then
    ENDPOINTS+=("$path|JS-App(23KB)")
  elif [[ "$name" == *"rolldown"* ]]; then
    ENDPOINTS+=("$path|JS-Runtime(1KB)")
  else
    ENDPOINTS+=("$path|JS-$(basename $f .js)")
  fi
done

for f in dist/assets/*.css; do
  name=$(basename "$f")
  ENDPOINTS+=("/assets/$name|CSS(28KB)")
done

# Other static files
for f in manifest.webmanifest manifest.json robots.txt sw.js registerSW.js workbox-*.js; do
  if [ -f "dist/$f" ]; then
    label=$(echo "$f" | sed 's/workbox-.*\.js/Workbox/')
    ENDPOINTS+=("/$f|$label")
  fi
done

echo "======================================" > "$RESULTS_FILE"
echo "Qattah App Performance Benchmark" >> "$RESULTS_FILE"
echo "Host: $HOST" >> "$RESULTS_FILE"
echo "Date: $(date -u '+%Y-%m-%d %H:%M:%S UTC')" >> "$RESULTS_FILE"
echo "Rounds: $ROUNDS per endpoint (with warm-up)" >> "$RESULTS_FILE"
echo "======================================" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

printf "%-30s %8s %8s %8s %10s %10s\n" "Endpoint" "Avg" "Min" "Max" "Size" "Transfer" >> "$RESULTS_FILE"
printf "%-30s %8s %8s %8s %10s %10s\n" "--------" "---" "---" "---" "----" "--------" >> "$RESULTS_FILE"

ALL_PASS=true

for ep_data in "${ENDPOINTS[@]}"; do
  IFS='|' read -r path label <<< "$ep_data"
  
  # Warm-up request
  curl -s -o /dev/null --compressed "$HOST$path" 2>/dev/null
  
  times=()
  total=0
  min_time=999999
  max_time=0
  last_transfer=""
  last_size=""
  
  for i in $(seq 1 $ROUNDS); do
    result=$(curl -s -o /dev/null -w "%{time_total}:%{size_download}:%{speed_download}" \
      --compressed \
      -H "Accept-Encoding: br, gzip" \
      "$HOST$path" 2>/dev/null)
    
    time_ms=$(echo "$result" | cut -d: -f1 | awk '{printf "%.0f", $1 * 1000}')
    size=$(echo "$result" | cut -d: -f2)
    speed=$(echo "$result" | cut -d: -f3)
    
    last_transfer=$size
    last_size=$speed
    
    total=$((total + time_ms))
    
    if [ $time_ms -lt $min_time ]; then min_time=$time_ms; fi
    if [ $time_ms -gt $max_time ]; then max_time=$time_ms; fi
  done
  
  avg=$((total / ROUNDS))
  
  # Check if under 50ms
  if [ $avg -ge 50 ]; then
    ALL_PASS=false
  fi
  
  # Human-readable sizes
  if [ $last_transfer -gt 1024 ]; then
    h_transfer="$(awk "BEGIN {printf \"%.1fKB\", $last_transfer/1024}")"
  else
    h_transfer="${last_transfer}B"
  fi
  
  printf "%-30s %6sms %6sms %6sms %10s %10s\n" "$label" "$avg" "$min_time" "$max_time" "$h_transfer" "" >> "$RESULTS_FILE"
done

echo "" >> "$RESULTS_FILE"
if [ "$ALL_PASS" = true ]; then
  echo "✅ ALL ENDPOINTS UNDER 50ms" >> "$RESULTS_FILE"
else
  echo "❌ SOME ENDPOINTS EXCEED 50ms" >> "$RESULTS_FILE"
fi
echo "======================================" >> "$RESULTS_FILE"

cat "$RESULTS_FILE"
