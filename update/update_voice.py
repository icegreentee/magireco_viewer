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


def get_char_cn(download_path, save_path):
    if not os.path.isfile("../download/" + save_path + ".html"):
        download_files(download_path, "../download/" + save_path + ".html")
        print("页面下载完毕")
    with open("../download/" + save_path + ".html", 'r', encoding="utf-8") as f:
        html_str = f.read()

    soup = BeautifulSoup(html_str, 'html.parser')
    data = soup.find_all(attrs={"data-bind": re.compile(("."))})
    dic = []
    for i in data:
        text = json.loads(i.get("data-bind"))
        url = text["component"]["params"]["playlist"][0]["audioFileUrl"]
        if "Vo_char" in url:
            dic.append(url)

    data = soup.find_all(attrs={"style": "padding:5px 10px;"})
    dic2 = []
    for i in data:
        dic2.append(i.getText().strip())
    return dic, dic2


def gen_zimu_dic(voice_list, zi_mu, zimu_dic):
    # dic={}
    for i in range(len(voice_list)):
        voice_info = voice_list[i].split("/")[-1].split(".")[0].lower()
        if len(zi_mu[i]) != 0 and zi_mu[i]!="译文暂缺":
            zimu_dic[voice_info] = zi_mu[i]
            # print(voice_info,zi_mu[i])
    # return dic


def get_all_char_list():
    with open("chara_data.json", 'r', encoding="utf-8") as file:
        data = json.load(file)
    char_list = []
    char_list2 = []
    for i in data:
        if int(i) >= 1001:
            txt = urllib.parse.quote(data[i]["cn"], safe='/:?&=')
            char_list.append("https://magireco.moe/wiki/" + txt)
            char_list2.append(data[i]["cn"])
    # print(char_list)
    # print(char_list2)
    zimu_dic = {}
    for i in range(len(char_list)):
        voice_list, zi_mu = get_char_cn(char_list[i], char_list2[i])
        gen_zimu_dic(voice_list, zi_mu, zimu_dic)
        download_all(voice_list)
    with open("./zimu_data.json", "w", encoding="utf-8") as f:
        json.dump(zimu_dic, f, indent=4, ensure_ascii=False)
        # print(len(zimu_dic.keys()))
        # download_all(voice_list)


get_all_char_list()
