import pandas as pd
import json

df = pd.read_csv("./data/sessiondates.csv", header=0)
month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
states = ['Alaska', 'Alabama', 'Arkansas', 'Arizona', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan', 'Minnesota', 'Missouri', 'Mississippi', 'Montana', 'North Carolina', 'North Dakota', 'Nebraska', 'New Hampshire', 'New Jersey', 'New Mexico', 'Nevada', 'New York', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Vermont', 'Washington', 'Wisconsin', 'West Virginia', 'Wyoming']
year = {}
fullmonths = {}
statename = {}
prevstate = 'Alabama'
for i, line in enumerate(df['State']):
    if line != prevstate:
        statename[prevstate] = year
        year = {}
    begin = pd.to_datetime(df["Convene"][i])
    end = pd.to_datetime(df["Adjourn"][i])
    array = pd.date_range(begin, end, freq='M')
    fullmonths = {}
    for date in array:
        if begin.month == date.month:
            fullmonths[date.month_name()] = date.day - begin.day
        elif end.month == date.month:
            fullmonths[date.month_name()] = end.day
        else:
            fullmonths[date.month_name()] = date.day
        # print(date.month_name()," ", date.day)
            fullmonths[end.month_name()] = end.day
    for m in month:
        if m not in fullmonths.keys():
            fullmonths[m] = 0
    fullmonths['businessdays'] =len(pd.bdate_range(begin,end, freq='B'))

    year[str(df['Year'][i])] = fullmonths
    prevstate = line;

# print(statename)
print(json.dumps(statename, sort_keys=True, indent=4, separators=(',', ': ')))

fobj = open('./data/legislativesessions.json', 'w')
fobj.write(json.dumps(statename, sort_keys=True, indent=4, separators=(',', ': ')))
fobj.close()
