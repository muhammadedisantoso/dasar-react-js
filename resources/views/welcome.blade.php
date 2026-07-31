<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel React Starter</title>
    
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>
<body>
    <!-- ID HARUS PERSIS "app" (huruf kecil semua) -->
    <div id="app"></div>
</body>
</html>