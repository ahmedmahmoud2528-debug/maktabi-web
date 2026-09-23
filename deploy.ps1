# نشر مكتبي على GitHub Pages
$ErrorActionPreference = "Stop"
$env:Path = "$env:USERPROFILE\.maktabi-tools\node;" + $env:Path
Set-Location $PSScriptRoot
npm run build
New-Item -ItemType File -Path "dist\.nojekyll" -Force | Out-Null
$tmp = Join-Path $env:TEMP "maktabi-pages"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
Copy-Item "dist" $tmp -Recurse
Set-Location $tmp
git init -q -b gh-pages
git config core.autocrlf false
git add -A
git -c user.name="Maktabi Design" -c user.email="bd@koumra.com.sa" commit -q -m "publish"
$env:GIT_TERMINAL_PROMPT = "0"
git push -f "https://github.com/ahmedmahmoud2528-debug/maktabi-web.git" gh-pages:gh-pages
