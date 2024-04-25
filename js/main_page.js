function main_page(){
	$("#chara_avater").attr('src', './image/image_native/card/image/card_'+fav_char_id+fav_char_rank+'_f.png');
	$(".char").hide()
	$(".setting").hide()
	$(".bg_change").hide()
	$(".global_quest_page").hide()
	$(".main").show()
	if(is_show_fav2=="y"){
	    $("#change_custom2").show()
	}
	else{
	    $("#change_custom2").hide()
	}
	show_live2d()
	window.bg_name = current_bg_name
	window.bg_res = current_bg_res
	let load_res =[window.bg_res]
    for(p in bg_data[window.bg_name+".ExportJson"]["plist_l"]){
        load_res.push("./image/image_native/bg/web/"+bg_data[window.bg_name+".ExportJson"]["plist_l"][p])
    }
	cc.loader.load(load_res, function () {
        cc.director.runScene(new bgScene());
    }, this);
}

function bg_change_page(){
	$(".char").hide()
	$(".setting").hide()
	$(".main").hide()
	$(".bg_change").show()
    $("#back_main").show()
    $("#canvas").show()
    add_bg_list()
}

function add_bg_list(){
    $(".bg_change_list").empty()
    for(let i in bg_data){
	    $(".bg_change_list").append(gen_bg_btn(bg_data[i]["name"]))
        $("#bg_change_"+bg_data[i]["name"]).on("click",function(){
            if(window.bg_name!=bg_data[i]["name"]){
                $("#bg_change_"+bg_data[i]["name"]).css({"border":"0.1rem solid #FF3B81"})
                $("#bg_change_"+window.bg_name).css({"border":"0.1rem solid #C6A882"})
                window.bg_name = bg_data[i]["name"]
                window.bg_res="./image/image_native/bg/web/"+window.bg_name+".ExportJson"
                let load_res =[window.bg_res]
                for(p in bg_data[i]["plist_l"]){
                    load_res.push("./image/image_native/bg/web/"+bg_data[i]["plist_l"][p])
                }
                console.log(load_res)
                cc.loader.load(load_res, function () {
//                    cc.director.runScene(new bgScene());
                    let nowScene = cc.director.getRunningScene()
				    nowScene.removeChildByTag(1)
				    nowScene.addChild(new bgScene(),0,1)
                }, this);
            }
        })
        if(window.bg_name!=bg_data[i]["name"]){
            $("#bg_change_"+bg_data[i]["name"]).css({"border":"0.1rem solid #C6A882"})
        }
        else{
            $("#bg_change_"+bg_data[i]["name"]).css({"border":"0.1rem solid #FF3B81"})
        }
	}
}

function gen_bg_btn(i){
    let add_div="<div class='bg_change_btn' id='bg_change_"+i+"'>"
	add_div+="<div class='bg_change_btn_2'>"
	add_div+="<img class='bg_change_btn_2_img' src='./image/image_web/page/profile/icon_home.png'>"
	add_div+="<div class='bg_change_btn_2_t'>"+i+"</div>"
	add_div+="</div>"
	add_div+="</div>"
	return add_div
}
let story_playing=false;
function global_quest_page(){
    $(".main").hide()
    $(".story_page").hide()
    $("#back_main").show()
    $(".global_quest_page").show()
    story_playing=false;
}

function start_story(){
    fetchLocal("image/scenario/json/adv/scenario_3/310011-1.json").then(r => r.json(), alert)
	.then(list => {
//	    cc.director.popScene();
        $(".global_quest_page").hide()
        $("#back_main").hide()
        $(".story_page").show()
        $("#canvas").show()
        story_playing=true;
        run_story(list["story"]["group_1"]);
	});
}

