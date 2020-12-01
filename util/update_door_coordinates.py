import re

f = open('doordata.txt')

def update(m):
    val = int(m.group(2))
    new = int(round((val / 768) * 10000))
    return m.group(1) + ': ' + str(new)

for line in f:
    new = re.sub(r'(x|y): (\d+)', update, line)
    print(new, end='')
