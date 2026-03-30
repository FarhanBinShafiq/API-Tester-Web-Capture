# Build Script for Chrome and Firefox Extensions
$ProjectName = "api_tester_extension"
$BuildDir = "build"
$ChromeDir = "$BuildDir/chrome"
$FirefoxDir = "$BuildDir/firefox"

# 1. Clean and Create Build Directories
if (Test-Path $BuildDir) { Remove-Item -Recurse -Force $BuildDir }
New-Item -ItemType Directory -Path $ChromeDir
New-Item -ItemType Directory -Path $FirefoxDir

# 2. Files to include
$Files = @("popup.html", "popup.js", "background.js", "icons", "manifest.json")

# 3. Copy files to both directories
foreach ($File in $Files) {
    Copy-Item -Path $File -Destination $ChromeDir -Recurse
    Copy-Item -Path $File -Destination $FirefoxDir -Recurse
}

# 4. Modify Manifest for Firefox
# Firefox MV3 prefers 'background.scripts' over 'background.service_worker'
$ManifestPath = "$FirefoxDir/manifest.json"
$Manifest = Get-Content $ManifestPath | ConvertFrom-Json

# Remove sidebar_action if it exists (Firefox supports it, but Chrome doesn't)
# Actually, we kept both in the source manifest which is fine.
# But we MUST fix the background key for Firefox compatibility in some environments.

$Manifest.background = @{
    scripts = @("background.js")
}

# Remove Chrome-only permissions for Firefox
$Manifest.permissions = $Manifest.permissions | Where-Object { $_ -ne "sidePanel" }

# Add Firefox-required settings
# We re-create the Gecko block to ensure it's structured correctly for JSON
$gecko = @{
    id = "api-tester-web-capture@farhan.com"
    strict_min_version = "142.0"
}

# Firefox data collection settings (required for new extensions)
$gecko.Add("data_collection_permissions", @{
    basis = "opt-in"
    required = $false
})

$Manifest.browser_specific_settings = @{ gecko = $gecko }

$Manifest | ConvertTo-Json -Depth 10 | Set-Content $ManifestPath

# 5. Create ZIP files
Write-Host "Creating ZIP for Chrome..." -ForegroundColor Cyan
Compress-Archive -Path "$ChromeDir/*" -DestinationPath "$BuildDir/chrome_extension.zip" -Force

Write-Host "Creating ZIP for Firefox..." -ForegroundColor Cyan
Compress-Archive -Path "$FirefoxDir/*" -DestinationPath "$BuildDir/firefox_extension.zip" -Force

Write-Host "Build Complete! Check the '$BuildDir' folder." -ForegroundColor Green
Write-Host "Chrome ZIP: $BuildDir/chrome_extension.zip"
Write-Host "Firefox ZIP: $BuildDir/firefox_extension.zip"
