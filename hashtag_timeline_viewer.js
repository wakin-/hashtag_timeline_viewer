// ==UserScript==
// @name         Hashtag Timeline Viewer
// @namespace
// @version      0.2
// @description  Mastodonの公開側のハッシュタグタイムラインの拡張
// @match        https://theboss.tech/tags/theboss_tech
// @match        https://abyss.fun/tags/abyss_fun
// @grant        none
// ==/UserScript==

var YOUR_MASTODON_DOMAIN = "";
var ACCESS_TOKEN = "";

var HASHTAG = "";

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
        if (HASHTAG != "" && HASHTAG.length > 0) {
            window.open('https://'+YOUR_MASTODON_DOMAIN+'/share?text='+encodeURIComponent("\n#"+HASHTAG),'hashtag_timeline_viewer_share_window','width=400,height=400');
        } else {
            alert("ハッシュタグが空です")
        }
    }

    document.querySelector(".item-list").onmouseover = function(e) {
        let target = e.target
        if (target.classList.contains("status__action-bar-button") && target.classList.contains("icon-button") && target.classList.contains("disabled")) {
            target.classList.remove("disabled")
        }
    }
    document.querySelector(".item-list").onclick = function(e) {
        let target = e.target

        if (target.classList.contains('status__action-bar-button') && target.classList.contains('icon-button')) {
            let status = target.closest(".status.status-public")
            let toot_url = status.querySelector(".status__relative-time").href

            let method = null
            let callback = null
            if (target.firstChild.classList.contains('fa-retweet')) {
                if (target.classList.contains('active')) {
                    method = "unreblog"
                    callback = function() {
                        this.classList.remove("active")
                    }.bind(target)
                } else {
                    method = "reblog"
                    callback = function() {
                        this.classList.add("active")
                    }.bind(target)
                }
            } else if (target.firstChild.classList.contains('fa-star')) {
                if (target.classList.contains('active')) {
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
            } else if (target.firstChild.classList.contains('fa-reply') || target.firstChild.classList.contains('fa-reply-all')) {
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

        if (method != null && callback != null) {
            statuses_post(toot_id, method, callback)
        } else {
            alert(YOUR_MASTODON_DOMAIN+"を開きます。\n引き続き操作を行ってください。")
            window.open("https://"+YOUR_MASTODON_DOMAIN+"/web/statuses/"+toot_id)
        }
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