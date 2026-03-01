#!/bin/bash

ALLOWED_FILE="/etc/allowed-commands"

if [ ! -f "$ALLOWED_FILE" ]; then
  echo "Error: Command whitelist not found"
  exit 1
fi

CMD=$(echo "$1" | awk '{print $1}')

if grep -qx "$CMD" "$ALLOWED_FILE"; then
  eval "$1"
else
  echo "Command not allowed: $CMD"
  exit 1
fi
