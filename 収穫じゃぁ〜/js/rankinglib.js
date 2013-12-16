var RankingLib = enchant.Class.create({
    initialize: function(url) {
        this.url = "";
        this.params = [];
        this.setURL(url);
    },
    setURL: function(url) {
        this.url = url;
    },
    setParam: function(key, val) {
        this.params[key] = val;
    },
    getURL: function() {
        var params = [];
        for (var k in this.params) {
            params.push(k + "=" + this.params[k]);
        }
        params = params.join("&");
        if (this.url.indexOf("?") >= 0) {
            return this.url + "&" + params;
        } else {
            return this.url + "?" + params;
        }
    },
    getEncodeURL: function() {
        return encodeURIComponent(this.getURL());
    },
    clearParams: function() {
        this.params = [];
    },
    gotoSite: function() {
        window.location.href = this.getURL();
    }
});