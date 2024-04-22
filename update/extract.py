"""
    功能: 将plist的图集拆分成单独的一个一个图片的脚本
    使用方法: 将脚本放置于含有plist和png图集的目录中, 用python3运行该脚本，则会在当前目录创建一个output目录，将图集拆分到output目录内
    使用前提下， 需要安装pip install PIL
"""

import plistlib
from PIL import Image
import os

def extract_images_from_plist(plist_path):
    output_dir="./"
    # 读取plist文件
    with open(plist_path, 'rb') as plist_file:
        plist_data = plistlib.load(plist_file)

    # 获取图集信息
    frames = plist_data['frames']

    # 读取原始图集图片
    atlas_image_path = plist_data['metadata']['textureFileName']
    atlas_image = Image.open(atlas_image_path)

    # 创建输出目录
    # os.makedirs(output_dir, exist_ok=True)

    # 拆解图集并保存图片
    for frame_name, frame_info in frames.items():
        # 获取每个图块的位置和大小
        x = frame_info["x"]
        y = frame_info["y"]
        width = frame_info["width"]
        height = frame_info["height"]
        # 获取旋转信息
        # rotated = frame_info.get('rotated', False)

        # 裁剪图块
        image = atlas_image.crop((x, y, x + width, y + height))

        # 如果需要旋转，则逆时针旋转90度


        # 保存图块到输出目录
        # output_path = os.path.join(output_dir, frame_name)
        if frame_name[-3:]=="jpg":
            image = image.convert('RGB')
            image.save("./" + frame_name, 'JPEG')
        else:
            image.save("./"+frame_name)

if __name__ == "__main__":

    plist_dir = "./"
    output_dir = "./"

    if not os.path.exists(output_dir):
        os.mkdir(output_dir)

    for filename in os.listdir(plist_dir):
        if filename.endswith('.plist'):
            basename = os.path.basename(filename)
            basename = basename.split('.')[0]
            print(filename,basename)
            plist_path = os.path.join(plist_dir, filename)
            # plist_output_path =os.path.join(output_dir, basename)
            # if not os.path.exists(plist_output_path):
            #     os.mkdir(plist_output_path)
            # print('extract image:', plist_path, plist_output_path)
            extract_images_from_plist(plist_path)


