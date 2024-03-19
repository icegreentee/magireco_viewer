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