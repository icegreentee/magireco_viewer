var current_chara= fav_char_id
var current_chara_rank= fav_char_rank
function char_page(){
	add_chara_list()
	char_left_load()
	if(is_show_fav2=="y"){
	    $("#favorite2_set").show()
	}
	else{
	    $("#favorite2_set").hide()
	}
	$("#char_head_"+current_chara+"_select").css("display","block")
	$("#char_card_c").attr("src","./image/image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
	$("#char_card_f").attr("src","./image/image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
	$(".main").hide()
	$(".char").show()
	window.mini_res="./image/image_native/mini/anime_v2/mini_"+current_chara+"00_r.ExportJson"
	window.mini_name="mini_"+current_chara+"00_r"
	window.bg_res="./image/package/bg/web_common.ExportJson"
	window.bg_name="web_common"
	cc.loader.load([
	                //chara_bg
                    "./image/package/bg/web_common.ExportJson",
                    "./image/package/bg/web_common_petal_00.plist",
                    "./image/package/bg/web_common_petal_01.plist",
                    "./image/package/bg/web_common_petal_02.plist",
                    "./image/package/bg/web_common0.plist",
                     //mini down
                     "./image/package/web/web_ef_unit_marker/web_ef_unit_marker.ExportJson",
                     "./image/package/web/web_ef_unit_marker/web_ef_unit_marker0.plist",
				    "./image/image_native/mini/anime_v2/mini_"+current_chara+"00_r.ExportJson",
				    "./image/image_native/mini/anime_v2/mini_"+current_chara+"00_r0.plist",
				], function () {
                    cc.director.runScene(new charaScene());
                }, this);
}

function gen_chara(i,attr,rank){
	let add_div="<div class='chara_head' id='char_head_"+i+"'>"
	add_div+="<img src='./image/image_native/card/frame/bg_"+attr+".png' class='chara_head_1'/>"
	add_div+="<img src='./image/image_native/card/image/card_"+i+rank+"_f.png' class='chara_head_2'/>"
	add_div+="<img src='./image/image_native/card/frame/frame_rank_"+rank+".png' class='chara_head_3'/>"
	add_div+="<img src='./image/image_native/card/frame/att_"+attr+".png' class='chara_head_4'/>"
	add_div+="<img src='./image/image_web/common/chara/icon_select.png' id='char_head_"+i+"_select' class='chara_head_5'/>"
	add_div+="</div>"
	return add_div
}

function add_chara_list(par=null){
	$("#chara_head_list").empty();
	current_chara= fav_char_id
	current_chara_rank= fav_char_rank
	for(let i in chara_data){
	    if(i=="updateTime"){
	        continue;
	    }
	    if(par!=null){
            if(par["attr"].length>0&& !par["attr"].includes(chara_data[i]["attr"].toLowerCase())) {
                continue
            }
            if(par["name"].length>0&&!chara_data[i]["cn"].includes(par["name"])){
                continue
            }
	    }
		$("#chara_head_list").append(gen_chara(i,chara_data[i]["attr"].toLowerCase(),chara_data[i]["defaultRank"]))
		$("#char_head_"+i).on("click",function(){
			if(i!=current_chara){
				$("#char_head_"+current_chara+"_select").css("display","none");
				$("#char_head_"+i+"_select").css("display","block");
				current_chara=i;
				window.mini_res="./image/image_native/mini/anime_v2/mini_"+current_chara+"00_r.ExportJson"
				window.mini_name="mini_"+current_chara+"00_r"
				cc.loader.load([
				    "./image/image_native/mini/anime_v2/mini_"+current_chara+"00_r.ExportJson",
				    "./image/image_native/mini/anime_v2/mini_"+current_chara+"00_r0.plist"
				], function () {
                    let nowScene = cc.director.getRunningScene()
				    nowScene.removeChildByTag(1)
				    nowScene.addChild(new charaLayer(),0,1)
                }, this);
				char_left_load()
				$("#char_card_c").attr("src","./image/image_native/card/image/card_"+current_chara+chara_data[current_chara]["defaultRank"]+"_c.png")
				$("#char_card_f").attr("src","./image/image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+chara_data[current_chara]["defaultRank"]+".png")
				if(fav_char_id==current_chara){
					$("#favorite_set").attr("src","./image/image_web/page/chara/conf_leader_on.png");
				}else{
					$("#favorite_set").attr("src","./image/image_web/page/chara/conf_leader_off.png");
				}
				if(fav2_char_id==current_chara){
					$("#favorite2_set").attr("src","./image/image_web/page/chara/conf_leader_on.png");
				}else{
					$("#favorite2_set").attr("src","./image/image_web/page/chara/conf_leader_off.png");
				}
				$("#char_card_c").attr("src","./image/image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
				$("#char_card_f").attr("src","./image/image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
			}
		})
	}
	$(".chara_head").width(document.documentElement.clientHeight*0.2*0.75)
	$(".chara_head").height(document.documentElement.clientHeight*0.2*0.75)
}
function char_left_load(){
	$("#chara_name").text(chara_data[current_chara]["cn"])
	$("#chara_attr").attr("src","./image/image_web/common/chara/att_"+chara_data[current_chara]["attr"].toLowerCase()+"_f.png")
	let d_rank=chara_data[current_chara]["defaultRank"]
	let m_rank=chara_data[current_chara]["maxRank"]
	for(let i=1;i<=5;i++){
		if(i>=d_rank&&i<=m_rank){
			$("#chara_rank"+i).show()
		}else{
			$("#chara_rank"+i).hide()
		}
	}

	$("#chara_rank1_attr_bg").attr("src","./image/image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank2_attr_bg").attr("src","./image/image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank3_attr_bg").attr("src","./image/image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank4_attr_bg").attr("src","./image/image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank5_attr_bg").attr("src","./image/image_native/card/frame/bg_"+chara_data[current_chara]["attr"].toLowerCase()+".png")

	$("#chara_rank1_attr").attr("src","./image/image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank2_attr").attr("src","./image/image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank3_attr").attr("src","./image/image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank4_attr").attr("src","./image/image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")
	$("#chara_rank5_attr").attr("src","./image/image_native/card/frame/att_"+chara_data[current_chara]["attr"].toLowerCase()+".png")

	$("#chara_rank1_head").attr("src","./image/image_native/card/image/card_"+current_chara+"1_f.png")
	$("#chara_rank2_head").attr("src","./image/image_native/card/image/card_"+current_chara+"2_f.png")
	$("#chara_rank3_head").attr("src","./image/image_native/card/image/card_"+current_chara+"3_f.png")
	$("#chara_rank4_head").attr("src","./image/image_native/card/image/card_"+current_chara+"4_f.png")
	$("#chara_rank5_head").attr("src","./image/image_native/card/image/card_"+current_chara+"5_f.png")
	$("#chara_rank1_select").hide()
	$("#chara_rank2_select").hide()
	$("#chara_rank3_select").hide()
	$("#chara_rank4_select").hide()
	$("#chara_rank5_select").hide()
	if(fav_char_id==current_chara){
		$("#favorite_set").attr("src","./image/image_web/page/chara/conf_leader_on.png");
		current_chara_rank=fav_char_rank
	}else{
		$("#favorite_set").attr("src","./image/image_web/page/chara/conf_leader_off.png");
		current_chara_rank=chara_data[current_chara]["defaultRank"]
	}
	$("#chara_rank"+current_chara_rank+"_select").show()
}

function chara_live2d_page(){
    $(".char").hide()
    $(".main").hide()
    $(".char_live2d").show()
    $("#back_char").hide()
    $("#back_main").show()
    // bg change
    window.bg_res="image/image_native/bg/web/web_0015.ExportJson"
	window.bg_name="web_0015"
	cc.loader.load([
	                //chara_bg
                    "image/image_native/bg/web/web_0015.ExportJson",
                    "image/image_native/bg/web/web_0015_ef_dust.plist",
                    "image/image_native/bg/web/web_00150.plist",
                    "image/image_native/bg/web/web_00150.png",
				], function () {
                    cc.director.runScene(new bgScene());
                }, this);
    //live2d
    $("#canvas").show()
    var char_custom_index = 0
    var char_customs = []
    load_char_live2d()
}

function add_voice_list(dic,dic2){
    let voice_dic = {1:"自我介绍1",2:"自我介绍2",3:"剧情1",4:"剧情2",5:"剧情3",6:"剧情4",7:"剧情5",
    8:"剧情6",9:"剧情7",10:"剧情8",11:"剧情9",12:"剧情10",
    13:"强化完成",14:"强化（Lv最大时）",15:"短篇Lv UP",
    16:"魔力解放1",17:"魔力解放2",18:"魔力解放3",19:"Magia Lv UP",
    20:"魔法少女觉醒1",21:"魔法少女觉醒2",22:"魔法少女觉醒3",23:"魔法少女觉醒4",
    24:"登录1",25:"登录2（早）",26:"登录3（昼）",27:"登录4（夜）",28:"登录5（深夜）",29:"登录6（其他）",
    30:"登录7（AP满）",31:"登录8（BP满）",32:"登录9",33:"点击1",34:"点击2",35:"点击3",36:"点击4",
    37:"点击5",38:"点击6",39:"点击7",40:"点击8",41:"点击9",
    42:"Quest开始",43:"Quest胜利1",44:"Quest胜利2",45:"Quest胜利3",46:"Quest胜利4"}
    $(".voice_list").empty()
    for(let i in dic){
        let t;
        if(i in voice_dic){
            t = voice_dic[i];
        }
        else{
            t = "其他"+i;
        }
        $(".voice_list").append(gen_voice_btn(i,t,dic2[i]))
        $("#voice_btn_"+i).on("click",function(){
            console.log(dic[i])
            play_sound(dic[i])
        })
    }
}
function gen_voice_btn(i,t,is_new){
    let add_div="<div class='voice_btn' id='voice_btn_"+i+"'>"
	add_div+="<div class='voice_btn_2'>"
	add_div+="<img class='voice_btn_2_img' src='./image/image_web/page/profile/icon_sound_data_on.png'>"
	add_div+="<div class='voice_btn_2_t'>"+t+"</div>"
	if(is_new){
	    add_div+="<img class='voice_btn_2_img2' src='image/image_web/page/gacha/gacha_new.png'>"
	}
	add_div+="</div>"
	add_div+="</div>"
	return add_div
}

function load_char_live2d(){
	//获取服装目录
	    char_customs = Object.keys(chara_data[current_chara]["live2d"])
//	    let lastChild = null;
        char_custom_index =0
//	    show_live2d()
        $("#change_char_custom").unbind("click")
        $("#change_char_custom").click(function(){
            char_custom_index+=1
            char_custom_index=char_custom_index%char_customs.length
            show_char_live2d()
        })
        show_char_live2d()
}

function show_char_live2d(){
    let lastChild = null;
    while (lastChild = app.stage.children.shift()) {
        lastChild.destroy();
    }
    let cus_id = char_customs[char_custom_index]
        let jsonfile ="image/scenario/json/general/"
        if("motion" in chara_data[current_chara]["live2d"][cus_id]){
            jsonfile += cus_id+".json"
            group_start_i =  chara_data[current_chara]["live2d"][cus_id]["motion"]
        }
        else{
            jsonfile += cus_id.slice(0,4)+"00.json"
            group_start_i = chara_data[current_chara]["live2d"][cus_id.slice(0,4)+"00"]["motion"]
        }
        fetchLocal(jsonfile).then(r => r.json(), alert).then(list => {
            char_group = list["story"];
            eval_page_group()
            show("./image/image_native/live2d_v4/"+char_customs[char_custom_index]+"/", "model.model3.json", 200);
        })

}

function eval_page_group(){
    console.log("eval_page_group")
    let dic = {}
    let dic2={}
    for(let group_i in char_group){
        let group_ctx = char_group[group_i]
        for(let i =0;i<group_ctx.length;i++){
            if("voice" in group_ctx[i]["chara"][0]){
                dic[parseInt(group_ctx[i]["chara"][0]["voice"].split("_")[4])]=group_i
                dic2[parseInt(group_ctx[i]["chara"][0]["voice"].split("_")[4])]=group_ctx[i]["chara"][0]["voice"].split("_")[3]!="00"
                break
            }
        }
    }
    add_voice_list(dic,dic2)
}