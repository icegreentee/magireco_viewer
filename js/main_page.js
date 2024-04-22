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

function global_quest_page(){
    $(".main").hide()
    $("#back_main").show()
    $(".global_quest_page").show()
}

function start_story(){
    fetchLocal("image/scenario/json/adv/scenario_3/310011-1.json").then(r => r.json(), alert)
	.then(list => {
	    cc.director.popScene();
        $(".global_quest_page").hide()
        $(".story_page").show()
        $("#canvas").show()
        run_story(list["story"]["group_1"])
	});
}

function run_story(story_list){
    console.log(story_list)
    show_story_live2d(100100,200)
}

function show_story_live2d(live2d_index,live2d_x){
    let lastChild = null;
    while (lastChild = app.stage.children.shift()) {
        lastChild.destroy();
    }
    show2("./image/image_native/live2d_v4/"+live2d_index+"/", "model.model3.json", live2d_x);
}