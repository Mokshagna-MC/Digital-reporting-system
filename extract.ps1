$content = [System.IO.File]::ReadAllText("f:\Project\nilesh\digital-reporting-system-nilesh\digital-reporting-system-v2\src\main\resources\static\app.js")
$pattern = '["'']#([a-zA-Z0-9_-]+)["'']'
$matches = [System.Text.RegularExpressions.Regex]::Matches($content, $pattern)
$list = New-Object System.Collections.Generic.List[string]
foreach ($m in $matches) {
    $id = $m.Groups[1].Value
    if (-not $list.Contains($id)) {
        $list.Add($id)
    }
}
$list.Sort()
[System.IO.File]::WriteAllLines("f:\Project\nilesh\digital-reporting-system-nilesh\digital-reporting-system-v2\js_ids_extracted.txt", $list)
Write-Host "Found $($list.Count) unique IDs in app.js"

