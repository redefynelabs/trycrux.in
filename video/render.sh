#!/bin/sh
# Renders one cut of the hero video per region (the website's regions) into ../public/video:
# crux-hero-<region>.mp4, .webm and -poster.jpg. Pass regions to render only some: ./render.sh usd gbp
set -e
cd "$(dirname "$0")"
out=../public/video
regions=${*:-inr usd gbp eur aed}
for r in $regions; do
  code=$(echo "$r" | tr '[:lower:]' '[:upper:]')
  props="{\"region\":\"$code\"}"
  npx remotion render src/index.ts Hero "$out/crux-hero-$r.mp4" --codec h264 --crf 20 --props="$props"
  npx remotion render src/index.ts Hero "$out/crux-hero-$r.webm" --codec vp9 --crf 32 --props="$props"
  npx remotion still src/index.ts Hero "$out/crux-hero-$r-poster.jpg" --frame 330 --props="$props"
done
