$("#back_main").on("click",function(){
	main_page()
})

$("#menu_char").on("click",function(){
	char_page()
})

$("#setting").click(function(){
    setting_page()
})


$("#chara_rank1").on("click",function(){
	if(current_chara_rank!=1){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=1
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image/image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image/image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=1
			localStorage.fav_char_rank=fav_char_rank
		}
	}
})
$("#chara_rank2").on("click",function(){
	if(current_chara_rank!=2){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=2
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image/image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image/image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=2
			localStorage.fav_char_rank=fav_char_rank
		}
	}
})
$("#chara_rank3").on("click",function(){
	if(current_chara_rank!=3){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=3
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image/image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image/image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=3
			localStorage.fav_char_rank=fav_char_rank
		}
	}
})
$("#chara_rank4").on("click",function(){
	if(current_chara_rank!=4){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=4
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image/image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image/image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=4
			localStorage.fav_char_rank=fav_char_rank
		}
	}
})
$("#chara_rank5").on("click",function(){
	if(current_chara_rank!=5){
		$("#chara_rank"+current_chara_rank+"_select").hide()
		current_chara_rank=5
		$("#chara_rank"+current_chara_rank+"_select").show()
		$("#char_card_c").attr("src","./image/image_native/card/image/card_"+current_chara+current_chara_rank+"_c.png")
		$("#char_card_f").attr("src","./image/image_native/card/frame/frame_"+chara_data[current_chara]["attr"].toLowerCase()+"_rank_"+current_chara_rank+".png")
		if(fav_char_id==current_chara){
			fav_char_rank=5
			localStorage.fav_char_rank=fav_char_rank
		}
	}
})
$("#favorite_set").on("click",function(){
	if(fav_char_id!=current_chara){
		$("#favorite_set").attr("src","./image/image_web/page/chara/conf_leader_on.png");
		fav_char_id=current_chara
		localStorage.fav_char_id = fav_char_id
		fav_char_rank=current_chara_rank
		localStorage.fav_char_rank=fav_char_rank
		localStorage.custom_index=0
		loadLive2d()
	}
})
$("#favorite2_set").on("click",function(){
	if(fav2_char_id!=current_chara){
		$("#favorite2_set").attr("src","./image/image_web/page/chara/conf_leader_on.png");
		fav2_char_id=current_chara
		localStorage.fav2_char_id = fav2_char_id
		localStorage.custom2_index=0
//		fav_char_rank=current_chara_rank
		loadLive2d()
	}
})

$("#live2d_num_check1").on("click",function(){
    console.log(is_show_fav2)
	if(is_show_fav2=="y"){
		is_show_fav2="n"
		localStorage.is_show_fav2=is_show_fav2
		$("#live2d_num_checkbox1").show()
	    $("#live2d_num_checkbox2").hide()
	}
})

$("#live2d_num_check2").on("click",function(){
    console.log(is_show_fav2)
	if(is_show_fav2=="n"){
		is_show_fav2="y"
		localStorage.is_show_fav2=is_show_fav2
		$("#live2d_num_checkbox1").hide()
	    $("#live2d_num_checkbox2").show()
	}
})



$("#change_bg").click(function(){
    bg_change_page()
})

$("#change_bg_btn").click(function(){
    current_bg_name=window.bg_name
    current_bg_res=window.bg_res
    localStorage.current_bg_name=current_bg_name
    localStorage.current_bg_res= current_bg_res
    main_page()
})
//打开筛选界面
$("#char_filter").on("click",function(){
	$(".char_filter_black").show()
})
$("#char_filter_close").on("click",function(){
	$(".char_filter_black").hide()
})
let filter_attr=[]
$("#filter_attr_all").click(function(){
    $("#filter_attr_all_checkbox").show()
    $("#filter_attr_fire_checkbox").hide()
    $("#filter_attr_water_checkbox").hide()
    $("#filter_attr_timber_checkbox").hide()
    $("#filter_attr_light_checkbox").hide()
    $("#filter_attr_dark_checkbox").hide()
    $("#filter_attr_void_checkbox").hide()
    filter_attr=[]
})
$("#filter_attr_fire").click(function(){
    $("#filter_attr_all_checkbox").hide()
    $("#filter_attr_fire_checkbox").show()
    filter_attr.push("fire")
})
$("#filter_attr_water").click(function(){
    $("#filter_attr_all_checkbox").hide()
    $("#filter_attr_water_checkbox").show()
    filter_attr.push("water")
})
$("#filter_attr_timber").click(function(){
    $("#filter_attr_all_checkbox").hide()
    $("#filter_attr_timber_checkbox").show()
    filter_attr.push("timber")
})
$("#filter_attr_light").click(function(){
    $("#filter_attr_all_checkbox").hide()
    $("#filter_attr_light_checkbox").show()
    filter_attr.push("light")
})
$("#filter_attr_dark").click(function(){
    $("#filter_attr_all_checkbox").hide()
    $("#filter_attr_dark_checkbox").show()
    filter_attr.push("dark")
})
$("#filter_attr_void").click(function(){
    $("#filter_attr_all_checkbox").hide()
    $("#filter_attr_void_checkbox").show()
    filter_attr.push("void")
})

$("#filter_btn").click(function(){
//    console.log(filter_attr)
//    console.log($("#filter_name").val())

    if(filter_attr.length==0&&$("#filter_name").val().trim().length==0){
        $("#char_filter_off").show()
        $("#char_filter_on").hide()
    }
    else{
        add_chara_list({"attr":filter_attr,"name":$("#filter_name").val().trim()})
        $("#char_filter_off").hide()
        $("#char_filter_on").show()
    }
    $(".char_filter_black").hide()
})