# نشر مكتبي على GitHub Pages: يبني المشروع ويدفع مجلد dist إلى فرع gh-pages
$ErrorActionPreference = "Stop"
$env:Path = "$env:USERPROFILE\.maktabi-tools\node;" + $env:Path
Set-Location $PSScriptRoot

npm run build

New-Item -ItemType File -Path "dist\.nojekyll" -Force | Out-Null
$tmp = Join-Path $env:TEMP "maktabi-pages"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
Copy-Item "dist" $tmp -Recurse

Push-Location $tmp
git init -q -b gh-pages
git add -A
git -c user.name="Maktabi Design" -c user.email="bd@koumra.com.sa" commit -q -m "نشر: بناء الإنتاج"
git push -f "https://github.com/ahmedmahmoud2528-debug/maktabi-web.git" gh-pages:gh-pages
Pop-Location

Write-Host "تم النشر: https://ahmedmahmoud2528-debug.github.io/maktabi-web/"
