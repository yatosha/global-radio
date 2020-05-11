var storage = window.localStorage;
var push;
var player = document.getElementById("player");
var isOn = false;
var volume = 1;
var radio_url = "http://zas5.ndx.co.za:9606/;?1559205737673";

var server_url = "https://console.globalradio.co.tz/api/";
var app_link = "https://play.google.com/store/apps/details?id=com.globalradio.app";


var retryCount = 0;


//player error event handler
player.onerror = function() {
    //force restart
    $("#toggle_btn_2").attr("src","./img/play_btn.png");
    $("#play_ring").removeClass("rotate-in-center");
    isOn = false;
    //alert(player.error.message);
    setTimeout(function(){
        retryRadio();
    },2000);
};


player.onplaying = function() {
    isOn = true;
    $("#toggle_btn_2").attr("src","./img/pause_btn.png");
    $("#play_ring").addClass("rotate-in-center");
    retryCount = 0;
    //cordova.plugins.backgroundMode.setEnabled(true);
};


player.ontimeupdate  = function() {
	//$("#eventText").html("Muda: " + formatSecs(player.currentTime.toFixed()));
};


function retryRadio(){
    if(retryCount < 30){
        radio_url = "http://zas5.ndx.co.za:9606/;?"+randTag();
        console.log(radio_url)
        player.src = radio_url;
        player.load();
        var promise = player.play();
        if (promise !== undefined) {
            promise.then(_ => {
                // Autoplay started!
                //cordova.plugins.backgroundMode.setEnabled(true);
            }).catch(error => {
                // Autoplay was prevented.
                // Show a "Play" button so that user can start playback.
                //myApp.alert('Bofya kitufe cha play kuwasha radio.','Washa!');
            });
        }
        retryCount++;
    }else{
        radioLossConnection();
        //cordova.plugins.backgroundMode.setEnabled(false);
    }

}

function randTag(){
    var min=1559205000000; 
    var max=1559205999999;  
    return  Math.floor(Math.random() * (max - min + 1) + min);
}


//function to format the seconds to hour min seconds
function formatSecs(secs){
	var date = new Date(null);
	date.setSeconds(secs); // specify value for SECONDS here
	var timeString = date.toISOString().substr(11, 8);
	return(timeString)
}
//funtion to turn the radio on or off
function togglePlayer(){
	if(isOn){
        player.pause();
        $("#toggle_btn_2").attr("src","./img/play_btn.png");
        $("#play_ring").removeClass("rotate-in-center");
		isOn = false;
	}else{
		player.play();
        $("#toggle_btn_2").attr("src","./img/pause_btn.png");
        $("#play_ring").addClass("rotate-in-center");
		isOn = true;
	}
}


var defaultID = {
	banner:"ca-app-pub-1785047855891228/6313807274",
	interstitial:"ca-app-pub-1785047855891228/7243745560"
}


if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
    document.addEventListener('deviceready', initApp, false);
    document.addEventListener("backbutton", onBackKeyDown, false);

} else {
    initApp();
}

function onBackKeyDown() {
    // Handle the back button
    //cordova.plugins.backgroundMode.moveToBackground();
        myApp.modal({
          title:  'Kabla hujaondoka!',
          text: 'Tungependa usambaze upendo kwa ku share app ya Global Radio na marafiki au utupe ratings Playstore! Asante.',
          buttons: [
            {
              text: 'Share',
              onClick: function() {
                shareApp()
              }
            },
            {
              text: 'Rate',
              onClick: function() {
                openLink(app_link)
              }
            },
            {
                text: 'Funga',
                onClick: function() {
                  navigator.app.exitApp()
                }
              },
            {
            text: 'Ghairi',
            bold: true,
            onClick: function() {
                //navigator.app.exitApp()
            }
            },
          ]
        });  
}
//initApp();
function initApp(){
    
    retryRadio();
    player.volume = volume;
    //initialize firebase fcm
    //initFCM();
    //check if the user has ever signed up
    if(storage.getItem("first_run")){
    }else{
        //user has never opened the app
        setTimeout(function(){
            //$("#ads-alert").modal("show");
        },2000)
        storage.setItem("first_run", "true");
    }

    //check if the user has rate app
    if(storage.getItem("rateApp")){
    }else{
        setTimeout(function(){
            //$("#rateAppModal").modal('show');
        },15000);
    }
    //init ads
    //initAds();
    //init localads
    //initLocalAds();
    //initNowPlaying();



}

//function to load local ads
function initNowPlaying(){
    $.ajax({
       url:server_url+"?a=get_now_playing",
       type:"GET",
       success:function(result){
           var data = JSON.parse(result);
           if(data.ret == 200){
               var playing = data.playing; $("#now_playing").html("- "+playing);
               //alert("playing:"+playing);
            setTimeout(function(){
                initNowPlaying();
            },900000)
           }
       },
       error:function(error){
       }

   });

   
}

function normalOpenLink(url){
    window.open(url);
}

//function to load local ads
function initLocalAds(){
    mainView.hideToolbar("toolbar_bottom");
    $.ajax({
       url:server_url+"?a=get_banner_ad",
       type:"GET",
       success:function(result){
           var data = JSON.parse(result);
           if(data.ret == 200){
               var ad_image = data.ad_image;
               var ad_url  = data.ad_url;
               var output ="<a href='#' onclick='openLink("+ '"'+ ad_url +'"'+")'><img src='"+ad_image+"' width='100%' height='70px'/></a>"
                $("#localbannerad").html(output);
                mainView.showToolbar();
           }
       },
       error:function(error){
           //$("#request-error").modal("show");
           //alert(error);
           $("#native_ad").addClass('hidden');
       }

   });
}

