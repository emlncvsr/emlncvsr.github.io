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
 "C:\Program Files\ffmpeg\bin\ffmpeg.exe" -c:v hevc -i "%~f1" -c:v hevc_nvenc -map 0 -rc vbr -cq 26 -qmin 26 -qmax 26 -tag:v hvc1 "E:\temp\%~n1-x265.mkv"

 "C:\Program Files\MKVToolNix\mkvmerge.exe" --ui-language fr --priority lower --output "E:\temp\%~n1-x265-finished.mkv" --language 0:ja --display-dimensions 0:1920x1080 --language 1:fr --default-track-flag 1:no --forced-display-flag 1:no --language 2:ja --default-track-flag 2:yes --sub-charset 3:UTF-8 --language 3:fr --track-name 3:Forced --default-track-flag 3:no --forced-display-flag 3:no --sub-charset 4:UTF-8 --language 4:fr --default-track-flag 4:yes "E:\temp\%~n1-x265.mkv" --title "" --track-order 0:0,0:2,0:1,0:4,0:3
  del "E:\temp\%~n1-x265.mkv"

 EndLocal
 goto :eof

:finalmessage
powershell write-host -fore cyan  ======================== Processing is FINISHED =========================
echo ----------------------------
echo Batch processing start time: %t0%
echo Batch processing end time:   %TIME%, %DATE%
echo ----------------------------
pause