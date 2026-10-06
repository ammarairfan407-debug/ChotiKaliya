param()
$logoB64 = Get-Content "C:\Users\hp\.gemini\antigravity\scratch\nanhi-kaliyan\logo_b64.txt" -Raw
$logoSrc = "data:image/jpeg;base64," + $logoB64.Trim()

$htmlHead = @"
<!DOCTYPE html>
<html lang="ur" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Nanhi Kaliyan | Little Buds - Little Buds Blooming at Home</title>
  <link rel="icon" type="image/jpeg" href="$logoSrc">
  <link rel="apple-touch-icon" href="$logoSrc">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            cream: '#FFF9EC',
            'cream-soft': '#FFFDF7',
            'cream-dark': '#FDF2D9',
            dark: '#3A3A4A',
            'dark-light': '#6B6A7D',
            pastel: {
              green: '#7BC96F',
              'green-dark': '#5CA850',
              yellow: '#FFD86B',
              'yellow-dark': '#F5BF3A',
              blue: '#8ED1FC',
              'blue-dark': '#5DB6F2',
              pink: '#FFB6C9',
              'pink-dark': '#F48BA7',
              orange: '#FFA765',
              'orange-dark': '#F08332',
              purple: '#B9A6F5',
              'purple-dark': '#9A82EB',
            }
          },
          fontFamily: {
            heading: ['Fredoka', 'sans-serif'],
            body: ['Poppins', 'sans-serif'],
            urdu: ['"Noto Nastaliq Urdu"', 'serif'],
          },
          boxShadow: {
            'glass': '0 8px 32px 0 rgba(100, 100, 140, 0.08)',
            'glass-lg': '0 16px 40px 0 rgba(100, 100, 140, 0.12)',
            'glow-sun': '0 0 24px rgba(255, 216, 107, 0.6)',
            'glow-bud': '0 0 24px rgba(123, 201, 111, 0.5)',
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #FFF9EC;
      color: #3A3A4A;
      font-family: 'Poppins', sans-serif;
      overflow-x: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    .font-urdu {
      font-family: 'Noto Nastaliq Urdu', serif;
      line-height: 2.1;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1.5px solid rgba(255, 255, 255, 0.75);
    }
    .glass-nav {
      background: rgba(255, 249, 236, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.8);
    }
    @keyframes floatGentle {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }
    @keyframes sway {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    @keyframes sunSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulseGlow {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.06); opacity: 1; }
    }
    .animate-float { animation: floatGentle 5s ease-in-out infinite; }
    .animate-sway { animation: sway 3s ease-in-out infinite; }
    .animate-sun-spin { animation: sunSpin 20s linear infinite; }
    .animate-glow { animation: pulseGlow 2.5s ease-in-out infinite; }
    .btn-bounce:active { transform: scale(0.94); }
    [dir="rtl"] { text-align: right; }
  </style>
</head>
<body class="min-h-screen flex flex-col selection:bg-pastel-pink/40">
"@

Set-Content -Path "C:\Users\hp\.gemini\antigravity\scratch\nanhi-kaliyan\index_part1.html" -Value $htmlHead -Encoding UTF8
Write-Host "Created index_part1.html"