//function to initialize ads
function initAds(){
    if (! AdMob ) { alert( 'admob plugin not ready' ); return; }
	//initiate the ads sequence
	createBanner();
	//createInterstitial();
	//register the ad events
	adEvents();
}
//the ad events
function adEvents(){
	//when ad is not loaded
	document.addEventListener('onAdFailLoad', function(e){
        //alert("onAdFailLoad()");
		createInterstitial();
	});
	//when interstitial ad is dismissed
	document.addEventListener('onAdDismiss', function(e){
            createInterstitial();
		
	});
	//when ad is clicked
	document.addEventListener('onAdLeaveApp', function(e){
            createInterstitial();
	});
}


//show the interstitial ad
function showInterstitial(){
	if(AdMob) AdMob.showInterstitial();
}

//create and load a banner ad!
function createBanner(){
	if(AdMob) AdMob.createBanner({
    adId: defaultID.banner,
    isTesting: true, 
	position: AdMob.AD_POSITION.BOTTOM_CENTER,
	autoShow: true });
}

//create interstitial ad and wait for showing trigger
function createInterstitial(){
    //if(AdMob) AdMob.prepareInterstitial( {adId:defaultID.interstitial, autoShow:false} );
    AdMob.prepareInterstitial({
        adId: defaultID.interstitial,
        isTesting: true, // TODO: remove this line when release
        autoShow: false
      });
}

//function to close the app
function closeAPP(){
	navigator.app.exitApp();
}



//function to scroll top
function scrolTop(){
    window.scrollTo(0, 0);
}


//function to rate app
function rateApp(){
    storage.setItem("rateApp", true);
    openLink(app_link);
}


//function to open a link
function openLink(url){
    //alert(url);
    var target = "_blank";
    var options = "location=yes";
    var inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);

    inAppBrowserRef.addEventListener('loadstart', loadstartCallback);
    inAppBrowserRef.addEventListener('loadstop', loadstopCallback);
    inAppBrowserRef.addEventListener('loaderror', loaderrorCallback);
    inAppBrowserRef.addEventListener('exit', exitCallback);
 
    function loadstartCallback(event) {
       //console.log('Loading started: '  + event.url)
    }
 
    function loadstopCallback(event) {
       //console.log('Loading finished: ' + event.url)
    }
 
    function loaderrorCallback(error) {
       //console.log('Loading error: ' + error.message)
    }
 
    function exitCallback() {
       //showInterstitial();
    }
}

//function to share the app lin
function shareApp(){
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    //alert(share_text);
var options = {
    message: "Download app ya Global Radio upate habari na matukio. " + app_link, // not supported on some apps (Facebook, Instagram)
    subject: '+255 Global Radio', // fi. for email
    files: ['', ''], // an array of filenames either locally or remotely
    url: '',
    chooserTitle: 'Share using' // Android only, you can override the default share sheet title,
  };
  
  var onSuccess = function(result) {
    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  };
  
  var onError = function(msg) {
    console.log("Sharing failed with message: " + msg);
  };
  
  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}


//functions to hide, show loading
function hideLoading(){
    $('#loading').addClass('hidden');
}
function showLoading(){
    $('#loading').removeClass('hidden');
}

//function to init the FCM Protocols
function initFCM(){
	//initialize the google cloud notification service
	push = PushNotification.init({ "android": {"senderID": "929437853102"}});
	push.on('registration', function(data) {
        $.ajax({
            url:server_url+"?a=save_fcm&fcm_id="+data.registrationId,
            type:"GET",
            success:function(result){
            },
            error:function(error){
                //$("#request-error").modal("show");
                //alert(error);
            }
     
        });
	    //alert("fcmID: "+data.registrationId);
	});

	push.on('notification', function(data) {
        
		/*
		
		var intention = data.additionalData.intention;
		//parse result notification
		if(intention == 'result_notification'){
			
			var draw = data.additionalData.draw;
			var time = data.additionalData.time;
			var result = data.additionalData.result;
			var output = "<p>Matokeo droo namba "+draw+",<br/>ya "+time+", namba iliyoshinda ni:</p>"+"<h1 class='b random-number'>"+result+"</h1><p class='small'>Kupata namba zijazo bofya hapo chini.</p><br/><a href='#slotTab' data-toggle='tab' data-dismiss='modal' class='btn btn-link'>Nama 3 Zijazo</a>";
			//alert(output);
			
			$("#pushDetails").html(output);
			$("#pushModal").modal('show');
			getResults();
		}
		
		//parse the ad notification
		if(intention == 'advertisement'){
			var ad_image = data.additionalData.ad_image;
			var ad_title = data.additionalData.ad_title;
			var ad_description = data.additionalData.ad_description;
			var ad_action_label = data.additionalData.ad_action_label;
			var ad_action_url = data.additionalData.ad_action_url;
			var output = "<h3>"+ad_title+"</h3><img data-src='"+ad_image+"' src='./img/preloader.gif'  class='ad-image' width='80%' height='auto'/><p>"+ad_description+"</p>"+"<br/><a href='"+ad_action_url+"' target='_blank' class='btn btn-link'>"+ad_action_label+"</a>";
			$("#adContent").html(output);
			lazyLoad();
			$("#advertModal").modal('show');
		}
			
		*/
	});
	 
	push.on('error', function(e) {
        //alert("Push error:"+e);
	});

}


