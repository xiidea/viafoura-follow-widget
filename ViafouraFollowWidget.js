
(function( $ ){
    var createCookie = function (name, value) {
        var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    var DEFAULT_SETTINGS = {
        followLabelText:"Follow",
        unFollowLabelText:"Unfollow"
    };

    var allWidgets = [];
    var methods = {
        init : function( options ) {
            var settings = $.extend({}, DEFAULT_SETTINGS, options || {});

            return this.each(function(){
                var el = $(this);

                el.attr('data-d') || el.attr('data-d','subscribe-user');
                el.attr('data-t') || el.attr('data-t','tooltip');
                el.addClass('vf-has-tooltip');

                var widgetObject = new LoginWidget(el, settings);
                if(typeof Viafoura == 'undefined'){
                    allWidgets.push(widgetObject);
                }else{
                    widgetObject.AddListeners();
                }
                $(this).data("widgetObject", widgetObject);
            });

        }
    };

    $.fn.ViafouraFollowWidget = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' + method + ' does not exist on jQuery.ViafouraFollowWidget' );
        }

    };

    var LoginWidget = function (el, settings) {
        var self = this;
        self.followQueue = false;
        self.userId = el.attr('data-id');


        this.bindEvents = function(){

            el.click(function(e){
                e.preventDefault();
                if(el.hasClass('followed')){
                    Viafoura.publish('/services/unfollow',self.userId);
                    self.updateFollowStatus(false);
                }else{
                    if(!(self.Viafoura.current.user.id && self.Viafoura.current.user.id != 0)){
                        self.followQueue = true;
                        Viafoura.publish('/user/login/click');
                    }else{
                        self.updateFollowStatus(true);
                        Viafoura.publish('/services/follow',self.userId);
                    }
                }
            });
        };

        this.updateFollowStatus = function(status){
            if(status){
                el.addClass('followed');
                el.html(settings.unFollowLabelText);
            }else{
                el.removeClass('followed');
                el.html(settings.followLabelText);
            }
        }

        this.getUser = function(userId, callback){
            var data = {verb:"get", session:window.sessionStorage._vf_sid};
            self.Ajax("/users/"+userId, {},callback);
        };

        this.Ajax = function(route,data,callback){
            var url = self.siteSettings.api_url+"?callback=?";
            var jsonParam = '{"requests":{"data":{"verb":"get","route":"'+route+'"}},' +
                '"site":"'+self.siteSettings.domain+'","session":"'+window.sessionStorage._vf_sid+'"}';

            var data = {json: jsonParam};
            jQuery.getJSON(url, {json: jsonParam}, function (data,status,xhr) {
                var returnValue = data.responses.data || false;
                callback.call(self,returnValue.result,status,xhr)
            })
        };

        this.AddListeners = function(){
            self.Viafoura = Viafoura.core;
            self.bindEvents();
            self.siteSettings = Viafoura.core.locations;

            Viafoura.subscribe("/response/follows/" + self.userId,function(e, t, n, r){
                self.updateFollowStatus(r.data.verb !== "delete");
            });


            Viafoura.subscribe('/user/login/success',function(){

                if(self.Viafoura.current.user.id && self.Viafoura.current.user.id != 0){ //Logout
                    createCookie('vf_session', window.sessionStorage._vf_sid);

                    self.getUser(self.userId,function(result,status,xhr){
                        self.updateFollowStatus(result.subscribed);
                        if(self.followQueue && !result.subscribed){
                            Viafoura.publish('/services/follow',self.userId);
                        }
                        self.followQueue = false;
                    });
                }else{
                    self.updateFollowStatus(false);
                    createCookie('vf_session', "");
                }
            });

            Viafoura.subscribe('/user/logout', function () {
                self.updateFollowStatus(false);
                createCookie('vf_session', "");
            });

        };
    };



    var ViafouraDependentInit = function (callableFunction){
        if(typeof Viafoura == 'undefined'){
            setTimeout(function(){
                ViafouraDependentInit(callableFunction)
            },10);
            return;
        }
        callableFunction();
    };

    var ViafouraLoaded = function(){
        if(allWidgets.length == 0){
            return;
        }
        for (var index = 0; index < allWidgets.length; index++) {
            allWidgets[index].AddListeners();
        }
    };
    ViafouraDependentInit(ViafouraLoaded);
})( jQuery );