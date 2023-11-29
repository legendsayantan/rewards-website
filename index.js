const params = getURLParameters();
const mainpage = window.document.getElementsByClassName("page")[0];
const onloadCallback = function () {
    if (params.action === "verify") initialiaseVerification()
    const homeButton = document.getElementById("home");
    const onlineButton = document.getElementById("online");
    const downloadButton = document.getElementById("download");
    const mobileOnlineButton = document.getElementById("mobile-online");
    const mobileDownloadButton = document.getElementById("mobile-download");
    homeButton.addEventListener("click", function () {
        loadPageContent("/index.html")
    })
    onlineButton.addEventListener("click", function () {
        loadPageContent("/online.html")
        updateURLParameter('action', 'online')
    })
    downloadButton.addEventListener("click", function () {
        window.open("https://github.com/legendsayantan/msrewards/releases/latest")
    })
    mobileOnlineButton.addEventListener("click", function () {
        loadPageContent("/online.html")
        updateURLParameter('action', 'online')
    })
    mobileDownloadButton.addEventListener("click", function () {
        window.open("https://github.com/legendsayantan/msrewards/releases/latest")
    })

}
loadPageContent((params.action == null) ? window.location.pathname : params.action)

function loadPageContent(path) {
    let htmlFile = (path.includes('/index.html') || path === '/') ? '/home.html' : path;
    if (!htmlFile.includes('.html')) htmlFile += '.html'
    console.log("loading " + htmlFile)
    fetch(htmlFile).then(function (response) {
        return response.text();
    }).then(function (html) {
        mainpage.innerHTML = html;
        if (htmlFile.includes("online")) initialiseOnline()
        else if (htmlFile.includes("redeem")) initialiseRedeem()
        onloadCallback()
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
    const htmlData = "You are using <b>" + (edgeBrowser ? "Edge" : "Non-Edge browser") + "</b> on <b/>" + (desktopBrowser ? "Desktop" : "Mobile") + '</b>.';
    const infoText = document.getElementById('browserinfo');
    infoText.innerHTML = htmlData
    const searchBtn = document.getElementById("search")
    const count = document.getElementById("count");
    const delay = document.getElementById("delay");
    delay.value = onlineDelay == null ? '5' : onlineDelay
    count.value = onlineCount == null ? (desktopBrowser ? '30' : '20') : onlineCount;
    const configView = document.getElementById("online-configuration")
    const runView = document.getElementById("online-run")
    const iframe = document.getElementById("frame")
    const progress = document.getElementById("online-progress")
    const dashboard = document.getElementById("dashboard")
    searchBtn.addEventListener('click',  function () {
        configView.style.setProperty("display", "none")
        runView.style.setProperty("display", "flex")
        searchOn(iframe, count.value, delay.value, function (remaining) {
            progress.innerHTML = 'Completed <b>' + (count.value - remaining) + ' / ' + count.value + '</b> searches.'
            dashboard.style.setProperty("display", remaining === 0 ? "block" : "none")
            document.getElementById("promotion").style.setProperty("display", remaining === 0 ? "block" : "none")
        })
    })
    dashboard.addEventListener('click', function () {
        window.open("https://rewards.bing.com/?signIn=1")
    })
    if (window.location.hostname === 'localhost') {
        iframe.style.setProperty("width", "300px")
        iframe.style.setProperty("height", "300px")
        iframe.style.setProperty("opacity", "1")
    }
}

function initialiseRedeem() {
    console.log("initialising redeem")
    const redeemCode = document.getElementById("redeem-code");
    redeemCode.innerText = params.code
    redeemCode.addEventListener('click', function () {
        navigator.clipboard.writeText(params.code).then(() => document.getElementById("redeem-copy-state").innerText = "Copied!")
    })
    if (params.amount != null) {
        const redeemAmount = document.getElementById("redeem-amount");
        redeemAmount.innerText = "You can collect " + params.amount + " credits from this code."
    }
}

function initialiaseVerification() {
    if (window.localStorage.getItem('shadow') == null) {
        window.localStorage.setItem('shadow', 'true')
        window.location.href = "intent://rewards.is-an.app/verify#Intent;scheme=https;end"
        document.getElementById("welcomeText").innerText = "You should be redirected back to the app soon."
    }else {
        window.location.href = "intent://rewards.is-an.app/launch#Intent;scheme=https;end"
        document.getElementById("welcomeHeader").innerText = "Welcome Back!"
        document.getElementById("welcomeText").innerText = "Please close this window and continue to use the app."
    }
    window.open('', '_self')
    window.close()
}
function searchOn(iframe, count, delay, callback) {
    let needToInitiate = count;
    let needToLoad = count;
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
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getURLParameters() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (let [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

function updateURLParameter(parameterName, newValue) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(parameterName, newValue);

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.replaceState(null, '', newUrl);
}