@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:4175 in your browser after the preview starts.
echo Keep this window open while viewing your portfolio.
py preview.py
pause
