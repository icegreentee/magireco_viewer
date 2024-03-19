

var SpriteLayer = cc.Layer.extend({
    sprite:null,
    ctor:function (resource) {
        this._super();

        
        let size = cc.winSize;
     
//        var bgLayer = new cc.LayerColor(bg_color);
//        this.addChild(bgLayer, 0);
        ccs.armatureDataManager.clear()
        ccs.armatureDataManager.addArmatureFileInfo(resource);
//        ccs.armatureDataManager.clear()
        let name = $("#select_animation").val().split(".")[0]
        // console.log(name)
        let scale = 1;
//        var offset = 150;

//        if (name.slice(-4) == "_m_r" || name.slice(-4) == "_d_r"){
//            scale = 0.2;
//            offset = 0;
//        }

        let armature = new ccs.Armature(name);
        armature.getAnimation().setAnimationScale(2)
        armature.getAnimation().playWithIndex(0,-1,1);
        armature.scale = scale;
        armature.x = size.width / 2;
        armature.y = (size.height / 2) ;
        this.addChild(armature);

        $("#select_action").off("change").on("change", function(){
            armature.getAnimation().playWithIndex($("#select_action").val(),-1,1);
//            armature.getAnimation().playWithIndexes([1,3],-1,1);
        });

        return true;
    },
    onEnter: function(){
    }
});

var SpriteScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        let layer = new SpriteLayer(window.resources[0]);
        this.addChild(layer);
    }
});


var bgLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        
        let size = cc.winSize;

        ccs.armatureDataManager.clear()
        ccs.armatureDataManager.addArmatureFileInfo(window.bg_res);
        let scale = 1;

        let armature = new ccs.Armature(window.bg_name);
        armature.getAnimation().setAnimationScale(1)
        armature.getAnimation().playWithIndex(0,-1,1);
        armature.scale = scale;
        armature.x = size.width / 2;
        armature.y = (size.height / 2) ;
        this.addChild(armature);
       

        return true;
    },
    onEnter: function(){
    }
});

var bgScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        let layer = new bgLayer();
        this.addChild(layer);
    }
});

var markLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        
        ccs.armatureDataManager.addArmatureFileInfo("./image/package/web/web_ef_unit_marker/web_ef_unit_marker.ExportJson");
        let armature_mark = new ccs.Armature("web_ef_unit_marker");
        armature_mark.getAnimation().setAnimationScale(1)
        armature_mark.getAnimation().playWithIndex(0,-1,1);
        // armature_mark.width=200
        // armature_mark.height=200
        armature_mark.x = 450;
        armature_mark.y = 200 ;
        armature_mark.scaleX = 0.8;
        armature_mark.scaleY = 0.2;
		this.addChild(armature_mark);

        return true;
    },
    onEnter: function(){
    }
});

var mini_actions=[
	["wait"],["stance"],["stance_con"],
	["activate"],["app"],["reaction"],
	["attack_in","attack_out"],["attackv_in","attackv_out"],["attackh_in","attackh_out"],
	["flatline"],["damage"],["dead"]
]
var mini_actions_name=[
	"待机","战斗","连携","活动","叹气","胜利","攻击","攻击(纵)","攻击(横)","濒死","受伤","死亡"
]
var mini_actions_sp=[
	["wait","waitUnique"],["stance"],["stance_con"],
	["activate"],["app"],["reaction"],
	["attack_in","attack_out"],["attackv_in","attackv_out"],["attackh_in","attackh_out"],
	["flatline"],["damage"],["dead"]
]
var charaLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        ccs.armatureDataManager.clear()
	   ccs.armatureDataManager.addArmatureFileInfo(window.mini_res);
	   let armature_mini = new ccs.Armature(window.mini_name);
	   
	   armature_mini.scale = 0.8;
	   // armature_mini.width=200
	   // armature_mini.height=200
	   armature_mini.x = 450;
	   armature_mini.y =200 ;
	   armature_mini.getAnimation().setAnimationScale(1)
	   if(armature_mini.getAnimation().getAnimationData()["movementNames"].includes("waitUnique")){
		   armature_mini.getAnimation().playWithNames(mini_actions_sp[0],-1,1);
	   }
	   else{
		   armature_mini.getAnimation().playWithNames(mini_actions[0],-1,1);
	   }
	   // console.log(armature_mini.getAnimation().getAnimationData()["movementNames"])
	   // armature_mini.getAnimation().playWithIndex(0,-1,1);

		this.addChild(armature_mini);
		let i=1
		$("#change_pose").on("click",function(){
			if(armature_mini.getAnimation().getAnimationData()["movementNames"].includes("waitUnique")){
				armature_mini.getAnimation().playWithNames(mini_actions_sp[i],-1,1);
				$("#pose_name").html(mini_actions_name[i]);
			}
			else{
				armature_mini.getAnimation().playWithNames(mini_actions[i],-1,1);
				$("#pose_name").html(mini_actions_name[i]);
			}
			// armature_mini.getAnimation().playWithIndex(i,-1,1);
			i+=1;
			i%=12;

		})
        return true;
    },
    onEnter: function(){
    }
});

var charaScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
		let bglayer = new bgLayer();
		this.addChild(bglayer);
		let marklayer = new markLayer();
		this.addChild(marklayer);
        let charalayer = new charaLayer();
        this.addChild(charalayer,0,1);
    }
});