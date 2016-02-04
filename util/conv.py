#!/usr/bin/env python3

# Converts a 9mng save file into a 
# json output

import json

file = open('Edata.txt','r')
lines = file.read().split('\n')
file.close()

o = []

for ln in lines:
    o.append(ln.split(','))

oString = ""
oString += "9mng.exampleData="
oString += json.dumps(o)
oString += ";"

file = open('out.js','w')
file.write(oString)
file.close()


