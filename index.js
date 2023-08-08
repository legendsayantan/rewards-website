var mainpage = window.document.getElementsByClassName("page")[0]
load(window.location.pathname)
var homeButton = document.getElementById("home")
var onlineButton = document.getElementById("online")
var downloadButton = document.getElementById("download")
homeButton.addEventListener("click", function () {
    load("/index.html")
})
onlineButton.addEventListener("click", function () {
    load("/online.html")
})
downloadButton.addEventListener("click", function () {
  window.open("https://github.com/legendsayantan/msrewards/releases/latest")
})

function load(path) {
    var htmlFile = path.includes('/index.html') ? '/home.html' : (path==='/'?'/home.html':path)
    fetch(htmlFile).then(function (response) {
        return response.text();
    }).then(function (html) {
        mainpage.innerHTML = html;
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
    delay.value = onlineDelay==null?'5':onlineDelay
    count.value = onlineCount==null?(desktopBrowser ? '30' : '20'):onlineCount;
    const configView = document.getElementById("online-configuration")
    const runView = document.getElementById("online-run")
    const iframe = document.getElementById("frame")
    const progress = document.getElementById("online-progress")
    const dashboard =document.getElementById("dashboard")
    var search = function () {
        configView.style.setProperty("display", "none")
        runView.style.setProperty("display", "flex")
        searchOn(iframe,count.value,delay.value,function (remaining) {
            progress.innerHTML = 'Completed <b>'+(count.value-remaining)+' / '+count.value+'</b> searches.'
            dashboard.style.setProperty("display",remaining===0?"block":"none")
            document.getElementById("promotion").style.setProperty("display",remaining===0?"block":"none")
        })
    }
    mobilesearch.addEventListener('click', search)
    pcsearch.addEventListener('click', search)
    edgepoint.addEventListener('click', search)
    dashboard.addEventListener('click',function () {
        window.open("https://rewards.bing.com/?signIn=1")
    })
}

function searchOn(iframe,count,delay,callback){
    var runCount = count;
    window.localStorage.setItem('online-count',count)
    window.localStorage.setItem('online-delay',delay)
    iframe.addEventListener('load', function () {
        runCount--;
        if(runCount>0){
            setTimeout(function (){
                iframe.src = "https://www.bing.com/search?q="+generateRandomString(Math.random()*9+1)
            },delay)
        }
        callback(runCount)
    })
    iframe.src = "https://www.bing.com/search?q="+generateRandomString(Math.random()*9+1)
}
function generateRandomString(length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for(var i=0;i<length;i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}