/*
* 全局工具对象*/
var Util = {};

    /*
    * 定位到中国区域
    * viewer：视口*/
Util.flytochina = function(viewer) {
        gotorect(viewer, 80, 22, 130, 50);
    }

    /*
    * 定位到指定区域
    * viewer：视口
    * west：西经 [-180.0, 180.0]
    * south：南纬 [-90.0, 90.0]
    * east：东经[-180.0, 180.0]
    * north：北纬[-90.0, 90.0]*/
Util.gotorect = function(viewer, west, south, east, north){
        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
            duration: 8
        })
    }

    /*
    * 定位到指定经纬度高程，高程默认值为5000
    * viewer：视口
    * long, lat, height：定位坐标*/
Util.gotopos = function (viewer, long, lat, height){
        if (!height)
            height = 5000.0;
        var scene = viewer.scene;
        scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(long, lat, height)
        });
    }

    /*
    * 局部坐标转球心笛卡尔坐标
    * p:原点在（base_lng, base_lat, base_alt）的局部坐标
    * base_:经纬度格式的局部坐标原点*/
Util.transposfromdegree = function (p, base_lng, base_lat, base_alt){
        var cart3 = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Cesium.Cartographic.fromDegrees(base_lng, base_lat, base_alt)); //经纬度到球心坐标的转换
        var m = Cesium.Transforms.eastNorthUpToFixedFrame(cart3);//cart3到球心坐标的矩阵
        var v = new Cesium.Cartesian3(p.x, p.y, p.z);//p局部坐标的矩阵
        Cesium.Matrix4.multiplyByTranslation(m, v, m);//m = m X v

        return Cesium.Matrix4.getTranslation(m, v);//根据最终变换矩阵m得到p的球心坐标
    }

    /*
    * 局部坐标转球心笛卡尔坐标
    * p:原点在（cartesian3）的局部坐标
    * cartesian3:球心坐标格式的局部坐标原点*/
Util.transposfromCartesian3 = function (p, cartesian3){
    var cart3 = cartesian3;
    var m = Cesium.Transforms.eastNorthUpToFixedFrame(cart3);//cart3到球心坐标的矩阵
    var v = new Cesium.Cartesian3(p.x, p.y, p.z);//p局部坐标的矩阵
    Cesium.Matrix4.multiplyByTranslation(m, v, m);//m = m X v

    return Cesium.Matrix4.getTranslation(m, v);//根据最终变换矩阵m得到p的球心坐标
}

/*
* 局部坐标转球心笛卡尔坐标,并旋转指定角度
* p:原点在（cartesian3）的局部坐标
* angle：绕过cartesian3，且垂直地面的轴旋转的角度
* cartesian3:球心坐标格式的局部坐标原点*/
Util.transrotationposfromCartesian3 = function (p, angle, cartesian3){
    var radians = Cesium.Math.toRadians(angle);//转成弧度
    var quat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, radians); //quat为围绕这个z轴旋转d度的四元数
    var matrix3Rotate = Cesium.Matrix3.fromQuaternion(quat);//matrix3Rotate为根据四元数求得的旋转矩阵
    var matrix4Rotate = Cesium.Matrix4.fromRotationTranslation(matrix3Rotate, Cesium.Cartesian3.ZERO);//转换为Matrix4
    var vecP = new Cesium.Cartesian3(p.x, p.y, p.z);//p局部坐标的矩阵
    var m4vecRotate = new Cesium.Matrix4;
    Cesium.Matrix4.multiplyByTranslation(matrix4Rotate, vecP, m4vecRotate);
    var transMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian3);//cartesian3到球心坐标的矩阵
    var result = new Cesium.Matrix4;
    Cesium.Matrix4.multiplyTransformation(m4vecRotate, transMatrix, result);//
    return Cesium.Matrix4.getTranslation(result, new Cesium.Cartesian3);//根据最终变换矩阵m得到球心坐标
}

var tianditu_vec=new TDTWMTSImageProvider("http://t{l}.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",!1,1,18),
   tianditu_img=new TDTWMTSImageProvider("http://t{l}.tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles",!1,1,18);

//谷歌影像服务
Util.imgprovider_google=new Cesium.ProviderViewModel({
        name:"谷歌影像",
        tooltip:"谷歌影像",
        iconUrl:"img/serverlayer.png",
        creationFunction:function(){
            return new WMTSImageryProvider("http://www.google.cn/maps/vt?lyrs=s@198&gl=en&x={x}&y={y}&z={z}",!0,{alpha:1})
        }
    });

//ArcGIS影像底图服务
Util.imgprovider_arcgis=new Cesium.ProviderViewModel({
        name:"ArcGIS影像底图",
        tooltip:"ArcGIS影像底图",
        iconUrl:"img/serverlayer.png",
        creationFunction:function(){
            var e=new Cesium.ArcGisMapServerImageryProvider({url:"http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"});
            return e
        }
    });

//ArxGIS地质底图服务
Util.imgprovider_arcgis_physical=new Cesium.ProviderViewModel({
        name:"ArcGIS地质底图",
        tooltip:"ArcGIS地质底图",
        iconUrl:"img/serverlayer.png",
        creationFunction:function(){
            var e=new Cesium.ArcGisMapServerImageryProvider({url:"http://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer"});
            return e
        }
    });

//矢量地图
Util.imgprovider_tianditu_vec=new Cesium.ProviderViewModel({
        name:"天地图矢量",
        tooltip:"天地图矢量",
        iconUrl:"img/serverlayer.png",
        creationFunction:function(){
            return tianditu_vec;
        }
    });

//天地图影像
Util.imgprovider_tianditu=new Cesium.ProviderViewModel({
        name:"天地图影像",
        tooltip:"天地图影像",
        iconUrl:"img/serverlayer.png",
        creationFunction:function(){
            return tianditu_img;
        }
    });

//cesium默认地形服务
Util.terrainprovider_default=new Cesium.ProviderViewModel({
        name:"基础地形",
        tooltip:"基础地形地形",
        iconUrl:"img/serverlayer.png",
        creationFunction:function(){
            return new Cesium.EllipsoidTerrainProvider
        }
    });

/*
* 生成guid*/
Util.genuuid = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};