// edit the model content, re-locate relative path
function setpath(model, baseurl) {
    model.url = baseurl
    model["HitAreas"] = [
        {"Name":"Head", "Id":"HitAreaHead"},
        {"Name":"Body", "Id":"HitAreaBody"}
    ]
    return model;
}
async function check_texture(base, data) {
    data.FileReferences.Textures = (await Promise.all(
        data.FileReferences.Textures.map(
            async i => await fetchLocal(base + i)
                .then(r => r.ok ? i : undefined)
        )
    )).filter(i => i)
    return data
}
// AJAX get
function getModel(path, model,  pos_x,callback) {
    return fetchLocal(path + model)
    .then(r => r.json(), alert)
    .then(data => check_texture(path, data), alert)
    .then(data => {
        callback(setpath(data, path + model), pos_x)
    }, alert)
}
// Pixi option
var app;
function init(x, y) {
    const option = {
        width: x,
        height: y,
//    resizeTo: window,
        transparent: true,
        preserveDrawingBuffer: true,    // to capture
        view: document.getElementById("canvas"),
        autoStart: true
    }
    PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker)
    app = new PIXI.Application(option);
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var play_sound;
async function _show(model, pos_x) {
    const settings = new PIXI.live2d.Cubism4ModelSettings(model);
    const live2dSprite = await PIXI.live2d.Live2DModel.from(settings);
    app.stage.addChild(live2dSprite);
    var playing = false;
    let audioCtx = new AudioContext();
    // 新建分析仪
    let analyser = audioCtx.createAnalyser();
    // 根据 频率分辨率建立个 Uint8Array 数组备用
    let frequencyData = new Uint8Array(analyser.frequencyBinCount);
    let request = new XMLHttpRequest();
    let source = audioCtx.createBufferSource();
    live2dSprite.scale.set(0.5, 0.5);
    live2dSprite.x=pos_x
    live2dSprite._autoInteract = false
    play_sound = function(set_group){
        if(playing||delay_play){
            console.log("stop_replay")
            stop_motion()
            clearTimeout(delay_play)
            delay_play=null
            delay_play= setTimeout(function(){
                playing=true
                add_motion(set_group)
                clearTimeout(delay_play)
                delay_play=null
            },400)
        }else{
            console.log("play")
            playing=true
            add_motion(set_group)
        }
    }
//    live2dSprite.on("hit",play_sound)
    live2dSprite.on("click",()=>{play_sound()})
    live2dSprite.on("touchend",()=>{play_sound()})
    live2dSprite.internalModel.on('afterMotionUpdate', run)
    live2dSprite.motion("Motion",0)
    // live2d动作和表情映射列表
    let motions_list = {}
    let exp_list = {}
    init_motions_and_exp()
    // 当前live2d对应的所有动画组
    let groups_dic = {}
    // 要运行的动画
    var motion_list = []

    function init_motions_and_exp(){
        let motions = live2dSprite.internalModel.motionManager.definitions["Motion"]
        for(let i=0;i<motions.length;i++){
            motions_list[parseInt(motions[i]["Name"].split("_")[1])] = i
        }
        let exp = live2dSprite.internalModel.motionManager.expressionManager.definitions
        for(let i=0;i<exp.length;i++){
            exp_list[exp[i]["Name"].split(".")[0]] = i
        }
    }
    // 播放声音
    var delay_play = null

    function add_motion(set_group){
        motion_list = []
        let group=null
        if(set_group){
            group = char_group[set_group];
        }else{
            let random_group = "group_"+getRandomInt(parseInt(group_start_i),parseInt(group_start_i)+17)
            group = char_group[random_group];
        }
        for(let i=0;i<group.length;i++){
            let dic={}
            let sleep_time = group[i]["autoTurnFirst"]*1000
            dic["time"] = sleep_time
            let chara = group[i]["chara"][0]
                if("voice" in chara){
                    dic["voice"] = chara["voice"]+".mp3"
                }
                if("motion" in chara){
                    dic["motion"] = motions_list[chara["motion"]]
                }
                if("face" in chara){
                    dic["face"] = exp_list[chara["face"].split(".")[0]]
                }
                motion_list.push(dic)
            }
            console.log("add_finish")
            run_motion();
    }

    var motion_task = null
    async function run_motion(){
        if(motion_list.length==0){
            return;
        }
        let motion = motion_list.shift()
        if("voice" in motion){
            console.log(motion["voice"])
            await loadSound(motion["voice"])
        }
        if("motion" in motion){
            live2dSprite.internalModel.motionManager.stopAllMotions()
            live2dSprite.motion("Motion",motion["motion"])
        }
        if("face" in motion){
            live2dSprite.expression(motion["face"])
        }
        motion_task=setTimeout(run_motion, motion["time"])
    }
    function setMouthOpenY(v){
        v = Math.max(0,Math.min(1,v));
        live2dSprite.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',v);
    }
    const o = 100;
    const arrayAdd = a=>a.reduce((i,a)=>i+a,0);
    function run(){
            if(!playing) return;
            const arr = [];
            for (var i = 0; i < 700; i += o) {
                arr.push(getByteFrequencyData()[i]);
            }
            setMouthOpenY((arrayAdd(arr)/arr.length - 20)/60);
            setTimeout(run,1000/30);
    }
    function stop_motion(){
        console.log("stop_motion")
        playing =false
        if(source){
            source.stop()
        }
        live2dSprite.internalModel.motionManager.stopAllMotions()
        clearTimeout(motion_task)
    }

    async function loadSound(v){
        let v_name= v.split(".")[0]
        if(v_name in zimu_data){
            $(".zimu").html(zimu_data[v_name])
        }
        else{
            $(".zimu").text("")
        }
        audioCtx = new AudioContext();
        // 新建分析仪
        analyser = audioCtx.createAnalyser();
        // 根据 频率分辨率建立个 Uint8Array 数组备用
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        console.log("start_load")
        await loadAudioBuffer('image/sound_native/voice/' + v).then((buffer) => {
            // 新建 Buffer 源
            source = audioCtx.createBufferSource();
            source.buffer = buffer;
            // 连接到 audioCtx
            source.connect(audioCtx.destination);
            // 连接到 音频分析器
            source.connect(analyser);

            source.start(0);
            $(".zimu").show()
            document.addEventListener('click', stop_motion);
            console.log("loading")
            source.onended = () => {
                // 停止播放
                playing = false;
                source.disconnect();
//                console.log(source)
                source = null;
                $(".zimu").hide()
                document.removeEventListener('click', stop_motion);
            };
        })
        console.log("load_end")
    }
    function loadAudioBuffer(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            request.onload = () => {
                const audioData = request.response;
                audioCtx.decodeAudioData(audioData, (buffer) => {
                    resolve(buffer);
                }, (error) => {
                    reject(error);
                });
            };

            request.onerror = () => {
                reject(new Error('Failed to load audio file.'));
            };

            request.send();
        });
    }
    function getByteFrequencyData(){
        analyser.getByteFrequencyData(frequencyData);
        return frequencyData;
    }
}

