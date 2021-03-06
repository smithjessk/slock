var successURL = 'https://www.facebook.com/connect/login_success.html';

// Modified from https://github.com/nobuf/facebook-connect-for-chrome-extension
function onFacebookLogin() {
    if (!localStorage.accessToken) {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            tabs.forEach(function(tab) {
                if (tab.url.indexOf(successURL) == 0) {
                    chrome.tabs.onUpdated.removeListener(onFacebookLogin);
                    var params = tab.url.split('#')[1];
                    var accessToken = params.split('&')[0].split("=")[1];
                    $.ajax({
                        url: "http://45.55.145.225:4242/token/" + accessToken
                    }).done(function(res) {
                        var accessToken = res.token.split("=")[1].split("&")[0];
                        chrome.storage.local.set({accessToken: accessToken});
                        chrome.storage.local.get('accessToken', function(data) {
                            localStorage.accessToken = data.accessToken;
                            console.log(data);
                        });
                        chrome.tabs.remove(tab.id, function() {});
                    });
                    return;
                }
            });
        });
    }
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);
