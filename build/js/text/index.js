"use strict";define(["jquery","temp","getUrl","base64"],function(t,e,n){var c=window.localStorage,o=n("curchapter")||1*c.getItem("chapterId")||1,i=c.getItem("fontSize")||16;t(".content p").css("fontSize",1*i),u();var a=n("chaptersum");function u(){t.ajax({url:"/api/reader",data:{chapterNum:o},dataType:"json",success:function(n){t(".num").html(o),function(n,t){window.duokan_fiction_chapter=function(n){t(n),document.head.removeChild(e)};var e=document.createElement("script");e.src=n,document.head.appendChild(e)}(n.jsonp,function(n){n=JSON.parse(t.base64().decode(n));e(t(".text").html(),n,".content")})}})}t(".sum").html(a),t(".next-btn").on("click",function(){o=a<++o?a:o,u()}),t(".prev-btn").on("click",function(){o=--o<=1?1:o,u()}),t(".menu-btn").on("click",function(){window.location.href="menu.html?id="+n("id")+"&active="+o}),t(".content").on("click",function(){t(".menu").show()}),t(".menu").on("click",function(){t(this).hide()}),t(".icon-faxiandingdan").on("click",function(){return t(".config-box").toggle(),!1}),t(".config_box").on("click","button",function(){var n=parseInt(t(".content p").css("fontSize"));return"大"==t(this).html()?t(".content p").css("fontSize",++n):t(".content p").css("fontSize",--n),c.setItem("fontSize",n),!1})});