async function _show2(model, pos_x) {
    const live2dSprite = await PIXI.live2d.Live2DModel.from(model);
    app.stage.addChild(live2dSprite);
    live2dSprite.scale.set(0.5, 0.5);
    live2dSprite.x=pos_x
    live2dSprite._autoInteract = false
//    live2dSprite.motion("Motion",0)
    // live2d动作和表情映射列表
    let motions_list = {}
    let exp_list = {}


    let motions = live2dSprite.internalModel.motionManager.definitions["Motion"]
    for(let i=0;i<motions.length;i++){
        motions_list[parseInt(motions[i]["Name"].split("_")[1])] = i
    }
    let exp = live2dSprite.internalModel.motionManager.expressionManager.definitions
    for(let i=0;i<exp.length;i++){
        exp_list[exp[i]["Name"].slice(0,14)+exp[i]["Name"].slice(15)] = i
    }
//    live2dSprite.motions_list=motions_list
//    live2dSprite.exp_list=exp_list
//    console.log(motions_list)
//    console.log(exp_list)
    live2dSprite.internalModel.on('afterMotionUpdate', run)
    live2dSprite.change_motion=function(m){
        live2dSprite.internalModel.motionManager.stopAllMotions()
        live2dSprite.motion("Motion",motions_list[m])
    }
    live2dSprite.change_exp=function(e){
        live2dSprite.expression(exp_list[e])
    }
    let playing = false;
    let v = 0.2;
    function setMouthOpenY(){
        let a = Math.random();
        if(a>0.5){
            v+=0.1
        }else{
            v-=0.1
        }
        v = Math.max(0,Math.min(1,v));
//        console.log(v)
        live2dSprite.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',v);
    }
    function run(){
        if(!playing) return;
        setMouthOpenY();
    }
    live2dSprite.start_m=function(){
         playing = true;
    }
    live2dSprite.stop_m=function(){
        playing = false;
        live2dSprite.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',0);
    }

    return live2dSprite
}


function show(path, model, pos_x) {getModel(path, model,  pos_x,_show); }
function show2(path, model, pos_x) { return _show2(path+model, pos_x); }