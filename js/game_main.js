let last_canvas_data=null
if(window.localStorage){
    console.log("support localstorage")
}
else{
    console.log("not support localstorage")
}
//当前背景
let current_bg_name= "web_ev_1199_23054"
let current_bg_res= "./image/image_native/bg/web/web_ev_1199_23054.ExportJson"
if(localStorage.current_bg_name){
    current_bg_name = localStorage.current_bg_name
}
if(localStorage.current_bg_res){
    current_bg_res = localStorage.current_bg_res
}

//主角色
let fav_char_id="1001"
let fav_char_rank=5
if(localStorage.fav_char_id){
    fav_char_id = localStorage.fav_char_id
}
if(localStorage.fav_char_rank){
    fav_char_rank = localStorage.fav_char_rank
}
let customs=[]
let custom_index =0
let char_group = null
//副角色
let customs2=[]
let custom2_index =0
let fav2_char_id="1002"
let is_show_fav2="n"
if(localStorage.fav2_char_id){
    fav2_char_id = localStorage.fav2_char_id
}
if(localStorage.is_show_fav2){
    is_show_fav2 = localStorage.is_show_fav2
}
var chara_data={}
var bg_data={}
$(document).ready(function(){
    adjust_page();
	initLive2d();
});

$(window).resize( function  () {
	adjust_page();
})

function fetchLocal(url, data) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest
    xhr.onload = function() {
      resolve(new Response(xhr.responseText, {status: xhr.status}))
    }
    xhr.onerror = function() {
      reject(new TypeError('Local request failed'))
    }
    xhr.open('GET', url)
    xhr.send(data)
  })
}


function adjust_page(){
    let current_w = window.innerWidth;
    let current_h = window.innerHeight;
	console.log(current_w,current_h)
    if(parseInt(1920/1080*current_h)==parseInt(current_w)){
//    console.log("标准屏")
    $("#bg").width(current_w)
    $("#bg").height(current_h)
    }
    else if(parseInt(1920/1080*current_h)<parseInt(current_w)){
//    console.log("长屏")
    $("#bg").width(1920/1080*current_h)
    $("#bg").height(current_h)
    }
    else{
//    console.log("宽屏")
    $("#bg").width(current_w)
    $("#bg").height(1080/1920*current_w)
    }
    $("html").css("font-size",$("#bg").height()/10.8+"px")


	if(last_canvas_data){
		if(last_canvas_data["w"]!=current_w || last_canvas_data["h"]!=current_h){
			startScene()
		}
	}else{
		startScene()
	}
	last_canvas_data={"w":current_w,"h":current_h}
}
function initLive2d(){
    init(2280,1520);
    //获取服装目录
	fetchLocal("./update/chara_data.json").then(r => r.json(), alert)
	.then(list => {
	    chara_data=list
	    loadLive2d()
	});
}

function loadLive2d(){
	//获取服装目录
	    customs = Object.keys(chara_data[fav_char_id]["live2d"])
	    customs2 = Object.keys(chara_data[fav2_char_id]["live2d"])
//	    let lastChild = null;
        custom_index =0
		custom2_index =0
        if(localStorage.custom_index){
            custom_index= parseInt(localStorage.custom_index)
        }
        if(localStorage.custom2_index){
            custom2_index=parseInt(localStorage.custom2_index)
        }
//	    show_live2d()
        $("#change_custom").unbind("click")
        $("#change_custom").click(function(){
            custom_index+=1
            custom_index=custom_index%customs.length
            localStorage.custom_index = custom_index
            show_live2d()
        })
        $("#change_custom2").unbind("click")
        $("#change_custom2").click(function(){
            custom2_index+=1
            custom2_index=custom2_index%customs2.length
            localStorage.custom2_index = custom2_index
            show_live2d()
        })
}
function show_live2d(){
    let lastChild = null;
    while (lastChild = app.stage.children.shift()) {
        lastChild.destroy();
    }
    if(is_show_fav2=="y"){
        show("./image/image_native/live2d_v4/"+customs[custom_index]+"/", "model.model3.json", -100);
        show("./image/image_native/live2d_v4/"+customs2[custom2_index]+"/", "model.model3.json", 700);
    }
    else{
        let cus_id = customs[custom_index]
        let jsonfile ="image/scenario/json/general/"
//        let group_start_i = 16
        if("motion" in chara_data[fav_char_id]["live2d"][cus_id]){
            jsonfile += cus_id+".json"
//            group_start_i =  chara_data[fav_char_id]["live2d"][cus_id]["motion"]
        }
        else{
            jsonfile += cus_id.slice(0,4)+"00.json"
//            group_start_i = chara_data[fav_char_id]["live2d"][cus_id.slice(0,4)+"00"]["motion"]
        }
//        let random_group = "group_"+getRandomInt(parseInt(group_start_i),parseInt(group_start_i)+17)
        fetchLocal(jsonfile).then(r => r.json(), alert).then(list => {
            char_group = list["story"];
            show("./image/image_native/live2d_v4/"+customs[custom_index]+"/", "model.model3.json", 200);
        })
    }

}


function startScene(){
    cc.game.onStart = function(){
        // Pass true to enable retina display, disabled by default to improve performance
        cc.view.enableRetina(false);
        // Adjust viewport meta
        cc.view.adjustViewPort(true);
        // Setup the resolution policy and design resolution size
        cc.view.setDesignResolutionSize(1024, 768,4);
        // The game will be resized when browser size change
        // cc.view.resizeWithBrowserSize(true);

        fetchLocal("./update/bg_data.json").then(r => r.json(), alert)
        .then(list => {
            bg_data = list
            main_page()
        });
    };
    cc.game.run();
}






