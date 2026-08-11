import urllib.request
import re
import json

url = 'https://docs.google.com/forms/d/e/1FAIpQLScTnBUWULDJ4ysyeTs50qlx6vhTfR7SGu4D3gyyPjUiCYy0Lw/viewform'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# FB_PUBLIC_LOAD_DATA_ araması
match = re.search(r'FB_PUBLIC_LOAD_DATA_ = (\[.*?\]);', html, re.DOTALL)
if match:
    print('Found FB_PUBLIC_LOAD_DATA_')
    data_str = match.group(1)
    print(data_str[:5000])
else:
    print('FB_PUBLIC_LOAD_DATA_ not found')
    # Form alanlarını farklı ara
    # entry. ile başlayan input isimlerini ara
    entries = re.findall(r'entry\.(\d+)', html)
    print('Entry IDs:', list(set(entries))[:20])
    
    # Form başlık alanlarını ara
    titles = re.findall(r'"([^"]{5,100})"', html[:50000])
    print('Some titles:', titles[:30])
