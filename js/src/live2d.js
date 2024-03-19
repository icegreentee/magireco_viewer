
// Global: if chara watch the pointer
let follow = false;

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
    // PIXI.Renderer.registerPlugin('interaction', PIXI.InteractionManager);
    app = new PIXI.Application(option);
    // const sprite = new PIXI.Sprite.fromImage("./7_room2_a.jpg");
    // stage.addChild(sprite);
}
async function _show(model, pos_x) {
    const settings = new PIXI.live2d.Cubism4ModelSettings(model);
    const live2dSprite = await PIXI.live2d.Live2DModel.from(settings, {
        eyeBlink: true,
        lipSyncWithSound: true,
        debugLog: false,
        debugMouseLog: false,
        randomMotion: false,
        defaultMotionGroup: "Motion",
        autoInteract: follow,
        expressionFadingDuration: 0,
        motionFadingDuration: 0,
        idleMotionFadingDuration: 0
    });
    app.stage.addChild(live2dSprite);
    live2dSprite.scale.set(0.5, 0.5);
    live2dSprite.x=pos_x
//    console.log(live2dSprite.internalModel.motionManager)
    live2dSprite.internalModel.motionManager.expressionManager.setRandomExpression();
    live2dSprite.internalModel.motionManager.startRandomMotion("Motion");
//    live2dSprite.internalModel.motionManager.expressionManager.resetExpression();

    live2dSprite.interactive = true;
    live2dSprite.on("touchend",(evt)=>{
        live2dSprite.internalModel.motionManager.expressionManager.setRandomExpression();
        live2dSprite.internalModel.motionManager.startRandomMotion("Motion");
    });
	live2dSprite.on("click",(evt)=>{
	    live2dSprite.internalModel.motionManager.expressionManager.setRandomExpression();
	    live2dSprite.internalModel.motionManager.startRandomMotion("Motion");
	});
}
function show(path, model, pos_x,callback) {getModel(path, model,  pos_x,_show, callback); }
