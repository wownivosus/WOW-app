// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic','starter.controllers' , 'starter.services'])

app.run(function($ionicPlatform , $rootScope, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

     $rootScope.authStatus = false;
   //stateChange event
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      $rootScope.authStatus = toState.authStatus;
      if($rootScope.authStatus){
        
      
      }
    });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    console.log("URL : "+toState.url);
    if(toState.url=='/dashboard'){
      console.log("match : "+toState.url);
      $timeout(function(){
        angular.element(document.querySelector('#leftMenu' )).removeClass("hide");
      },1000);
    } 
  });

})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

//--------------------------------------

 .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-signin.html'
      }
    },
  authStatus: false
  })
 .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-signup.html',
      }
   },
  authStatus: false
  })
//--------------------------------------




    .state('app.profiles', {
      url: '/profiles',
      views: {
        'menuContent': {
          templateUrl: 'templates/profiles.html',
          controller: 'ProfilesCtrl'
        }
      }
    })

  .state('app.profile', {
    url: '/profile/:todoId',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile-detail.html',
        controller: 'TodoCtrl'
      }
    }
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent' : {
        templateUrl: 'templates/tabs.html'
      }
    }
  })

    .state('app.dashboard.home', {
      url: '/home',
      views: {
        'home-tab' : {
          templateUrl: 'templates/home.html'
        }
      }
    })

    .state('app.dashboard.person', {
      url: '/person',
      views: {
        'person-tab' : {
          templateUrl: 'templates/person.html'
        }
      }
    })
    
    .state('app.dashboard.category', {
      url: '/category',
      views: {
        'category-tab' : {
          templateUrl: 'templates/category.html'
        }
      }
    })

    .state('app.dashboard.pubs', {
      url: '/pubs',
      views: {
        'pubs-tab' : {
          templateUrl: 'templates/pubs.html',
          controller: 'PubsController'
        }
      }
    })

    .state('app.dashboard.pubs_detail', {
      url: '/pubs/:aId',
      views: {
        'pubs-tab' : {
          templateUrl: 'templates/pubs_detail.html',
          controller: 'PubsController'
        }
      }
    })

    .state('app.dashboard.list', {
      url: '/list',
      views: {
        'list-tab' : {
          templateUrl: 'templates/list.html',
          controller: 'ListController'
        }
      }
    })

    .state('app.dashboard.detail', {
      url: '/list/:aId',
      views: {
        'list-tab' : {
          templateUrl: 'templates/detail.html',
          controller: 'ListController'
        }
      }
    })

.state('app.dashboard.teh', {
      url: '/teh',
      views: {
        'teh-tab' : {
          templateUrl: 'templates/teh.html',
          controller: 'TehController'
        }
      }
    })

    .state('app.dashboard.teh_detail', {
      url: '/teh/:aId',
      views: {
        'tah-tab' : {
          templateUrl: 'templates/teh_detail.html',
          controller: 'TehController'
        }
      }
    })

.state('app.dashboard.book', {
      url: '/book',
      views: {
        'book-tab' : {
          templateUrl: 'templates/book.html',
          controller: 'BookController'
        }
      }
    })

    .state('app.dashboard.b_detail', {
      url: '/book/:aId',
      views: {
        'book-tab' : {
          templateUrl: 'templates/b_detail.html',
          controller: 'BookController'
        }
      }
    })

.state('app.dashboard.fw', {
      url: '/fw',
      views: {
        'fw-tab' : {
          templateUrl: 'templates/fw.html',
          controller: 'FwController'
        }
      }
    })

    .state('app.dashboard.fw_detail', {
      url: '/fw/:aId',
      views: {
        'fw-tab' : {
          templateUrl: 'templates/fw_detail.html',
          controller: 'FwController'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});