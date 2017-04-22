var app = angular.module('starter.controllers', [])

app.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout,  $location, $ionicPopup, $state, $q, $ionicLoading, UserServiceFB, UserServiceGL, $ionicActionSheet){

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.users = {};

  //--------------------------------------------
   $scope.login = function(user) {
    if(typeof(user)=='undefined'){
      $scope.showAlert('Please fill username and password to proceed.');  
      return false;
    }

    if(user.username=='demo@gmail.com' && user.password=='demo'){
            //$state.go('/app/profiles');
            $location.path('/app/dashboard');
    }else{
      $scope.showAlert('Invalid username or password.');  
    }
    
  };
  //--------------------------------------------
  $scope.logout = function() {   $location.path('/app/login');   };
  //--------------------------------------------
   // An alert dialog
   $scope.showAlert = function(msg) {
     var alertPopup = $ionicPopup.alert({
     title: 'Warning Message',
     template: msg
     });
   };
  //--------------------------------------------

   // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){ 
      $scope.showAlert(fbLoginError("Cannot find the authResponse"));
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      UserServiceFB.setUser({
        authResponse: authResponse,
        userID: profileInfo.id,
        name: profileInfo.name,
        email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      $location.path('/app/dashboard');
      $scope.showAlert(JSON.stringify(profileInfo));
    }, function(fail){
      // Fail get profile info
      $scope.showAlert('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $scope.showAlert('fbLoginError' + error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    window.facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
        console.log(response);
        $scope.showAlert(response);
        info.resolve(response);
      },
      function (response) {
        console.log(response);
        $scope.showAlert(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() 
  {
    window.facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        console.log("connected");
        //$scope.showAlert("connected");
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        $scope.showAlert('getLoginStatus', success.status);

        // Check if we have our user saved
        var user = UserServiceFB.getUser('facebook');

        if(!user.userID){
          getFacebookProfileInfo(success.authResponse)
          .then(function(profileInfo) {
            // For the purpose of this example I will store user data on local storage
            UserServiceFB.setUser({
              authResponse: success.authResponse,
              userID: profileInfo.id,
              name: profileInfo.name,
              email: profileInfo.email,
              picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
            });

           // $state.go('app.home');
            $location.path('/app/dashboard')
          }, function(fail){
            // Fail get profile info
            console.log('profile info fail', fail);
            $scope.showAlert('profile info fail', fail);
          });
        }else{
          $scope.showAlert('profile info fail');
          //$state.go('app.home');
        }
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
        // but has not authenticated your app
        // Else the person is not logged into Facebook,
        // so we're not sure if they are logged into this app or not.
        $scope.showAlert('getLoginStatus', success.status);
        try{
          $ionicLoading.show({
            template: 'Logging in...'
          });
          window.facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
          $location.path('/app/profile/:profileId');
        }
        catch(e){
          $scope.showAlert('error' + e);
        }

        // Ask the permissions you need. You can learn more about
        // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
      }
    }, function (e) {
        $scope.showAlert("Failed: " + e);
      });;
  };
  //LOGOUT FROM FACEBOOK
$scope.user = UserServiceFB.getUser();

  $scope.showLogOutMenu = function() {
    var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        return true;
      },
      destructiveButtonClicked: function(){
        $ionicLoading.show({
          template: 'Logging out...'
        });

        // Facebook logout
        window.facebookConnectPlugin.logout(function(){
          $ionicLoading.hide();
          $state.go('welcome');
        },
        function(fail){
          $ionicLoading.hide();
        });
      }
    });
  };

//GOOGLE LOGIN
  // This method is executed when the user press the "Sign in with Google" button
  $scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        // For the purpose of this example I will store user data on local storage
        UserServiceGL.setUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken
        });
        console.log('Received response.');
        $ionicLoading.hide();
        //console.log($location);
        //$state.go('app.home');
        $scope.showAlert("Welcome!");
        $location.path('/app/dashboard');
       /* $scope.showAlert(JSON.stringify($state));
        $scope.showAlert(JSON.stringify($location));*/
      },
      function (msg) {
        $scope.showAlert(JSON.stringify(msg));
        $ionicLoading.hide();
      }
    );
  };
//Logout 
    $scope.user = UserServiceGL.getUser();

    $scope.showLogOutMenu = function() {
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Logout',
        titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          return true;
        },
        destructiveButtonClicked: function(){
          $ionicLoading.show({
            template: 'Logging out...'
          });
          // Google logout
          window.plugins.googleplus.logout(
            function (msg) {
              console.log(msg);
              $ionicLoading.hide();
              $location.path('/app/login');
            },
            function(fail){
              console.log(fail);
            }
          );
        }
      });
    };
  });
//END LOGIN PART
/*app.controller('PostCtrl', function(){

})*/
app.controller('TodoCtrl', function($scope, $ionicModal) {
  // No need for testing data anymore
  $scope.tasks = [];

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createTask = function(task) {
    $scope.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();
    task.title = "";
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };
});
/*app.controller('TodoCtrl', function($scope, $http, $ionicModal) {
    $scope.todos = [];

        // when landing on the page, get all todos and show them
    $http.get('/api/todos')
         .success(function(data) {
             $scope.todos = data;
          });
         .error(function(data) {
              console.log('Error: ' + data);
          });

        // when submitting the add form, send the text to the node API
        $scope.createTask= function() 
        {
           $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
              $scope.taskModal = modal;
            }, {
              scope: $scope,
              animation: 'slide-in-up'
            });
                $http.post('/api/todos', $scope.formData)
                        .success(function(data) {
                                $scope.todos.push({
                                  title: task.title
                                });
                                $scope.taskModal.hide();
                                task.title = "";
                        });
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };

        // delete a todo after checking it
        $scope.deleteTask = function(id) 
        {
                $http.delete('/api/todos/' + id)
                        .success(function(data) {
                                $scope.todos = data;
                        })
                        .error(function(data) {
                                console.log('Error: ' + data);
                        });
        };
          // Open our new task modal
            $scope.newTask = function() {
              //$scope.taskModal.show();
            };

            // Close the new task modal
            $scope.closeNewTask = function() {
              $scope.taskModal.hide();
            };

  });*/
app.controller('ProfilesCtrl', function($scope, Profiles) {
  $scope.profiles = Profiles.all();
});

app.controller('ProfileCtrl', function($scope, $stateParams , Profiles) {
  $scope.profile = Profiles.get($stateParams.profileId);
});
app.controller('DashCtrl', function($scope, $stateParams , Profiles) {
  $scope.profiles = Profiles.all();
});

/////////////////////