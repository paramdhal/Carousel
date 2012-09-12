(function () {
    
    var viewFullScreen = $('#view-fullscreen');
    if (viewFullScreen.length>0) {
        viewFullScreen.on("click", function () {
            var docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
            return false;
        });
    }

    var cancelFullScreen = document.getElementById("cancel-fullscreen");
    if (cancelFullScreen) {
        cancelFullScreen.addEventListener("click", function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }, false);
    }


    

        document.addEventListener("fullscreenchange", function () {
            (document.fullscreen) ? addFullScreenClass() : removeFullScreenClass();
        }, false);
        
        document.addEventListener("mozfullscreenchange", function () {
            (document.mozFullScreen) ? addFullScreenClass() : removeFullScreenClass();
        }, false);
        
        document.addEventListener("webkitfullscreenchange", function () {
            (document.webkitIsFullScreen) ? addFullScreenClass() : removeFullScreenClass();
        }, false);
    

    function addFullScreenClass(){
    	$('body').addClass("fullScreen");
    }
    function removeFullScreenClass(){
    	$('body').removeClass("fullScreen");
    }

})();
