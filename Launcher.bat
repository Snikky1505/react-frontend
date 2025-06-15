@echo off

@REM cd /d D:\project\sijitu-frontend
cd /d D:\react-frontend

echo Pulling latest code from Git...
git pull origin main

echo Starting development server...
npm run dev

pause
