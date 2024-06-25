@echo off
SETLOCAL ENABLEEXTENSIONS
set t0=%TIME%, %DATE%

for %%F in (%*) do call :main %%F
goto finalmessage

:main
 SetLocal
  echo -----------------------------------------------------------------------------------
  echo. Processing file: %~f1
  echo.
  if not exist "%~dp1\%newdir%" mkdir "%~dp1\%newdir%"
@REM   Ou remplacer h264_cuvid par hevc
 "C:\Program Files\ffmpeg\bin\ffmpeg.exe" -c:v h264_cuvid -flags -global_header -i "%~f1" -c:v hevc_nvenc -map 0 -rc vbr -cq 26 -qmin 26 -qmax 26 -tag:v hvc1 "E:\temp\%~n1-x265.mkv"

 EndLocal
 goto :eof

:finalmessage
powershell write-host -fore cyan  ======================== Processing is FINISHED =========================
echo ----------------------------
echo Batch processing start time: %t0%
echo Batch processing end time:   %TIME%, %DATE%
echo ----------------------------
pause