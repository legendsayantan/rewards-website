const params = getURLParameters();
var mainpage = window.document.getElementsByClassName("page")[0]
const onloadCallback = function () {
    var homeButton = document.getElementById("home")
    var onlineButton = document.getElementById("online")
    var downloadButton = document.getElementById("download")
    var mobileOnlineButton = document.getElementById("mobile-online")
    var mobileDownloadButton = document.getElementById("mobile-download")
    homeButton.addEventListener("click", function () {
        load("/index.html", onloadCallback)
    })
    onlineButton.addEventListener("click", function () {
        load("/online.html", initialiseOnline)
        updateURLParameter('action', 'online')
    })

    downloadButton.addEventListener("click", function () {
        window.open("https://github.com/legendsayantan/msrewards/releases/latest")
    })
    mobileOnlineButton.addEventListener("click", function () {
        load("/online.html", initialiseOnline)
        updateURLParameter('action', 'online')
    })
    mobileDownloadButton.addEventListener("click", function () {
        window.open("https://github.com/legendsayantan/msrewards/releases/latest")
    })
    initialiseOnline()
}
load((params.action==null)?window.location.pathname:params.action, onloadCallback)
function load(path, callback = function () {
}) {
    var htmlFile = (path.includes('/index.html') || path === '/') ? '/home.html' : path
    if(!htmlFile.includes('.html'))htmlFile+='.html'
    fetch(htmlFile).then(function (response) {
        return response.text();
    }).then(function (html) {
        mainpage.innerHTML = html;
        callback()
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}
function initialiseOnline() {
    const onlineCount = window.localStorage.getItem('online-count')
    const onlineDelay = window.localStorage.getItem('online-delay')
    const desktopBrowser = !(navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i));
    const edgeBrowser = navigator.userAgent.match(/edg/i) != null;
    const htmlData = "You are using <b>" + (edgeBrowser ? "Edge " : "Non-Edge browser ") + "</b>on <b/>" + (desktopBrowser ? "Desktop" : "Mobile") + '</b>.';
    const infoText = document.getElementById('browserinfo');
    infoText.innerHTML = htmlData
    const mobilesearch = document.getElementById("mobilesearch")
    mobilesearch.style.setProperty("display", desktopBrowser ? "none" : "block")
    const pcsearch = document.getElementById("pcsearch")
    pcsearch.style.setProperty("display", desktopBrowser ? "block" : "none")
    const edgepoint = document.getElementById("edgepoint")
    edgepoint.style.setProperty("display", edgeBrowser ? "block" : "none")
    const count = document.getElementById("count");
    const delay = document.getElementById("delay");
    delay.value = onlineDelay == null ? '5' : onlineDelay
    count.value = onlineCount == null ? (desktopBrowser ? '30' : '20') : onlineCount;
    const configView = document.getElementById("online-configuration")
    const runView = document.getElementById("online-run")
    const iframe = document.getElementById("frame")
    const progress = document.getElementById("online-progress")
    const dashboard = document.getElementById("dashboard")
    var search = function () {
        configView.style.setProperty("display", "none")
        runView.style.setProperty("display", "flex")
        searchOn(iframe, count.value, delay.value, function (remaining) {
            progress.innerHTML = 'Completed <b>' + (count.value - remaining) + ' / ' + count.value + '</b> searches.'
            dashboard.style.setProperty("display", remaining === 0 ? "block" : "none")
            document.getElementById("promotion").style.setProperty("display", remaining === 0 ? "block" : "none")
        })
    }
    mobilesearch.addEventListener('click', search)
    pcsearch.addEventListener('click', search)
    edgepoint.addEventListener('click', search)
    dashboard.addEventListener('click', function () {
        window.open("https://rewards.bing.com/?signIn=1")
    })
    if (window.location.hostname === 'localhost') {
        iframe.style.setProperty("width", "300px")
        iframe.style.setProperty("height", "300px")
        iframe.style.setProperty("opacity", "1")
    }
}

function searchOn(iframe, count, delay, callback) {
    var needToInitiate = count;
    var needToLoad = count;
    window.localStorage.setItem('online-count', count)
    window.localStorage.setItem('online-delay', delay)
    iframe.addEventListener('load', function () {
        if (needToInitiate < needToLoad) {
            needToLoad--;
            console.log("remaining loads " + needToLoad)
            if (needToLoad > 0) {
                setTimeout(function () {
                    iframe.src = "https://www.bing.com/search?q=" + generateRandomString(Math.random() * 9 + 1)
                    needToInitiate--;
                    console.log("remaining initiations " + needToInitiate)
                }, delay * 1000)
            } else {
                console.log(count + " " + needToLoad + " " + needToInitiate)
            }
            callback(needToLoad)
        }
    })
    iframe.src = "https://www.bing.com/search?q=" + generateRandomString(Math.random() * 9 + 1)
    needToInitiate--
    console.log("remaining initiations " + needToInitiate)
}

function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getURLParameters() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (let [key, value] of searchParams.entries()) {params[key] = value;}
    return params;
}
function updateURLParameter(parameterName, newValue) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(parameterName, newValue);

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.replaceState(null, '', newUrl);
}