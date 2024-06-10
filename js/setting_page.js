function setting_page(){
	$(".main").hide()
	$(".setting").show()
	if(is_show_fav2=="y"){
	    $("#live2d_num_checkbox1").hide()
	    $("#live2d_num_checkbox2").show()
	}
	else{
	    $("#live2d_num_checkbox1").show()
	    $("#live2d_num_checkbox2").hide()
	}
}
