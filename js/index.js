var viewer;
var scene;

//绘制状态
var DrawState = {
    mousestate : 0,//0:空闲；1:绘制；
    prepole : null,
    preprepole : null,
    no : 1,
};

//杆塔数据
var type2model = {
    "S1-D1-终端杆": {
        url: "./Models/S1-Z1.gltf",
        pos: [new Cesium.Cartesian3(0.15276, 0.5, 9.283), new Cesium.Cartesian3(0.15276, -0.5, 9.283), new Cesium.Cartesian3(0.141, -0.006, 10.333)],
    },
    "S1-J3-转角杆":{
        url: "'./Models/2.gltf'",
        pos: [new Cesium.Cartesian3(0, 0.32, 3.66), new Cesium.Cartesian3(0, -0.32, 3.66), new Cesium.Cartesian3(0, 0, 4)],
    },
    "S1-Z1-直线杆":{
        url: "'./Models/3.gltf'",
        pos: [new Cesium.Cartesian3(0, 0.32, 3.66), new Cesium.Cartesian3(0, -0.32, 3.66), new Cesium.Cartesian3(0, 0, 4)],
    }
};

function initMap(){
    viewer = new Cesium.Viewer('cesiumContainer', {
        timeline: !1,//是否显示时间轴
        sceneModePicker: !0,//是否显示3D/2D选择器
        baseLayerPicker: !0,//是否显示图层选择器
        geocoder: !0,// 搜索
        scene3DOnly: !0,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        animation: !1,//左下角仪表盘
        navigationHelpButton: !0,//右上角的帮助按钮
        homeButton: !1,//是否显示Home按钮
        infoBox: !0,
        fullscreenButton: !0,
        showRenderLoopErrors: !0,
        fullscreenElement: document.documentElement,
        imageryProviderViewModels:[Util.imgprovider_google,Util.imgprovider_arcgis,Util.imgprovider_arcgis_physical,Util.imgprovider_tianditu_vec,Util.imgprovider_tianditu],
        terrainProviderViewModels:[Util.terrainprovider_default],
        selectedImageryProviderViewModel: Util.imgprovider_google
    });
    scene = viewer.scene;

    Util.gotopos(viewer, 116.391264010231, 39.906417447953, 1000);

    var positions = [];
    for (var i = 0; i < 10; ++i) {
        var cartesian = Cesium.Cartesian3.fromDegrees(116.391264010231 + i * 0.0005, 39.906417447953);
        positions.push(cartesian);
        var newpole = new Pole(cartesian, type2model["S1-D1-终端杆"].url, -90);
        scene.primitives.add(Cesium.Model.fromGltf(newpole));
    }

    for (var i = 1; i < positions.length; ++i) {
        var lead = new Lead;
        lead.setRelativeLeadPos(positions[i - 1], positions[i], type2model["S1-D1-终端杆"].pos[0]);
        viewer.entities.add(lead);
        lead = new Lead;
        lead.setRelativeLeadPos(positions[i - 1], positions[i], type2model["S1-D1-终端杆"].pos[1]);
        viewer.entities.add(lead);
        lead = new Lead;
        lead.setRelativeLeadPos(positions[i - 1], positions[i], type2model["S1-D1-终端杆"].pos[2]);
        viewer.entities.add(lead);
    }

    var mouseHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    mouseHandler.setInputAction(function (movement) {
        if (DrawState.mousestate != 1)
            return;

        if (movement.position != null) {
            var cartesian = viewer.scene.camera.pickEllipsoid(movement.position, Cesium.Ellipsoid.WGS84);
            if (cartesian) {
                var newpole = new Pole(cartesian, type2model["S1-D1-终端杆"].url, -90);
                newpole = scene.primitives.add(Cesium.Model.fromGltf(newpole));
                newpole.position = cartesian;
                if (DrawState.prepole != null){
                    // 旋转连线
                    var prepos = DrawState.prepole.position;
                    var veclead = Cesium.Cartesian3.fromElements(cartesian.x - prepos.x, cartesian.y - prepos.y, cartesian.z - prepos.z);
                    if (DrawState.preprepole != null){
                        var preprepos = DrawState.preprepole.position;
                        var vecprelead = Cesium.Cartesian3.fromElements(preprepos.x - prepos.x, preprepos.y - prepos.y, preprepos.z - prepos.z);

                        // 计算三个杆塔间的夹角
                        var normvecprelead = new Cesium.Cartesian3;
                        Cesium.Cartesian3.normalize(vecprelead, normvecprelead);
                        var normveclead = new Cesium.Cartesian3;
                        Cesium.Cartesian3.normalize(veclead, normveclead);
                        var added = Cesium.Cartesian3.add(normvecprelead, normveclead, new Cesium.Cartesian3);
                        var normadded = new Cesium.Cartesian3;
                        Cesium.Cartesian3.normalize(added, normadded);

                        var p1 = new Cesium.Cartesian3(1, 0, 0);
                        var pp1 = Util.transposfromCartesian3(p1, prepos);
                        var p2 = new Cesium.Cartesian3(0, 0.0, 0);
                        var pp2 = Util.transposfromCartesian3(p2, prepos);
                        var veccross = Cesium.Cartesian3.fromElements(pp1.x - pp2.x, pp1.y - pp2.y, pp1.z - pp2.z);

                        var cosine = Cesium.Cartesian3.dot(veccross, normadded);
                        var angle = Math.acos(cosine / (Cesium.Cartesian3.magnitude(veccross)*Cesium.Cartesian3.magnitude(normadded)));

                        var norm = new Cesium.Cartesian3;
                        Cesium.Cartesian3.normalize(prepos, norm);
                        var fangxiang = Cesium.Cartesian3.dot(Cesium.Cartesian3.cross(veccross, normadded, new Cesium.Cartesian3), norm);

                        angle = Cesium.Math.toDegrees(angle);

                        var heading = 360-angle;
                        if (fangxiang < 0)
                            heading = angle;
                        var pitch = 0;
                        var roll = 0;//沿经度线旋转
                        var hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, roll);//顺时针旋转
                        DrawState.prepole.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(prepos, hpr);

                        var pos1 = Util.transposfromCartesian3(type2model["S1-D1-终端杆"].pos[0], prepos);
                        var pos2 = Util.transposfromCartesian3(type2model["S1-D1-终端杆"].pos[0], cartesian);
                        var radians = Cesium.Math.toRadians(heading);//转成弧度
                        var quat = Cesium.Quaternion.fromAxisAngle(prepos, radians); //quat为围绕这个z轴旋转d度的四元数
                        var matrix3Rotate = Cesium.Matrix3.fromQuaternion(quat);//matrix3Rotate为根据四元数求得的旋转矩阵
                        var matrix4Rotate = Cesium.Matrix4.fromRotationTranslation(matrix3Rotate, Cesium.Cartesian3.ZERO);
                        var m4vecRotate = new Cesium.Matrix4;
                        Cesium.Matrix4.multiplyByTranslation(matrix4Rotate, pos1, m4vecRotate);
                        pos1 = Cesium.Matrix4.getTranslation(m4vecRotate, new Cesium.Cartesian3);
                        var lead = new Lead;
                        lead.setRelativePos(pos1, pos2);
                        viewer.entities.add(lead);
                        lead = new Lead;
                        pos1 = Util.transposfromCartesian3(type2model["S1-D1-终端杆"].pos[1], prepos);
                        pos2 = Util.transposfromCartesian3(type2model["S1-D1-终端杆"].pos[1], cartesian);
                        Cesium.Matrix4.multiplyByTranslation(matrix4Rotate, pos1, m4vecRotate);
                        pos1 = Cesium.Matrix4.getTranslation(m4vecRotate, new Cesium.Cartesian3);
                        lead.setRelativePos(pos1, pos2);
                        viewer.entities.add(lead);
                        lead = new Lead;
                        pos1 = Util.transposfromCartesian3(type2model["S1-D1-终端杆"].pos[2], prepos);
                        pos2 = Util.transposfromCartesian3(type2model["S1-D1-终端杆"].pos[2], cartesian);
                        Cesium.Matrix4.multiplyByTranslation(matrix4Rotate, pos1, m4vecRotate);
                        pos1 = Cesium.Matrix4.getTranslation(m4vecRotate, new Cesium.Cartesian3);
                        lead.setRelativePos(pos1, pos2);
                        viewer.entities.add(lead);
                    }
                    else{
                        var p1 = new Cesium.Cartesian3(0.15276, 0.5, 9.283);
                        var pp1 = Util.transposfromCartesian3(p1, prepos);
                        var p2 = new Cesium.Cartesian3(0.15276, 0.0, 9.283);
                        var pp2 = Util.transposfromCartesian3(p2, prepos);
                        var veccross = Cesium.Cartesian3.fromElements(pp1.x - pp2.x, pp1.y - pp2.y, pp1.z - pp2.z);

                        var heading = -Cesium.Math.toDegrees(Cesium.Cartesian3.angleBetween(veccross, veclead));
                        var pitch = 0;//沿纬度线旋转
                        var roll = 0;//沿经度线旋转
                        var hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, roll);
                        DrawState.prepole.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(prepos, hpr);

                        var lead = new Lead;
                        lead.setRelativeLeadPos(DrawState.prepole.position, cartesian, type2model["S1-D1-终端杆"].pos[0]);
                        viewer.entities.add(lead);
                        lead = new Lead;
                        lead.setRelativeLeadPos(DrawState.prepole.position, cartesian, type2model["S1-D1-终端杆"].pos[1]);
                        viewer.entities.add(lead);
                        lead = new Lead;
                        lead.setRelativeLeadPos(DrawState.prepole.position, cartesian, type2model["S1-D1-终端杆"].pos[2]);
                        viewer.entities.add(lead);
                    }
                }
                if (DrawState.prepole != null){
                    DrawState.preprepole = DrawState.prepole;
                }
                DrawState.prepole = newpole;
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    mouseHandler.setInputAction(function (movement) {
            DrawState.mousestate = 1;
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    mouseHandler.setInputAction(function (movement) {
        DrawState.mousestate = 0;
        DrawState.prepole = null;
        DrawState.preprepole = null;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

//    var mouseHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//    mouseHandler.setInputAction(function (movement) {
//        if (movement.position != null) {
//            var cartesian = viewer.scene.camera.pickEllipsoid(movement.position, Cesium.Ellipsoid.WGS84);
//            if (cartesian) {
//            }
//        }
//    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

//var loadingBar = document.getElementById("loadbar"), oldTime = (new Date).getTime(), loadIdx = setInterval(run, 100);
$(document).ready(function () {
    // mars3d.map.webglreport() || (alert("绯荤粺妫€娴嬪埌鎮ㄤ娇鐢ㄧ殑娴忚鍣ㄤ笉鏀寔WebGL鍔熻兘"), layer.open({
    //     type: 1,
    //     title: "褰撳墠娴忚鍣ㄤ笉鏀寔WebGL鍔熻兘",
    //     closeBtn: 0,
    //     shadeClose: !1,
    //     resize: !1,
    //     area: ["600px", "200px"],
    //     content: '<div style="margin: 20px;"><h3>绯荤粺妫€娴嬪埌鎮ㄤ娇鐢ㄧ殑娴忚鍣ㄤ笉鏀寔WebGL鍔熻兘锛�</h3>  <p>1銆佽鎮ㄦ鏌ユ祻瑙堝櫒鐗堟湰锛屽畨瑁呬娇鐢ㄦ渶鏂扮増chrome銆佺伀鐙愭垨IE11浠ヤ笂娴忚鍣紒</p> <p>2銆乄ebGL鏀寔鍙栧喅浜嶨PU鏀寔锛岃淇濊瘉瀹㈡埛绔數鑴戝凡瀹夎鏄惧崱椹卞姩绋嬪簭锛�</p></div>'
    // })),
    initMap();
});