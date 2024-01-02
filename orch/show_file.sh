#!/usr/bin/env bash

if [ "$2" == 'end' ]; then
  POSITION='Finished'
else
  POSITION='Started'
fi
echo ""
printf '=%.0s' {1..100}
echo ""
echo "    $POSITION Running $1"
printf '=%.0s' {1..100}
echo ""
echo ""
