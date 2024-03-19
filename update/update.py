import re
import gzip
import requests
from clint.textui import progress
import json
import os
from urllib.request import urlopen
from bs4 import BeautifulSoup

base_path = "https://android.magi-reco.com/magica/resource/download/asset/master/"
MAIN_JSON = "asset_main.json"
MOVIE_H_JSON = "asset_movie_high.json"
MOVIE_L_JSON = "asset_movie_low.json"
VOICE_JSON = "asset_voice.json"
FULLVOICE_JSON = "asset_fullvoice.json"


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


def download_files_list(file, file_list, download_bath, save_bath):
    if len(file_list) > 1 or file_list[0]['url'] != file:
        with open(save_bath + file, 'wb') as fout:
            for part in file_list:
                download_files(download_bath + part['url'], save_bath + part['url'])
                with open(save_bath + part['url'], 'rb') as pout:
                    fout.write(pout.read(part['size']))
                os.remove(save_bath + part['url'])
    else:
        download_files(download_bath + file, save_bath + file)


# 读取JSON文件
def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        return data


download_base_dir = "../image/"
download_dir = ["/card/image/",
                "/live2d_v4/",
                "/mini/anime_v2/",
                "/bg/web/"]


# 分析出需要下载的文件
def eval_assets():
    download_files(base_path + MAIN_JSON, "./" + MAIN_JSON)
    card_data_list = []
    live2d_data_list = []
    mini_data_list = []
    bg_list = []
    data = read_json_file(MAIN_JSON)
    for i in data:
        data_path = i["path"]
        # print(data_path)
        if download_dir[0] in data_path and not os.path.isfile(download_base_dir + data_path):
            card_data_list.append([data_path, i["file_list"]])
        elif download_dir[1] in data_path and not os.path.isfile(download_base_dir + data_path) and int(
                (download_base_dir + data_path).split("/")[4]) < 600000:
            live2d_data_list.append([data_path, i["file_list"]])
        elif download_dir[2] in data_path:
            if re.match("mini_\d\d\d\d00_r0.png", data_path.split("/")[3]) or re.match("mini_\d\d\d\d00_r0.plist",
                                                                                       data_path.split("/")[
                                                                                           3]) or re.match(
                "mini_\d\d\d\d00_r.ExportJson.gz", data_path.split("/")[3]):
                if int(data_path.split("/")[3].split("_")[1]) < 600000:
                    if data_path.split(".")[-1] == "gz":
                        if not os.path.isfile(download_base_dir + data_path[:-3]):
                            mini_data_list.append([data_path, i["file_list"]])
                    else:
                        if not os.path.isfile(download_base_dir + data_path):
                            mini_data_list.append([data_path, i["file_list"]])
            elif data_path.split("/")[3] == "mini_100101_r0.png" or data_path.split("/")[
                3] == "mini_100101_r0.plist" or \
                    data_path.split("/")[3] == "mini_100101_r.ExportJson.gz":
                if data_path.split(".")[-1] == "gz":
                    if not os.path.isfile(download_base_dir + data_path[:-3]):
                        mini_data_list.append([data_path, i["file_list"]])
                else:
                    if not os.path.isfile(download_base_dir + data_path):
                        mini_data_list.append([data_path, i["file_list"]])
        elif download_dir[3] in data_path:
            if re.match("web_ev", data_path.split("/")[3]) or re.match("web_0011", data_path.split("/")[3]):
                if data_path.split(".")[-1] == "gz":
                    if not os.path.isfile(download_base_dir + data_path[:-3]):
                        bg_list.append([data_path, i["file_list"]])
                else:
                    if not os.path.isfile(download_base_dir + data_path):
                        bg_list.append([data_path, i["file_list"]])

    os.remove(MAIN_JSON)
    return card_data_list, live2d_data_list, mini_data_list, bg_list


def unzip(file):
    with gzip.open(file, 'r') as f:
        json_data = f.read()
        json_data = json_data.decode()[:-1]
    with open(file[:-3], "w", encoding="utf-8") as f:
        f.write(json_data)
    os.remove(file)
    return file[:-3]


def download_chara_file(card_data_list, live2d_data_list, mini_data_list):
    print("开始下载")
    down_num = 0
    for i in card_data_list:
        download_files_list(i[0], i[1], base_path + "resource/", "../image/")
        down_num += 1
        print("\r", end="")
        print("card下载: {} / {} ".format(down_num, len(card_data_list)), end="")
    down_num = 0
    for i in live2d_data_list:
        download_files_list(i[0], i[1], base_path + "resource/", "../image/")
        down_num += 1
        print("\r", end="")
        print("live2d下载: {} / {} ".format(down_num, len(live2d_data_list)), end="")
    down_num = 0
    for i in mini_data_list:
        download_files_list(i[0], i[1], base_path + "resource/", "../image/")
        if i.split(".")[-1] == "gz":
            unzip("../image/" + i)
        down_num += 1
        print("\r", end="")
        print("mini下载: {} / {} ".format(down_num, len(mini_data_list)), end="")
    print("\n下载完毕")


