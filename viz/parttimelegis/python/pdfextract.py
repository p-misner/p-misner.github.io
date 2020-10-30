months = ['Alaska', 'Alabama', 'Arkansas', 'Arizona', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan', 'Minnesota', 'Missouri', 'Mississippi', 'Montana', 'North Carolina', 'North Dakota', 'Nebraska', 'New Hampshire', 'New Jersey', 'New Mexico', 'Nevada', 'New York', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Vermont', 'Washington', 'Wisconsin', 'West Virginia', 'Wyoming']

# import PyPDF2
# pdfFileObj = open('./data/sessioncalendar2014.pdf', 'rb')
# pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
# print(pdfReader.numPages)
# pageObj = pdfReader.getPage(1)
# fobj = open('./data/dates.txt','w')
# fobj.write(pageObj.extractText())
# fobj.close()
# pdfFileObj.close()
#
# with open('./data/dates.txt', 'r') as infile, open('./data/cleaned.txt','w') as outfile:
#     infile = infile.readlines()
#     for i, line in enumerate(infile):
#         if not line.strip(): continue
#         if line.strip() in months:
#             towrite = (infile[i:(i+11)])
#             for l in towrite:
#                 if not l.strip(): continue
#                 outfile.write(l.lstrip())
#     outfile.close()
# fobj = open('./data/cleaned.txt','r');
# f = fobj.readlines()
# for i, line in enumerate(f):
#     print(i)
#     if line[0].islower():
#         f[i-1] = f[i-1].strip() + f[i].strip()
#         f[i] = ''
# fobj.close()
# fobj = open('./data/cleaned.txt','w');
# for line in f:
#     fobj.write(line)
# fobj.close()
import csv
fobj = open('../data/cleaned.txt', 'r');
f = fobj.readlines()
with open('../data/2019.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',')
    for i, line in enumerate(f):
        if line.strip() in months:
            writer.writerow([f[i].strip(), f[i+1].strip()+', 2014', f[i+2].strip()+', 2014'])
