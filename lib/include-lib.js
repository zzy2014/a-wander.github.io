!function () {
    function s(s) {
        var t = '<script type="text/javascript" src="' + s + "?v=" + m + '"></script>';
        document.writeln(t)
    }

    function t(s) {
        var t = '<link rel="stylesheet" href="' + s + "?v=" + m + '">';
        document.writeln(t)
    }

    function e(s, t) {
        for (i in s) if (s[i] == t) return !0;
        return !1
    }

    function o() {
        var o = (a.getAttribute("include") || "").split(","), c = a.getAttribute("libpath") || "", n = false;//window.location.hostname.indexOf("localhost") == -1;
        n && s(c + "/hao/noCopy.js"), t("./css/toolBar.css"),
        e(o, "jquery") && s(n ? "https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js" : c + "/jquery-3.2.1.min.js"),
        e(o, "font-awesome") && t(n ? "http://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" : c + "/font-awesome/css/font-awesome.min.css"),
        e(o, "bootstrap") && (t(c + "/bootstrap/css/bootstrap.css"), n ? (e(o, "jquery") || s("https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"), s("http://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js")) : (e(o, "jquery") || s(c + "/jquery-2.1.4.min.js"), s(c + "/bootstrap/js/bootstrap.min.js"))),
        e(o, "bootstrap-table") && (n ? (t("https://cdn.bootcss.com/bootstrap-table/1.11.1/bootstrap-table.min.css"), s("https://cdn.bootcss.com/bootstrap-table/1.11.1/bootstrap-table.min.js"), s("https://cdn.bootcss.com/bootstrap-table/1.11.1/locale/bootstrap-table-zh-CN.min.js")) : (t(c + "/bootstrap/plugins/table/bootstrap-table.min.css"), s(c + "/bootstrap/plugins/table/bootstrap-table.min.js"), s(c + "/bootstrap/plugins/table/locale/bootstrap-table-zh-CN.js"))),
        e(o, "admin-lte") && (n ? (e(o, "font-awesome") || t("http://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css"), t("http://cdn.bootcss.com/admin-lte/2.4.2/css/AdminLTE.min.css"), t("http://cdn.bootcss.com/admin-lte/2.4.2/css/skins/skin-blue.min.css"), s("https://cdn.bootcss.com/admin-lte/2.4.2/js/adminlte.min.js")) : (e(o, "font-awesome") || t(c + "/font-awesome/css/font-awesome.min.css"), t(c + "/admin-lte/css/AdminLTE.min.css"), t(c + "/admin-lte/css/skins/skin-blue.min.css"), s(c + "/admin-lte/js/adminlte.min.js"))),
        e(o, "jquery.scrollTo") && s(n ? "http://cdn.jsdelivr.net/jquery.scrollto/2.1.2/jquery.scrollTo.min.js" : c + "/jqueryPlugins/jquery.scrollTo.min.js"),
        e(o, "ace") && s(n ? "http://cdn.bootcss.com/ace/1.2.6/ace.js" : c + "/ace/ace.js"),
        e(o, "layer") && (t(c + "/layer/theme/default/layer.css"), s(c + "/layer/layer.js")),
        e(o, "haoutil") && s(c + "/hao/haoutil.min.js"),
        e(o, "echarts") && s(n ? "https://cdn.bootcss.com/echarts/3.7.2/echarts.min.js" : c + "/echarts/echarts.min.js"),
        e(o, "echarts-gl") && s(c + "/echarts/echarts-gl.min.js"),
        //e(o, "highlight") && (n ? (t("https://cdn.bootcss.com/highlight.js/9.12.0/styles/foundation.min.css"), s("https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js")) : (t(c + "/highlight/styles/foundation.css"), s(c + "/highlight/highlight.pack.js"))),
        //e(o, "turf") && s(n ? "https://cdn.bootcss.com/Turf.js/5.0.4/turf.min.js" : c + "/turf.min.js"),
        //e(o, "leaflet-mars") && (t(c + "/leaflet-mars/leaflet.css"), s(c + "/leaflet-mars/leaflet.js")),
        //e(o, "esri-leaflet") && s(n ? "https://cdn.bootcss.com/esri-leaflet/2.1.1/esri-leaflet.js" : c + "/leafletPlugins/esri/esri-leaflet-debug.js"),
        //e(o, "leaflet-echarts") && (s(c + "/leafletPlugins/echarts/echarts-3.4.js"), s(c + "/leafletPlugins/echarts/L.flowEcharts.js")),
        //e(o, "leaflet-echarts") && (s(c + "/leafletPlugins/mapV/mapv.min.js"), s(c + "/leafletPlugins/mapV/leaflet.mapv.js")),
        t(c + "/Cesium/Widgets/widgets.css"), s(c + "/Cesium/Cesium.js"),
        s("./Utils/ImageProvider.js"), s("./Utils/tdtwmtsimageprovider.js"),s("./Utils/Utils.js"),
        s("./Devs/pole.js"), s("./Devs/lead.js"),
        s("./js/work.js");
    }

    for (var a, c = new RegExp("(^|(.*?\\/))(include-lib.js)(\\?|$)"), n = document.getElementsByTagName("script"), i = 0; i < n.length; i++) {
        var l = n[i].getAttribute("src");
        if (l) {
            var r = l.match(c);
            if (r) {
                a = n[i];
                break
            }
        }
    }

    var m = "2017121511";
    o()
}();