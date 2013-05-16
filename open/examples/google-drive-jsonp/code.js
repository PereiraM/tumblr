var Version = {
    init: function() {
  	this.key = "0AjysYYjJHCE5dGE0WW9qT2l2UXE0ZnA3SmgxLW1RS2c"; // from spreadsheet.... see post for info
        this.getHistory(function() {
        //	If you need a callback then you can put it here...
        });
    },

    checkForVersionHash: function() {
        var hash = location.hash.split("#/");
        if (hash.length == 2) {
            return hash[1];
        }
        return false;
    },

    getHistory: function(callback) {
        var self = this;
		
        $.getJSON("http://spreadsheets.google.com/feeds/list/" + self.key + "/od6/public/values?alt=json-in-script&callback=?", function(data) {

            var table = $('#version-history table');
            if (!data.feed.entry) {
                table.append('<tr class="entry"><td colspan="3">Oops. Something is wrong. Updates may be pending. Try again later.</td></tr>');
                return;
            }

            var hashVersion = self.checkForVersionHash();
            var tr = document.querySelectorAll("#version-history tr.entry");

            $.each(data.feed.entry, function(i, entry) {

				console.log(i, entry);

				var item = "";
				var version = self.escapeHtml(entry.gsx$version.$t);
				if (version) {
				    self.version = version;
				}

				var klass = "";
				if (hashVersion == self.version) {
				    klass = ' highlight';
				}

				item += '<td class="narrow">' + version + '</td>';
				item += '<td class="date">' + self.simpleDate(entry.gsx$date.$t) + '</td>';

				var kicker = self.escapeHtml(entry.gsx$kicker.$t);
				if (kicker != "") {
				    kicker = "<b>" + kicker + "</b>";
				}

				item += '<td class="wide">' + kicker + self.formatHTML(entry.gsx$changes.$t) + '</td>';
				table.append('<tr class="entry' + klass + '">' + item + '</tr>');
  
            });
            if (callback) {
                callback();
            }
        });
    },

    escapeHtml: function(string) {
        var entityMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': '&quot;',
			"'": '&#39;',
			"/": '&#x2F;'
        };
        return String(string).replace(/[&<>"'\/]/g, function(s) {
            return entityMap[s];
        });
    }, 

    isLoaded: function() {
        if (document.getElementById('kascript')) {
            return true;
        }
        return false;
    },

    simpleDate: function(timestamp) {
        if (timestamp.length == 0) {
            return "";
        }

        var d = new Date(timestamp);
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        return curr_month + "/" + curr_date + "/" + curr_year;
    },

    formatHTML: function(txt) {
        var txt = this.escapeHtml(txt);

        if (txt.indexOf("@") == -1) {
            return txt;
        }

        var str = "";
        var words = txt.split(" ");
        var len = words.length;

        for (var i = 0; i < len; i++) {
            var w = words[i];
            if (w.length > 1 && w.charAt(0) == "@") {
                str += "<a href='http://twitter.com/" + w.substring(1) + "' target='_blank'>" + w + "</a> ";
            } else {
                str += w + " ";
            }
        }
        return str;
    }
};

$(document).ready(function() {
    Version.init();
});
