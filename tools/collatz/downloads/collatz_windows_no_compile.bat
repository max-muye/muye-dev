@echo off
setlocal
title Collatz 3n+1

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"function StepCount([System.Numerics.BigInteger]$n) { ^
  $steps = 0; ^
  while ($n -ne 1) { ^
    if (($n %% 2) -eq 0) { $n = $n / 2 } else { $n = $n * 3 + 1 } ^
    $steps++ ^
  } ^
  return $steps ^
}; ^
function ShowChain([System.Numerics.BigInteger]$n) { ^
  $start = $n; $highest = $n; $steps = 0; ^
  Write-Host -NoNewline $n; ^
  while ($n -ne 1) { ^
    if (($n %% 2) -eq 0) { $n = $n / 2 } else { $n = $n * 3 + 1 }; ^
    if ($n -gt $highest) { $highest = $n }; ^
    $steps++; ^
    Write-Host -NoNewline ('->' + $n) ^
  }; ^
  Write-Host ''; ^
  Write-Host ('Steps: ' + $steps); ^
  Write-Host ('Highest value: ' + $highest); ^
  if ($start -ne 0) { ^
    $ratio = [double]$highest / [double]$start; ^
    Write-Host ($start.ToString() + '*n = ' + $highest.ToString() + ' where n is about ' + $ratio) ^
  } ^
}; ^
function SaveSummaries() { ^
  $path = [IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'collatz.txt'); ^
  $n = [System.Numerics.BigInteger]1; $count = 0; ^
  Write-Host ('Writing to ' + $path); ^
  Write-Host 'Press Ctrl+C to stop.'; ^
  while ($true) { ^
    $x = $n; $next = $null; $steps = 0; ^
    if ($x -eq 1) { $next = 1 } else { ^
      if (($x %% 2) -eq 0) { $x = $x / 2 } else { $x = $x * 3 + 1 }; ^
      $next = $x; $steps++; ^
      while ($x -ne 1) { if (($x %% 2) -eq 0) { $x = $x / 2 } else { $x = $x * 3 + 1 }; $steps++ } ^
    }; ^
    Add-Content -Path $path -Value ($n.ToString() + ': next ' + $next.ToString() + ', total ' + $steps + ' steps'); ^
    $n++; $count++; ^
    if (($count %% 100) -eq 0) { Write-Host ('Saved through n = ' + $count) } ^
  } ^
}; ^
function SearchRecords() { ^
  $path = [IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'collatz_lifespan.txt'); ^
  $n = [System.Numerics.BigInteger]1; $best = -1; ^
  Write-Host ('Saving records to ' + $path); ^
  Write-Host 'Press Ctrl+C to stop.'; ^
  while ($true) { ^
    $steps = StepCount $n; ^
    if ($steps -gt $best) { ^
      $best = $steps; ^
      $line = 'cur largest lifespan ' + $best + ', num ' + $n; ^
      Write-Host $line; ^
      Add-Content -Path $path -Value $line ^
    }; ^
    $n++; ^
    if (($n %% 100000) -eq 0) { Write-Host ('checked through n = ' + $n) } ^
  } ^
}; ^
Write-Host '3n+1 / Collatz, no compile Windows batch'; ^
Write-Host 'Enter -1 repeat, 0 save summaries, -3 search records'; ^
while ($true) { ^
  $inputValue = Read-Host 'Enter number'; ^
  if ($inputValue -eq '-1') { continue }; ^
  if ($inputValue -eq '0') { SaveSummaries; break }; ^
  if ($inputValue -eq '-3') { SearchRecords; break }; ^
  try { ^
    $n = [System.Numerics.BigInteger]::Parse($inputValue); ^
    if ($n -le 0) { Write-Host 'Input must be positive.' } else { ShowChain $n } ^
  } catch { Write-Host 'Input must be an integer.' } ^
  Write-Host '' ^
}"

echo.
echo Press any key to close...
pause >nul
