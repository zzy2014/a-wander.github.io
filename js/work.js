$( document ).ready(function() {

    var cons = $("div.note");// 找出所有具有 note 类的 div
    var con = $("div#con");// 找出 id 为 con 的 div 元素
    var links = $("a");// 找出页面上所有的链接元素

    cons.each( function (index){
        $(this).click( function (){
//do something with the node
        });
    });
});
