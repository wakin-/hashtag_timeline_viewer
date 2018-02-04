// ==UserScript==
// @name         Hashtag Timeline Viewer
// @namespace
// @version      0.1
// @description  Mastodonの公開側のハッシュタグタイムラインの拡張
// @match        https://theboss.tech/tags/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict'

    document.querySelector(".column-header").innerHTML +=
        '<div class="compose-form__publish">\
            <div class="compose-form__publish-button-wrapper" style="padding: 5px 10px">\
            <button id="open_share_window" class="button button--block" style="padding: 0px 16px; height: 36px; line-height: 36px;">トゥート</button>\
            </div>\
        </div>'
    
    var hashtag = location.pathname.split("/")[2]

    document.querySelector("#open_share_window").onclick = function() {
        window.open('web+mastodon://share?text='+encodeURIComponent("\n#"+hashtag),'hashtag_timeline_viewer_share_window','width=400,height=400');
    }

})()