var Pole = function Pole(position, model, rotation, optional){
    if (position == undefined)
        return;

    this.name = "pole";
    this.position = position;

    if (model == undefined)
        model = "./Models/1.gltf";
    this.url = model;

    if (rotation == undefined)
        rotation = 0;
    var heading = rotation;//绕垂直于地心的轴旋转
    var pitch = 0;//沿纬度线旋转
    var roll = 0;//沿经度线旋转
    var hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, roll);
    this.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr);
    this.minimumPixelSize = 1;
    this.maximumScale = 1;
    this.scale = 0.001;

    if (optional != undefined)
        this.property = optional;
}