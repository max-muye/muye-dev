#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if ! command -v clang++ >/dev/null 2>&1 && ! command -v g++ >/dev/null 2>&1; then
  echo "C++ compiler is missing."
  echo "Install Apple's command line tools with:"
  echo "xcode-select --install"
  exit 1
fi

compiler="clang++"
if ! command -v clang++ >/dev/null 2>&1; then
  compiler="g++"
fi

"$compiler" -O3 -std=c++17 -march=native collatz.cpp -o collatz
chmod +x collatz
echo "Built: ./collatz"
echo
echo "Run normal:"
echo "./collatz"
echo
echo "Run fast record search:"
echo "./collatz -3"
