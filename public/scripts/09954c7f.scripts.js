"use strict";angular.module("intquestApp",["ngCookies","ngResource","ngSanitize","ngRoute","http-auth-interceptor","ui.bootstrap","btford.markdown"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"partials/questions/list.html",controller:"QuestionsCtrl"}).when("/questions",{templateUrl:"partials/questions/list.html",controller:"QuestionsCtrl"}).when("/questions/create",{templateUrl:"partials/questions/add.html",controller:"QuestionsCtrl"}).when("/questions/:questionId/edit",{templateUrl:"partials/questions/edit.html",controller:"QuestionsCtrl"}).when("/questions/:questionId",{templateUrl:"partials/questions/list.html",controller:"QuestionsCtrl"}).when("/login",{templateUrl:"partials/login.html",controller:"LoginCtrl"}).when("/signup",{templateUrl:"partials/signup.html",controller:"SignupCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).run(["$rootScope","$location","Auth",function(a,b,c){a.$watch("currentUser",function(a){a||-1!=["/","/login","/logout","/signup"].indexOf(b.path())||c.currentUser()}),a.$on("event:auth-loginRequired",function(){return b.path("/"),!1})}]),angular.module("intquestApp").controller("SplashCtrl",["$scope",function(){}]),angular.module("intquestApp").controller("LoginCtrl",["$scope","Auth","$location",function(a,b,c){a.error={},a.user={},a.login=function(d){b.login("password",{email:a.user.email,password:a.user.password},function(b){a.errors={},b?(angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.type}),a.error.other=b.message):c.path("/")})}}]),angular.module("intquestApp").controller("HeaderCtrl",["$scope","Auth","$location",function(a,b,c){a.menu=[{title:"All questions",link:"questions"}],a.authMenu=[{title:"Add question",link:"questions/create"}],a.logout=function(){b.logout(function(a){a||c.path("/login")})}}]),angular.module("intquestApp").controller("SignupCtrl",["$scope","Auth","$location",function(a,b,c){a.register=function(d){b.createUser({email:a.user.email,username:a.user.username,password:a.user.password},function(b){a.errors={},b?angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.type}):c.path("/")})}}]),angular.module("intquestApp").controller("QuestionsCtrl",["$scope","Questions","$location","$routeParams","$rootScope","$http",function(a,b,c,d){a.create=function(){var a=new b({title:this.title,content:this.content,tags:this.tags});a.$save(function(a){c.path("questions/"+a._id)}),this.title="",this.content="",this.tags=""},a.remove=function(b){b.$remove();for(var c in a.questions)a.questions[c]==b&&a.questions.splice(c,1)},a.update=function(){var b=a.question;b.$update(function(){c.path("questions/"+b._id)})},a.find=function(){b.query(function(b){a.questions=b})},a.openQuestion=""!=c.$$path.slice(11),a.findOne=function(){a.openQuestion&&b.get({questionId:d.questionId},function(b){a.question=b})},a.scoreClicked=function(a){return a+=1}}]),angular.module("intquestApp").directive("uniqueUsername",["$http",function(a){return{restrict:"A",require:"ngModel",link:function(b,c,d,e){function f(b){return b?void a.get("/auth/check_username/"+b).success(function(a){a.exists?e.$setValidity("unique",!1):e.$setValidity("unique",!0)}):void e.$setValidity("unique",!0)}b.$watch(function(){return e.$viewValue},f)}}}]),angular.module("intquestApp").factory("Auth",["$location","$rootScope","Session","User","$cookieStore",function(a,b,c,d,e){return b.currentUser=e.get("user")||null,e.remove("user"),{login:function(a,d,e){var f=e||angular.noop;c.save({provider:a,email:d.email,password:d.password,rememberMe:d.rememberMe},function(a){return b.currentUser=a,f()},function(a){return f(a.data)})},logout:function(a){var d=a||angular.noop;c.delete(function(){return b.currentUser=null,d()},function(a){return d(a.data)})},createUser:function(a,c){var e=c||angular.noop;d.save(a,function(a){return b.currentUser=a,e()},function(a){return e(a.data)})},currentUser:function(){c.get(function(a){b.currentUser=a})},changePassword:function(a,b,c,e){var f=e||angular.noop;d.update({email:a,oldPassword:b,newPassword:c},function(){return console.log("password changed"),f()},function(a){return f(a.data)})},removeUser:function(a,b,c){var e=c||angular.noop;d.delete({email:a,password:b},function(a){return console.log(a+"removed"),e()},function(a){return e(a.data)})}}}]),angular.module("intquestApp").factory("User",["$resource",function(a){return a("/auth/users/:id/",{},{update:{method:"PUT"}})}]),angular.module("intquestApp").constant("focusConfig",{focusClass:"focused"}).directive("onFocus",["focusConfig",function(a){return{restrict:"A",require:"ngModel",link:function(b,c,d,e){e.$focused=!1,c.bind("focus",function(){c.addClass(a.focusClass),b.$apply(function(){e.$focused=!0})}).bind("blur",function(){c.removeClass(a.focusClass),b.$apply(function(){e.$focused=!1})})}}}]),angular.module("intquestApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("intquestApp").factory("Session",["$resource",function(a){return a("/auth/session/")}]),angular.module("intquestApp").factory("Questions",["$resource",function(a){return a("api/questions/:questionId",{questionId:"@_id"},{update:{method:"PUT"}})}]);