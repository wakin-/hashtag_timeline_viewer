// ==UserScript==
// @name         Hashtag Timeline Viewer
// @namespace
// @version      0.2
// @description  Mastodonの公開側のハッシュタグタイムラインの拡張
// @match        https://theboss.tech/tags/*
// @grant        none
// ==/UserScript==

var YOUR_MASTODON_DOMAIN = ""
var ACCESS_TOKEN = "";
var HASHTAG = "theboss_tech";

(function() {
    'use strict'

    document.querySelector(".column-header").innerHTML +=
        '<div class="compose-form__publish">\
            <div class="compose-form__publish-button-wrapper" style="padding: 5px 10px">\
            <button id="open_share_window" class="button button--block" style="padding: 0px 16px; height: 36px; line-height: 36px;">トゥート</button>\
            </div>\
        </div>'

    if (location.pathname.split("/").length == 3) {
        HASHTAG = location.pathname.split("/")[2]
    }

    document.querySelector("#open_share_window").onclick = function() {
        window.open('web+mastodon://share?text='+encodeURIComponent("\n#"+HASHTAG),'hashtag_timeline_viewer_share_window','width=400,height=400');
    }

    document.querySelector(".item-list").onmouseover = function(e) {
        if (e.target.className === "status__action-bar-button star-icon icon-button disabled") {
            e.target.classList.remove("disabled")
        }
    }
    document.querySelector(".item-list").onclick = function(e) {
        let target = e.target

        if (target.className.match('^status__action-bar-button star-icon icon-button')) {
            let status = target.closest(".status.status-public")
            let toot_url = status.querySelector(".status__relative-time").href

            let method = null
            let callback = null
            if (target.className.match('active$')) {
                method = "unfavourite"
                callback = function() {
                    this.classList.remove("active")
                }.bind(target)
            } else {
                method = "favourite"
                callback = function() {
                    this.classList.add("active")
                }.bind(target)
            }

            search(toot_url, method, callback)
        }
    }

})()

function search(toot_url, method, callback) {
    asyncRequest("https://"+YOUR_MASTODON_DOMAIN+"/api/v1/search?q="+encodeURIComponent(toot_url),
    "GET",
    {Authorization: "Bearer "+ACCESS_TOKEN},
    {},
    function(responseText) {
        let json_arr = JSON.parse(responseText)
        if (!Array.isArray(json_arr['statuses']) || !json_arr['statuses'][0]['id']) {
            alert("レスポンスがおかしいです")
            return
        }
        let toot_id = json_arr['statuses'][0]['id']

        statuses_post(toot_id, method, callback)
    },
    function(status) { alert("失敗しました。YOUR_MASTODON_DOMAINやACCESS_TOKENは正しいですか？") })
}

function statuses_post(toot_id, method, callback) {
    asyncRequest("https://"+YOUR_MASTODON_DOMAIN+"/api/v1/statuses/"+toot_id+"/"+method,
        "POST",
        {Authorization: "Bearer "+ACCESS_TOKEN},
        {},
        callback,
        function(status) { alert("失敗しました。YOUR_MASTODON_DOMAINやACCESS_TOKENは正しいですか？") })    
}

// 非同期リクエスト
function asyncRequest(url, method, header, data, callback, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                callback(this.responseText);
            } else {
                error(this.responseText);
            }
        }
    }
    xhr.open(method, url, true);
    for (key in header) {
        xhr.setRequestHeader(key, header[key]);
    }
    xhr.send(JSON.stringify(data));
}