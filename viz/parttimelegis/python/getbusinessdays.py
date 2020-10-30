import json
import csv
# with open("../data/legislativesessions.json") as f:
#     states = json.load(f)
#     for s in states:
#         print(s,": ",states[s]["2019"]["businessdays"])
#     f.close()

legses = ['State', "Year", "Month", "Value"]
add = []
with open("./data/legislativesessions.json") as f, open('./data/legislativesessions.csv','w') as outfile:
    writer = csv.writer(outfile)
    states = json.load(f)
    for s in states:
        for yr in states[s]:
            for month in states[s][yr]:
                if month != "businessdays":
                    add = [s, yr, month, states[s][yr][month]]
                print(add)
                writer.writerow(add)
    f.close()
    outfile.close()