def get_all_live2d():
    Live2d_PATH = "../image/image_native/live2d_v4/"
    dl = os.listdir(Live2d_PATH)
    dl.sort()
    chars = {}
    for live2d_dir in dl:
        char_id = live2d_dir[0:-2]
        with open(Live2d_PATH + live2d_dir + "/params.json", "r", encoding="utf-8") as f:
            charaname = json.load(f)["charaName"].strip().replace('(圧縮)', '').replace('（圧縮）', '').replace('_圧縮',
                                                                                                              '').strip(
                '_圧縮').replace(' ', '')
        if char_id not in chars:
            chars[char_id] = {live2d_dir: charaname}
        else:
            chars[char_id][live2d_dir] = charaname
    return chars


def get_char_cn():
    download_files("https://magireco.moe/wiki/Template:%E8%A7%92%E8%89%B2%E6%95%B0%E6%8D%AE%E8%A1%A8/list",
                   "./char_list.html")
    print("页面下载完毕")
    with open('char_list.html', 'r', encoding="utf-8") as f:
        html_str = f.read()

    soup = BeautifulSoup(html_str, 'html.parser')
    data = soup.find_all(attrs={"class": "mw-parser-output"})[0].find_all("li")
    dic = {}
    for i in data:
        index = i.text.split(" ")[0][1:-1]
        # shu = i.img["alt"]
        chinese = i.find_all("a")[1]["title"]
        dic[index] = chinese
    os.remove('char_list.html')
    return dic


# 生产json文件
def gen_chara_json():
    print("下载角色信息")
    download_files("https://gitlab.com/EnkanRec/magireco-data-json/-/raw/master/charaCard.json", "./charaCard.json")
    print("下载完毕")
    with open("./charaCard.json", "r", encoding="utf-8") as f:
        content = json.load(f)
    dic = {}
    for i in content:
        dic[i] = {"attr": content[i]["attributeId"]}
        dic[i]["defaultCardId"] = content[i]["defaultCardId"]
        dic[i]["defaultRank"] = content[i]["defaultCardId"] % 10
        e_n = 0
        if "evolutionCard4" in content[i]:
            e_n = 4
        elif "evolutionCard3" in content[i]:
            e_n = 3
        elif "evolutionCard2" in content[i]:
            e_n = 2
        elif "evolutionCard1" in content[i]:
            e_n = 1
        dic[i]["maxRank"] = dic[i]["defaultRank"] + e_n

    live2d_data = get_all_live2d()
    cn_data = get_char_cn()
    for i in dic:
        if i in live2d_data and i in cn_data:
            dic[i]["live2d"] = live2d_data[i]
            dic[i]["cn"] = cn_data[i]
        else:
            print("更新失败，数据不一致")
            return 0
    os.remove("./charaCard.json")
    with open("./chara_data.json", "w", encoding="utf-8") as f:
        json.dump(dic, f, indent=4, ensure_ascii=False)
        print("角色配置文件生成成功")


def download_bg_file(bg_list):
    print("开始下载")
    down_num = 0
    for i in bg_list:
        download_files_list(i[0], i[1], base_path + "resource/", "../image/")
        if i[0].split(".")[-1] == "gz":
            unzip("../image/" + i[0])
        down_num += 1
        print("\r", end="")
        print("bg下载: {} / {} ".format(down_num, len(bg_list)), end="")
    print("\n下载完毕")


def get_json_data(dirpath, filepath):
    with open(dirpath + "/" + filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    animation_data = data["animation_data"]
    plist_l = data["config_file_path"]
    name = animation_data[0]["name"]
    new_data = {
        "name": name,
        "plist_l": plist_l,
    }
    return new_data


def gen_bg_json():
    new_json = {}
    for dirpath, dirnames, filenames in os.walk("../image/image_native/bg/web/"):
        for filepath in filenames:
            if filepath.split(".")[-1] == "ExportJson":
                data = get_json_data("../image/image_native/bg/web/", filepath)
                new_json[filepath] = data
    with open("./bg_data.json", "w", encoding="utf-8") as f:
        json.dump(new_json, f, indent=4, ensure_ascii=False)
        print("背景配置文件生成成功")


def main():
    card_data_list, live2d_data_list, mini_data_list, bg_list = eval_assets()
    if len(card_data_list) != 0 and len(live2d_data_list) != 0 and len(mini_data_list) != 0:
        print("card需要下载" + str(len(card_data_list)))
        print("live2d需要下载" + str(len(live2d_data_list)))
        print("mini需要下载" + str(len(mini_data_list)))
        download_chara_file(card_data_list, live2d_data_list, mini_data_list)
        gen_chara_json()
    else:
        print("角色表无新的更新")
    if len(bg_list) != 0:
        print("bg需要下载" + str(len(bg_list)))
        download_bg_file(bg_list)
        gen_bg_json()
    else:
        print("背景无需更新")


main()
