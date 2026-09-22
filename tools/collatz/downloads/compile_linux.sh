#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if ! command -v g++ >/dev/null 2>&1; then
  echo "g++ is missing."
  echo "On Ubuntu, install it with:"
  echo "sudo apt update && sudo apt install -y g++"
  exit 1
fi

g++ -O3 -std=c++17 -march=native collatz.cpp -o collatz
chmod +x collatz
echo "Built: ./collatz"
echo
echo "Run normal:"
echo "./collatz"
echo
echo "Run fast record search:"
echo "./collatz -3"
