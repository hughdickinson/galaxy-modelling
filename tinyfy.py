import requests
from bs4 import BeautifulSoup
import re
import sys

def help():
    s = '\nThis script accepts a url and uses tinyurl to return a nicer '
    s += 'url than simply an ip:port combo\n'
    s += '\t python tinyfy.py [url]\n'
    s += ' [url] is the url to tinyfy, including port\n'
    print(s)
    sys.exit(0)

tiny = 'http://tinyurl.com/create.php?url={url}'
if not len(sys.argv[1:]):
    help()
else:
    url = sys.argv[1]

url = tiny.format(url=url)
t = requests.get(url).text
soup = BeautifulSoup(t, 'lxml')
contents = soup.find(id='contentcontainer')
tinyurl = re.findall(r'<b>(http://tinyurl.com/.*?)</b>', str(contents))[0]
print('\n', tinyurl, '\n')
