import re
import os

css_file = r'c:\Users\SKILL GOVINDAN\OneDrive\Desktop\MoneyMap Saas\frontend\src\index.css'

with open(css_file, 'r', encoding='utf-8') as f:
    content = f.read()

variables = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary:        #2563eb;
  --primary-hover:  #1d4ed8;
  --primary-light:  #eff6ff;
  --income-color:   #16a34a;
  --expense-color:  #dc2626;
  --balance-color:  #2563eb;
  --bg-page:        #f1f5f9;
  --bg-card:        #ffffff;
  --bg-input:       #f8fafc;
  --text-primary:   #0f172a;
  --text-secondary: #475569;
  --text-muted:     #94a3b8;
  --border:         #e2e8f0;
  --border-input:   #cbd5e1;
  --border-focus:   #2563eb;
  --shadow-card:    0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  --shadow-hover:   0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06);
  --radius-sm:      6px;
  --radius-md:      10px;
  --radius-lg:      14px;
  --font:           'Inter', system-ui, -apple-system, sans-serif;
  --transition:     0.15s ease;
}
"""

if ":root {" not in content:
    content = variables + "\n" + content

# Replacements mapping
replaces = [
    (r'font-family:.*?sans-serif;', 'font-family: var(--font);'),
    (r'#f3f4f6', 'var(--bg-page)'),
    (r'#ffffff', 'var(--bg-card)'),
    (r'white', 'var(--bg-card)'),
    (r'#1f2937', 'var(--text-primary)'),
    (r'#111827', 'var(--text-primary)'),
    (r'#4b5563', 'var(--text-secondary)'),
    (r'#374151', 'var(--text-secondary)'),
    (r'#9ca3af', 'var(--text-muted)'),
    (r'#6b7280', 'var(--text-muted)'),
    (r'#e5e7eb', 'var(--border)'),
    (r'#d1d5db', 'var(--border-input)'),
    (r'#4f46e5', 'var(--primary)'),
    (r'#4338ca', 'var(--primary-hover)'),
    (r'#eef2ff', 'var(--primary-light)'),
    (r'#3730a3', 'var(--primary)'), # secondary indigo to primary
    (r'#10b981', 'var(--income-color)'),
    (r'#ef4444', 'var(--expense-color)'),
    (r'0 1px 3px 0 rgba\(0, 0, 0, 0\.1\), 0 1px 2px 0 rgba\(0, 0, 0, 0\.06\)', 'var(--shadow-card)'),
    (r'0 20px 25px -5px rgba\(0, 0, 0, 0\.1\), 0 10px 10px -5px rgba\(0, 0, 0, 0\.04\)', 'var(--shadow-hover)'),
    (r'border-radius: 8px', 'border-radius: var(--radius-md)'),
    (r'border-radius: 6px', 'border-radius: var(--radius-sm)')
]

for old, new in replaces:
    content = re.sub(old, new, content, flags=re.IGNORECASE)

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS updated successfully")
