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
function getModel(path, model,  pos_x,callback, callback2) {
    return fetchLocal(path + model)
    .then(r => r.json(), alert)
    .then(data => check_texture(path, data), alert)
    .then(data => {
        callback(setpath(data, path + model), pos_x)
        callback2(data.FileReferences)
    }, alert)
}
// Pixi option
let app;
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

var group_25= [
        {
          "autoTurnFirst": 1.0,
          "chara": [
            {
              "cheek": 0,
              "eyeClose": 0,
              "face": "mtn_ex_050.exp.json",
              "id": 100100,
              "motion": 0,
              "pos": 1,
              "voice": "vo_char_1001_00_33"
            }
          ]
        },
        {
          "autoTurnFirst": 2.5,
          "chara": [
            {
              "id": 100100,
              "motion": 100
            }
          ]
        },
        {
          "autoTurnFirst": 1.0,
          "chara": [
            {
              "cheek": 1,
              "id": 100100
            }
          ]
        },
        {
          "autoTurnFirst": 2.8,
          "chara": [
            {
              "id": 100100,
              "motion": 1
            }
          ]
        },
        {
          "autoTurnFirst": 1.7,
          "chara": [
            {
              "cheek": 1,
              "face": "mtn_ex_030.exp.json",
              "id": 100100,
              "motion": 200
            }
          ]
        }
      ]
async function _show(model, pos_x) {
    const settings = new PIXI.live2d.Cubism4ModelSettings(model);
    const live2dSprite = await PIXI.live2d.Live2DModel.from(settings);
    app.stage.addChild(live2dSprite);
    live2dSprite.scale.set(0.5, 0.5);
    live2dSprite.x=pos_x
    live2dSprite._autoInteract = false
    live2dSprite.motion("Motion",0)
    let motions = live2dSprite.internalModel.motionManager.definitions["Motion"]
    let motions_list = {}
    for(let i=0;i<motions.length;i++){
        motions_list[parseInt(motions[i]["Name"].split("_")[1])] = i
    }
    let exp = live2dSprite.internalModel.motionManager.expressionManager.definitions
    let exp_list = {}
    for(let i=0;i<exp.length;i++){
        exp_list[exp[i]["Name"].slice(0,14)+exp[i]["Name"].slice(15)] = i
    }
    var delay_play = null
    live2dSprite.on("hit",function(){
        if(playing){
            playing =false
            source.stop()
            clearTimeout(motion_task)
            live2dSprite.internalModel.motionManager.stopAllMotions()
            clearTimeout(delay_play)
            delay_play= setTimeout(function(){
                playing=true
                get_motion_list();
                run_motion();
            },400)
        }else{
            playing=true
            get_motion_list();
            run_motion();
        }
    })
    let motion_list = []
    function get_motion_list(){
        motion_list = []
        let group = group_25
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
                dic["face"] = exp_list[chara["face"]]
            }
            motion_list.push(dic)
        }
    }
    var motion_task = null
    function run_motion(){
        if(motion_list.length==0){
            return;
        }
        let motion = motion_list.shift()
        if("motion" in motion){
            live2dSprite.internalModel.motionManager.stopAllMotions()
            live2dSprite.motion("Motion",motion["motion"])
        }
        if("voice" in motion){
            loadSound(motion["voice"])
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
    live2dSprite.internalModel.on('afterMotionUpdate', function() {
        run()
    })
    var playing = false;
    let audioCtx = new AudioContext();
    // 新建分析仪
    let analyser = audioCtx.createAnalyser();
    // 根据 频率分辨率建立个 Uint8Array 数组备用
    let frequencyData = new Uint8Array(analyser.frequencyBinCount);
    let request = new XMLHttpRequest();
    let source = audioCtx.createBufferSource();
    function loadSound(){
        audioCtx = new AudioContext();
        // 新建分析仪
        analyser = audioCtx.createAnalyser();
        // 根据 频率分辨率建立个 Uint8Array 数组备用
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        request = new XMLHttpRequest();
        source = audioCtx.createBufferSource();
        request.open('GET', 'image/sound_native/voice/vo_char_1001_00_33.mp3', true);
        request.responseType = 'arraybuffer';
        request.onload = ()=>{
            const audioData = request.response;
            audioCtx.decodeAudioData(audioData, function(buffer) {
                // 新建 Buffer 源
                source.buffer = buffer;
                // 连接到 audioCtx
                source.connect(audioCtx.destination);
                // 连接到 音频分析器
                source.connect(analyser);
                // 开始播放
                source.start(0);
                source.onended = ()=>{
                    // 停止播放
                    playing = false;
                    source.disconnect();
                    source=null;
                }
            });
        };
        request.send();
    }
    function getByteFrequencyData(){
        analyser.getByteFrequencyData(frequencyData);
        return frequencyData;
    }
}




function show(path, model, pos_x,callback) {getModel(path, model,  pos_x,_show, callback); }
