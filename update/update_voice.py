import base64
import re
from urllib.request import urlopen
import os
from bs4 import BeautifulSoup
import json

import urllib.parse

def download_files(download_path, save_path):
    retry = 3  # 重试次数
    while retry:
        s = urlopen(download_path)
        if s.getcode() != 200:
            retry -= 1
            continue
        directory, _ = os.path.split(save_path)
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(save_path, "wb") as f:
            f.write(s.read())
            return 0


def download_all(voice_list):
    for i in voice_list:
        if not os.path.isfile("../image/sound_native/voice/" + i.split("/")[-1].lower()):
            download_files(i, "../image/sound_native/voice/" + i.split("/")[-1].lower())


def get_char_cn(dp):
    download_files(dp,"./1.html")
    print("页面下载完毕")
    with open('1.html', 'r', encoding="utf-8") as f:
        html_str = f.read()

    soup = BeautifulSoup(html_str, 'html.parser')
    data = soup.find_all(attrs={"data-bind": re.compile(("."))})
    dic = []
    for i in data:
        text = json.loads(i.get("data-bind"))
        url = text["component"]["params"]["playlist"][0]["audioFileUrl"]
        if "Vo_char" in url:
            dic.append(url)
    # os.remove('1.html')
    print(dic)
    return dic


def get_all_char_list():
    with open("chara_data.json", 'r', encoding="utf-8") as file:
        data = json.load(file)
    char_list = []
    for i in data:
        if int(i)>=4004:
            txt= urllib.parse.quote(data[i]["cn"], safe='/:?&=')
            char_list.append("https://magireco.moe/wiki/"+txt)
    # print(char_list)
    for i in char_list:
        voice_list = get_char_cn(i)
        download_all(voice_list)
        # print(voice_list)


get_all_char_list()
# voice_list=get_char_cn()
# download_all(voice_list)
