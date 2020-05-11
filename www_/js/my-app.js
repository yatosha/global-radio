// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon:true,
    material: true,
    swipePanel: 'left'
  }); 
// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true
});

function radioLossConnection(){
    myApp.alert('Kuna tatizo a kiufundi. Jaribu tena kwa kufunga na kufungua app!','Samahani!');
}