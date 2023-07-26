function setUserAgent(window, userAgent) {
    if (window.navigator.userAgent !== userAgent) {
        var userAgentProp = {
            get: function() {
                return userAgent;
            }
        };
        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(navigator, {
                userAgent: userAgentProp
            });
        }
    }
}
window.onload = function() {
    let x = document.getElementById("iframe");
    setUserAgent(x.contentWindow, 'Mozilla/5.0 (Linux; Android 12; RMX2156) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36 EdgA/114.0.1823.68');
    x.contentWindow.navigator.userAgent = 'Custom User Agent';
    x.src = "https://whatsmyua.info/";
}