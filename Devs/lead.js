var Lead = function Lead(optional) {
    this.name = 'lead';
    this.polyline = {
        positions: [],
        width: 2,
        material: new Cesium.PolylineMaterialAppearance({
            color: Cesium.Color.BLACK
        })
    };

    if (optional != undefined)
        this.property = optional;
}

/*
* 设置导线的起始终止坐标
* prePolePos: 球心笛卡尔坐标系的起始杆塔坐标
* aftPolePos: 球心笛卡尔坐标系的终止杆塔坐标
* hangPos: 以对应杆塔位置为原点的导线挂点坐标*/
Lead.prototype.setRelativeLeadPos = function(prePolePos, aftPolePos, hangPos){
    if (prePolePos == undefined || aftPolePos == undefined || hangPos == undefined)
        return;

    var ptpre = Util.transposfromCartesian3(hangPos, prePolePos);
    var ptaft = Util.transposfromCartesian3(hangPos, aftPolePos);
    this.polyline.positions = Lead.prototype.getCurve(ptpre, ptaft);
}

/*
* 设置导线的起始终止坐标
* prePos: 球心笛卡尔坐标系的起始坐标
* aftPos: 球心笛卡尔坐标系的终止坐标*/
Lead.prototype.setRelativePos = function(prePos, aftPos){
    if (prePos == undefined || aftPos == undefined)
        return;

    this.polyline.positions = Lead.prototype.getCurve(prePos, aftPos);
}

/*
* 根据导线的起始终止点（球心笛卡尔坐标）计算弧垂点*/
Lead.prototype.getCurve = function (ptpre, ptaft) {
    var length = Cesium.Cartesian3.distance(ptpre, ptaft);
    if (length < 5)
        return [ptpre, ptaft];

    var vector = Cesium.Cartesian3.fromElements(ptaft.x-ptpre.x, ptaft.y-ptpre.y, ptaft.z-ptpre.z);
    var normvector = new Cesium.Cartesian3;
    Cesium.Cartesian3.normalize(vector, normvector);

    var pts = [];
    var count = parseInt(length/0.5);
    if (count % 2 == 1)
        count += 1;
    var step = length/count;
    count = parseInt(count/2);
    var len = 0;
    var c=0;
    for (var i=-1*count; i<count+1; ++i){
        var transvector = new  Cesium.Cartesian3;
        Cesium.Cartesian3.multiplyByScalar(normvector, len, transvector);
        var matrix = new Cesium.Matrix4;
        Cesium.Matrix4.fromTranslation(transvector, matrix);
        var newpt = new Cesium.Cartesian3;
        Cesium.Matrix4.multiplyByPoint(matrix, ptpre, newpt);
        len += step;

        var ellipsoid=viewer.scene.globe.ellipsoid;
        var cartographic=ellipsoid.cartesianToCartographic(newpt);
        var lat=Cesium.Math.toDegrees(cartographic.latitude);
        var lng=Cesium.Math.toDegrees(cartographic.longitude);
        var alt=cartographic.height;
        if (i == -1*count)
            c = alt - (i*i)*0.001;
        alt = (i*i)*0.001 + c;
        pts.push(Cesium.Cartesian3.fromDegrees(lng, lat, alt));
    }

    return pts;
}