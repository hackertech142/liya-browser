from PIL import Image

# 1. Convert PNG to ICO
img = Image.open(r"C:\Users\Dell\.gemini\antigravity-ide\brain\791736de-0cad-4436-a943-3268c8ab59c2\liya_browser_logo_v2_1786430994624.png")
icon_sizes = [(256, 256)]
img.save(r"c:\liya-browser\icons\icon256.ico", format="ICO", sizes=icon_sizes)
print("Saved icon256.ico")

# 2. Convert Splash to GIF
splash = Image.open(r"C:\Users\Dell\.gemini\antigravity-ide\brain\791736de-0cad-4436-a943-3268c8ab59c2\installer_splash_screen_1786431233240.png")
# Convert to RGB just in case
splash = splash.convert("RGB")
splash.save(r"c:\liya-browser\icons\windows-installer.gif", format="GIF")
print("Saved windows-installer.gif")