async function run_story(story_list){
    console.log(story_list)
    let lastChild = null;
    while (lastChild = app.stage.children.shift()) {
        lastChild.destroy();
    }
    let pos_chara={
    }
    let id_pos={}
//    story_list.length
    for(let i =0;i<story_list.length;i++){
        if(!story_playing){
            return;
        }
        let time = 1500;
        let story_data = story_list[i];
        if("bg" in story_data){
            if(story_data["bg"] == "black"){
                $("#story_bg").attr("src","image/package/story/adv_black.jpg");
            }
            else{
                $("#story_bg").attr("src","image/image_native/bg/story/"+story_data["bg"]);
            }
        }
        if("chara" in story_data){
            for(let chara_i = 0;chara_i<story_data["chara"].length;chara_i++){
                let chara_data = story_data["chara"][chara_i];
                if("pos" in chara_data){
                    let del_char = []
                    if(chara_data["id"] in id_pos){
//                    将已经存在的live2d删除
                        del_char.push(pos_chara[id_pos[chara_data["id"]]])
                        delete pos_chara[id_pos[chara_data["id"]]];
                        delete id_pos[chara_data["id"]];
                    }
                    if(chara_data["pos"] in pos_chara){
//                    将该位置的live2d删除
                        del_char.push(pos_chara[chara_data["pos"]]);
                        delete pos_chara[chara_data["pos"]];
                        for(let one in id_pos){
                            if(id_pos[one]==chara_data["pos"] ){
                                delete id_pos[one];
                                break;
                            }
                        }
                    }
                    for(let del_i=0;del_i<del_char.length;del_i++){
                        console.log(del_char[del_i])
                        console.log(app.stage.children.indexOf(del_char[del_i]))
                        app.stage.children.splice(app.stage.children.indexOf(del_char[del_i]),1)
                        del_char[del_i].destroy();
                        console.log(del_char[del_i])
                    }

                    await show_story_live2d(chara_data["id"],chara_data["pos"],pos_chara)
                    id_pos[chara_data["id"]]=chara_data["pos"]
                }
                if("motion" in chara_data){
                    pos_chara[id_pos[chara_data["id"]]].change_motion(chara_data["motion"])
                }
                if("face" in chara_data){
                    pos_chara[id_pos[chara_data["id"]]].change_exp(chara_data["face"])
                }
            }
        }
        if("nameRight" in story_data){
            $("#story_name_r").text(story_data["nameRight"]);
        }
        if(!("textRight" in story_data)&&!("textLeft" in story_data)){
            $("#story_context_l").hide()
            $("#story_log_ui_l").hide()
            $("#story_name_l").hide()
            $("#story_context_r").hide()
            $("#story_log_ui_r").hide()
            $("#story_name_r").hide()
        }
        if("textRight" in story_data){
            $("#story_context_l").hide()
            $("#story_log_ui_l").hide()
            $("#story_name_l").hide()
            $("#story_context_c").hide()
            $("#story_log_ui_c").hide()
            $("#story_name_c").hide()
            $("#story_name_r").show()
            let story_t = story_data["textRight"];
            let newStr = story_t.replace(/\[.*?\]/g, '').replace(/@/g, '<br>');
            $("#story_context_r").html(newStr)
            $("#story_context_r").show()
            $("#story_log_ui_r").show()
            time = story_t.length*375
            pos_chara[2].start_m()
            setTimeout(function(){
                pos_chara[2].stop_m()
            },750)
        }
        if("nameLeft" in story_data){
            $("#story_name_l").text(story_data["nameLeft"]);
        }
        if("textLeft" in story_data){
            $("#story_context_r").hide()
            $("#story_log_ui_r").hide()
            $("#story_name_r").hide()
            $("#story_context_c").hide()
            $("#story_log_ui_c").hide()
            $("#story_name_c").hide()
             $("#story_name_l").show()
            let story_t = story_data["textLeft"];
            let newStr = story_t.replace(/\[.*?\]/g, '').replace(/@/g, '<br>');
            $("#story_context_l").html(newStr)
            $("#story_context_l").show()
            $("#story_log_ui_l").show()
            time = story_t.length*375
            pos_chara[0].start_m()
            setTimeout(function(){
                pos_chara[0].stop_m()
            },750)
        }
        if("nameCenter" in story_data){
            $("#story_name_c").text(story_data["nameCenter"]);
        }
        if("textCenter" in story_data){
            $("#story_context_r").hide()
            $("#story_log_ui_r").hide()
            $("#story_name_r").hide()
             $("#story_name_l").hide()
             $("#story_context_l").hide()
            $("#story_log_ui_l").hide()
            let story_t = story_data["textCenter"];
            let newStr = story_t.replace(/\[.*?\]/g, '').replace(/@/g, '<br>');
            $("#story_context_c").html(newStr)
            $("#story_name_c").show()
            $("#story_context_c").show()
            $("#story_log_ui_c").show()
            time = story_t.length*375
            pos_chara[0].start_m()
            setTimeout(function(){
                pos_chara[0].stop_m()
            },750)
        }
        time = (time>1500)?time:1500
        if("autoTurnLast" in story_data){
//            time = story_data["autoTurnLast"]
            time = 2000
        }
        await sleep(time);
    }

}
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
async function show_story_live2d(live2d_index,pos,pos_chara){
    let pos_x = 0
    if(pos==2){
        pos_x=1500
    }
    else if(pos==1){
        pos_x = 750
    }
    let new_s = await show2("./image/image_native/live2d_v4/"+live2d_index+"/", "model.model3.json", pos_x);
    pos_chara[pos] = new_s
}