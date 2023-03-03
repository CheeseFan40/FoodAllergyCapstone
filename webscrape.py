from urllib.request import urlopen
import re
import json

url = "https://www.wendys.com/en-uk/menu-items/avocado-chicken-club"
open = urlopen(url)

x = open.read()
y = x.decode("utf-8")
print(y)

#z = re.findall(r'Contains (.*?)\)\,', y)
z = re.findall(r'<h3>(.*?)</h3>', y)
print(z)



data = json.dumps(z)

#remove first element in list
z.remove(z[0])
print(z)

json_data = json.loads(data)
print(json_data)

x = json_data
c = x[0]
print(c)

realdata = { f"Menu Item": c,
"Ingredients": [
    {"Menu Ingredients": z
    }
]
}

print(realdata)

with open("new.json", 'wb') as fp:
    fp.write(realdata)


    



