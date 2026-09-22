Collatz native worker
=====================

Files:
- collatz.cpp: source code
- compile_linux.sh: compile on Ubuntu/Linux
- compile_mac.sh: compile on macOS
- compile_windows.bat: compile on Windows with Dev-C++ g++

Ubuntu/Linux:
1. Open Terminal in this folder.
2. If needed, install g++:
   sudo apt update && sudo apt install -y g++
3. Run:
   chmod +x compile_linux.sh
   ./compile_linux.sh

macOS:
1. Open Terminal in this folder.
2. Run:
   chmod +x compile_mac.sh
   ./compile_mac.sh

Windows:
1. Open this folder.
2. Double-click compile_windows.bat.
3. It will create collatz.exe.

How to use:
- ./collatz
  Normal calculator.

- ./collatz -1
  Repeat mode.

- ./collatz 1412987847
  Print the chain and highest value.

- ./collatz 0
  Save every number summary to collatz.txt on the Desktop.

- ./collatz -3
  Fast record-lifespan search. Saves only records to collatz_lifespan.txt on the Desktop.
