angular.module("ng-token-auth",["ngCookies"]).provider("$auth",function(){var t,e;return t={"default":{apiUrl:"/api",signOutUrl:"/auth/sign_out",emailSignInPath:"/auth/sign_in",emailRegistrationPath:"/auth",accountUpdatePath:"/auth",accountDeletePath:"/auth",confirmationSuccessUrl:window.location.href,passwordResetPath:"/auth/password",passwordUpdatePath:"/auth/password",passwordResetSuccessUrl:window.location.href,tokenValidationPath:"/auth/validate_token",proxyIf:function(){return!1},proxyUrl:"/proxy",validateOnPageLoad:!0,forceHardRedirect:!1,storage:"cookies",tokenFormat:{"access-token":"{{ token }}","token-type":"Bearer",client:"{{ clientId }}",expiry:"{{ expiry }}",uid:"{{ uid }}"},parseExpiry:function(t){return 1e3*parseInt(t.expiry,10)||null},handleLoginResponse:function(t){return t.data},handleAccountUpdateResponse:function(t){return t.data},handleTokenValidationResponse:function(t){return t.data},authProviderPaths:{github:"/auth/github",facebook:"/auth/facebook",google:"/auth/google_oauth2"}}},e="default",{configure:function(r){var n,i,s,a,o,u,c,d;if(r instanceof Array&&r.length){for(a=0,u=r.length;u>a;a++)n=r[a],i=angular.copy(t["default"]),angular.extend(t,angular.extend(i,n));for(delete config["default"],d=r[0],o=0,c=d.length;c>o;o++){s=d[o],e=s;break}}else{if(!(r instanceof Object))throw"Invalid argument: ng-token-auth config should be an Array or Object.";angular.extend(t["default"],r)}return t},$get:["$http","$q","$location","$cookieStore","$window","$timeout","$rootScope","$interpolate",function(){return function(r,n,i,s,a,o,u,c){return{header:null,dfd:null,user:{},mustResetPassword:!1,currentConfigName:null,listener:null,initialize:function(){return this.setCurrentConfig(),this.initializeListeners(),this.addScopeMethods()},setCurrentConfig:function(){return"undefined"!=typeof a.localStorage&&null==this.currentConfigName&&(this.currentConfigName=a.localStorage.getItem("currentConfigName")),null!=this.currentConfigName?this.currentConfigName:this.currentConfigName=s.get("currentConfigName")||"default"},initializeListeners:function(){return this.listener=this.handlePostMessage.bind(this),a.addEventListener?a.addEventListener("message",this.listener,!1):void 0},cancel:function(t){return null!=this.t&&o.cancel(this.t),null!=this.dfd&&this.rejectDfd(t),o(function(t){return function(){return t.t=null}}(this),0)},destroy:function(){return this.cancel(),a.removeEventListener?a.removeEventListener("message",this.listener,!1):void 0},handlePostMessage:function(t){var e;return"deliverCredentials"===t.data.message&&(delete t.data.message,this.handleValidAuth(t.data,!0),u.$broadcast("auth:login-success",t.data)),"authFailure"===t.data.message?(e={reason:"unauthorized",errors:[t.data.error]},this.cancel(e),u.$broadcast("auth:login-error",e)):void 0},addScopeMethods:function(){return u.user=this.user,u.authenticate=function(t){return function(e,r){return t.authenticate(e,r)}}(this),u.signOut=function(t){return function(){return t.signOut()}}(this),u.destroyAccount=function(t){return function(){return t.destroyAccount()}}(this),u.submitRegistration=function(t){return function(e){return t.submitRegistration(e)}}(this),u.submitLogin=function(t){return function(e){return t.submitLogin(e)}}(this),u.requestPasswordReset=function(t){return function(e){return t.requestPasswordReset(e)}}(this),u.updatePassword=function(t){return function(e){return t.updatePassword(e)}}(this),u.updateAccount=function(t){return function(e){return t.updateAccount(e)}}(this),this.getConfig().validateOnPageLoad?this.validateUser():void 0},submitRegistration:function(t){var e;return e=n.defer(),angular.extend(t,{confirm_success_url:this.getConfig().confirmationSuccessUrl}),r.post(this.apiUrl()+this.getConfig().emailRegistrationPath,t).success(function(r){return u.$broadcast("auth:registration-email-success",t),e.resolve(r)}).error(function(t){return u.$broadcast("auth:registration-email-error",t),e.reject(t)}),e.promise},submitLogin:function(t){return this.initDfd(),r.post(this.apiUrl()+this.getConfig().emailSignInPath,t).success(function(t){return function(e){var r;return r=t.getConfig().handleLoginResponse(e),t.handleValidAuth(r),u.$broadcast("auth:login-success",t.user)}}(this)).error(function(t){return function(e){return t.rejectDfd({reason:"unauthorized",errors:["Invalid credentials"]}),u.$broadcast("auth:login-error",e)}}(this)),this.dfd.promise},userIsAuthenticated:function(){return this.headers&&this.user.signedIn},requestPasswordReset:function(t){var e;return t.redirect_url=this.getConfig().passwordResetSuccessUrl,e=n.defer(),r.post(this.apiUrl()+this.getConfig().passwordResetPath,t).success(function(r){return u.$broadcast("auth:password-reset-request-success",t),e.resolve(r)}).error(function(t){return u.$broadcast("auth:password-reset-request-error",t),e.reject(t)}),e.promise},updatePassword:function(t){var e;return e=n.defer(),r.put(this.apiUrl()+this.getConfig().passwordUpdatePath,t).success(function(t){return function(r){return u.$broadcast("auth:password-change-success",r),t.mustResetPassword=!1,e.resolve(r)}}(this)).error(function(t){return u.$broadcast("auth:password-change-error",t),e.reject(t)}),e.promise},updateAccount:function(t){var e;return e=n.defer(),r.put(this.apiUrl()+this.getConfig().accountUpdatePath,t).success(function(t){return function(r){return angular.extend(t.user,t.getConfig().handleAccountUpdateResponse(r)),u.$broadcast("auth:account-update-success",r),e.resolve(r)}}(this)).error(function(t){return u.$broadcast("auth:account-update-error",t),e.reject(t)}),e.promise},destroyAccount:function(t){var e;return e=n.defer(),r["delete"](this.apiUrl()+this.getConfig().accountUpdatePath,t).success(function(t){return function(r){return t.invalidateTokens(),u.$broadcast("auth:account-destroy-success",r),e.resolve(r)}}(this)).error(function(t){return u.$broadcast("auth:account-destroy-error",t),e.reject(t)}),e.promise},authenticate:function(t,e){return null==this.dfd&&(this.initDfd(),this.openAuthWindow(t,e)),this.dfd.promise},openAuthWindow:function(t,e){var r;return r=this.buildAuthUrl(t,e),this.useExternalWindow()?this.requestCredentials(a.open(r)):i.replace(r)},buildAuthUrl:function(t,e){var r,n,s,a;if(null==e&&(e={}),r=this.getConfig().apiUrl,r+=e.providerPath||this.getConfig().authProviderPaths[t],r+="?auth_origin_url="+i.href,null!=e.params){a=e.params;for(n in a)s=a[n],r+="&",r+=encodeURIComponent(n),r+="=",r+=encodeURIComponent(s)}return r},requestCredentials:function(t){return t.closed?(this.cancel({reason:"unauthorized",errors:["User canceled login"]}),u.$broadcast("auth:window-closed")):(t.postMessage("requestCredentials","*"),this.t=o(function(e){return function(){return e.requestCredentials(t)}}(this),500))},resolveDfd:function(){return this.dfd.resolve(this.user),o(function(t){return function(){return t.dfd=null,u.$$phase?void 0:u.$digest()}}(this),0)},validateUser:function(){var t,e,r;return null==this.dfd&&(this.initDfd(),this.userIsAuthenticated()?this.resolveDfd():(void 0!==i.search().token?(e=i.search().token,t=i.search().client_id,r=i.search().uid,this.mustResetPassword=i.search().reset_password,this.firstTimeLogin=i.search().account_confirmation_success,this.setAuthHeaders(this.buildAuthHeaders({token:e,clientId:t,uid:r})),i.url(i.path()||"/")):this.retrieveData("auth_headers")&&(this.headers=this.retrieveData("auth_headers")),isEmpty(this.headers)?(this.rejectDfd({reason:"unauthorized",errors:["No credentials"]}),u.$broadcast("auth:invalid")):this.validateToken())),this.dfd.promise},validateToken:function(){return this.tokenHasExpired()?this.rejectDfd({reason:"unauthorized",errors:["Expired credentials"]}):r.get(this.apiUrl()+this.getConfig().tokenValidationPath).success(function(t){return function(e){var r;return r=t.getConfig().handleTokenValidationResponse(e),t.handleValidAuth(r),t.firstTimeLogin&&u.$broadcast("auth:email-confirmation-success",t.user),t.mustResetPassword&&u.$broadcast("auth:password-reset-confirm-success",t.user),u.$broadcast("auth:validation-success",t.user)}}(this)).error(function(t){return function(e){return t.firstTimeLogin&&u.$broadcast("auth:email-confirmation-error",e),t.mustResetPassword&&u.$broadcast("auth:password-reset-confirm-error",e),u.$broadcast("auth:validation-error",e),t.rejectDfd({reason:"unauthorized",errors:e.errors})}}(this))},tokenHasExpired:function(){var t,e;return t=this.getExpiry(),e=(new Date).getTime(),this.headers&&t?t&&e>t:null},getExpiry:function(){return this.getConfig().parseExpiry(this.headers)},invalidateTokens:function(){var t,e,r;r=this.user;for(t in r)e=r[t],delete this.user[t];return this.headers=null,this.deleteData("auth_headers")},signOut:function(){var t;return t=n.defer(),r["delete"](this.apiUrl()+this.getConfig().signOutUrl).success(function(e){return function(r){return e.invalidateTokens(),u.$broadcast("auth:logout-success"),t.resolve(r)}}(this)).error(function(e){return function(r){return e.invalidateTokens(),u.$broadcast("auth:logout-error",r),t.reject(r)}}(this)),t.promise},handleValidAuth:function(t,e){return null==e&&(e=!1),null!=this.t&&o.cancel(this.t),angular.extend(this.user,t),this.user.signedIn=!0,e&&this.setAuthHeaders(this.buildAuthHeaders({token:this.user.auth_token,clientId:this.user.client_id,uid:this.user.uid})),this.resolveDfd()},buildAuthHeaders:function(t){var e,r,n,i;e={},i=this.getConfig().tokenFormat;for(r in i)n=i[r],e[r]=c(n)(t);return e},persistData:function(t,e){switch(this.getConfig().storage){case"localStorage":return a.localStorage.setItem(t,JSON.stringify(e));default:return s.put(t,e)}},retrieveData:function(t){switch(this.getConfig().storage){case"localStorage":return JSON.parse(a.localStorage.getItem(t));default:return s.get(t)}},deleteData:function(t){switch(this.getConfig().storage){case"localStorage":return a.localStorage.removeItem(t);default:return s.remove(t)}},setAuthHeaders:function(t){return this.headers=angular.extend(this.headers||{},t),this.persistData("auth_headers",this.headers)},useExternalWindow:function(){return!(this.getConfig().forceHardRedirect||a.isOldIE())},initDfd:function(){return this.dfd=n.defer()},rejectDfd:function(t){return this.invalidateTokens(),null!=this.dfd?(this.dfd.reject(t),o(function(t){return function(){return t.dfd=null}}(this),0)):void 0},apiUrl:function(){return this.getConfig().proxyIf()?this.getConfig().proxyUrl:this.getConfig().apiUrl},getConfig:function(e){return t[this.getCurrentConfigName(e)]},getCurrentConfigName:function(t){return t||this.currentConfigName||e}}}}(this)]}}).config(["$httpProvider",function(t){var e;return t.interceptors.push(["$injector",function(t){return{request:function(e){return t.invoke(["$http","$auth",function(t,r){var n,i,s,a;if(e.url.match(r.getConfig().apiUrl)){s=r.headers,a=[];for(n in s)i=s[n],a.push(e.headers[n]=i);return a}}]),e},response:function(e){return t.invoke(["$http","$auth",function(t,r){var n,i,s,a;i={},a=r.getConfig().tokenFormat;for(n in a)s=a[n],e.headers(n)&&(i[n]=e.headers(n));return r.setAuthHeaders(i)}]),e}}}]),e=["get","post","put","patch","delete"],angular.forEach(e,function(e){var r;return null==(r=t.defaults.headers)[e]&&(r[e]={}),t.defaults.headers[e]["If-Modified-Since"]="0"})}]).run(["$auth","$window","$rootScope",function(t){return t.initialize()}]),window.isOldIE=function(){var t,e,r;return e=!1,t=navigator.userAgent.toLowerCase(),t&&-1!==t.indexOf("msie")&&(r=parseInt(t.split("msie")[1]),10>r&&(e=!0)),e},window.isEmpty=function(t){var e,r;if(!t)return!0;if(t.length>0)return!1;if(0===t.length)return!0;for(e in t)if(r=t[e],Object.prototype.hasOwnProperty.call(t,e))return!1;return!0};