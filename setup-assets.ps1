Add-Type -AssemblyName System.Drawing

# 1. Convert Splash PNG to GIF
$splashPath = "C:\Users\Dell\.gemini\antigravity-ide\brain\791736de-0cad-4436-a943-3268c8ab59c2\installer_splash_screen_1786431233240.png"
$gifPath = "c:\liya-browser\icons\windows-installer.gif"

$img2 = [System.Drawing.Image]::FromFile($splashPath)
$fs2 = New-Object System.IO.FileStream($gifPath, [System.IO.FileMode]::Create)
$img2.Save($fs2, [System.Drawing.Imaging.ImageFormat]::Gif)
$fs2.Close()
$img2.Dispose()

Write-Host "Splash screen converted to GIF."
