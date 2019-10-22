/*
Copyright (C) 2017-2019  Barry de Graaff

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.
*/

function tk_barrydegraaff_2fa_HandlerObject() {
   tk_barrydegraaff_2fa_HandlerObject.settings = {};
};

tk_barrydegraaff_2fa_HandlerObject.prototype = new ZmZimletBase();
tk_barrydegraaff_2fa_HandlerObject.prototype.constructor = tk_barrydegraaff_2fa_HandlerObject;
var TwoFaZimlet = tk_barrydegraaff_2fa_HandlerObject;

TwoFaZimlet.prototype.init = function () {
   try {
      var section = {
         title: '雙因素帳戶安全',
         icon: 'tk_barrydegraaff_2fa-panelIcon',
         //templateId: 'tk_barrydegraaff_2fa.templates.preferences' + '#Preferences',
         priority: 49,
         manageDirty: true,
         prefs: [
            'MySetting',
         ],
         createView: function(parent, sectionObj, controller) {
            return new TwoFaZimletPrefs(parent, sectionObj, controller, appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject);
         }
      };
      ZmPref.registerPrefSection('2FA_PREFERENCES', section);
   } catch (exception)
   {
      TwoFaZimlet.prototype.displayError('2FA Zimlet Initialization error occurred',window.btoa(exception),'2FA Zimlet Initialization error occurred');
   }   
};

/* status method show a Zimbra status message
* */
TwoFaZimlet.prototype.status = function(text, type) {
   var transitions = [ ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.FADE_OUT ];
   appCtxt.getAppController().setStatusMsg(text, type, null, transitions);
}; 

TwoFaZimlet.prototype._cancelBtn =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {}
};

TwoFaZimletPrefs = function(shell, section, controller, handler) {
   if (!arguments.length) return;
   this._createHtml = function(){return document.createTextNode("");};
   
   this.getHtmlElement = function()
   {
      g = document.createElement('div');
      g.setAttribute("id", "tk_barrydegraaff_2fa_prefscreen");
      g.setAttribute("class", "ZmPreferencesPage ZWidget");
      return g;
   };
   
   this.setScrollStyle = function(){return 'none';};

   this.hideMe = function()
   {
      document.getElementById('tk_barrydegraaff_2fa_prefscreen').style='display:none';
      document.getElementById('zb__PREF__SAVE').style='display:block';
      return;
   };
   this.resetSize = function()   
   {       
      var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
      zimletInstance.resize();      
   };
   this.setVisible = function(){return;};
   
   this.showMe = function()
   {
      TwoFaZimlet.prototype.showMeImpl();
   };
   
   this.getTabGroupMember = function(){return;};
   this.hasResetButton = function(){return false;};
   this.getTitle = function(){return '雙因素帳戶安全';};
   
   this._handler = handler;
   ZmPreferencesPage.call(this, shell, section, controller);
};

TwoFaZimlet.prototype.resize = function()
{
   try {
      if(appCtxt.getCurrentView().getActiveView()._section.id == '2FA_PREFERENCES')
      {
         document.title = "Zimbra: " + ZmMsg.preferences +": 雙因素帳戶安全";   
         var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
         zimletInstance.appHeight = (Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight )-110 );         
         document.getElementById('tk_barrydegraaff_2fa_prefscreen').style='display:block; overflow-y: auto !important; max-height:'+zimletInstance.appHeight+'px !important';
      }
   }
   catch(err)   
   {
   }
   return;
};   

TwoFaZimlet.prototype.showMeImpl = function()
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   zimletInstance.resize();
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {} 
   document.getElementById('zb__PREF__SAVE').style='display:none';
   document.title = "Zimbra: " + ZmMsg.preferences +": 雙因素帳戶安全";   
   document.getElementById('tk_barrydegraaff_2fa_prefscreen').innerHTML = "<h2 class='prefHeader'>雙因素驗證設定</h2><img style='width:50px; height:auto; float:left' src='"+zimletInstance.getResource('2fa-logo.png')+"'>雙因素驗證可以讓您在登入時不僅是輸入帳號與密碼，還需要您智慧型手機上的 TOTP 碼，大幅加強您的帳戶安全性。<br>經過這樣的安全性層級提升，可以讓您的帳戶更難以被惡意人士竊取。<br><br><h2 class='prefHeader'>新增 Token</h2>請先在您的手機上安裝下列其中一個 App: <ul><li><a href='https://itunes.apple.com/us/app/authenticator/id766157276' target='_blank'>Authenticator for iPhone</a></li><li><a href='https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp' target='_blank'>FreeOTP Authenticator for Android</a></li></ul><br><button id='2faSetupBtn' onclick='TwoFaZimlet.prototype.getQR()'>點選此處進行設定</button><h2 class='prefHeader'>新增通行碼</h2>您可以在此為不支援雙因素驗證的 App 產生通行碼。<br>例如您手機上的郵件 App，或是筆記型電腦上的郵件客戶軟體 (Outlook/Thunderbird)。<br><br><button id='2faSetupBtn' onclick='TwoFaZimlet.prototype.getAppPasscode()'>建立 App 通行碼</button><div id='tk_barrydegraaff_2fa_prefscreen_qrcode'></div><h2 class='prefHeader'>現有 Token</h2><div id='tk_barrydegraaff_2fa_currentTokens'><img id='2facode' src=''>您可以點按下列項目來刪除已不需使用的 Token。<br><br></div>";

   var soapDoc = AjxSoapDoc.create("privacyIdea", "urn:privacyIdea", null);
   var params = {
      soapDoc: soapDoc,
      asyncMode: true,
      callback:TwoFaZimlet.prototype.displayTokens
   };
   soapDoc.getMethod().setAttribute("action", "PIList");
   appCtxt.getAppController().sendRequest(params);

   return;   
};

TwoFaZimlet.prototype.getAppPasscode = function()
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   zimletInstance._dialog = new ZmDialog( { title:"請輸入 Token 備註", parent:zimletInstance.getShell(), standardButtons:[DwtDialog.OK_BUTTON], disposeOnPopDown:true } );   
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:100px;">'+
   '請為您的新 Token 輸入備註。<br><br>若您想不到輸入什麼內容，您可以輸入您的手機型號名稱，或是輸入您方便識別這個 Token 的內容。 (例如 iPhone 7 或 Outlook)<br><br>'+   
   '<div class="DwtInputField"><input id="zimbratokendescr" placeholder="'+ZmMsg.description+'"></div>' +
   '</div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance.getAppPasscodewithDescr));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance.getAppPasscodewithDescr));
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   zimletInstance._dialog.popup(); 
   document.getElementById('zimbratokendescr').focus();    
};

TwoFaZimlet.prototype.getQR = function()
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   zimletInstance._dialog = new ZmDialog( { title:"請輸入 Token 備註", parent:zimletInstance.getShell(), standardButtons:[DwtDialog.OK_BUTTON], disposeOnPopDown:true } );   
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:450px;">'+
   '請為您的新 Token 輸入備註。<br><br>若您想不到輸入什麼內容，您可以輸入您的手機型號名稱，或是輸入您方便識別這個 Token 的內容。 (例如 iPhone 7 或 Outlook)<br><br>'+   
   '<div class="DwtInputField"><input id="zimbratokendescr" placeholder="'+ZmMsg.description+'"></div>' +
   '</div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance.getQRwithDescr));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance.getQRwithDescr));
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   zimletInstance._dialog.popup(); 
   document.getElementById('zimbratokendescr').focus();    
};

TwoFaZimlet.prototype.getQRwithDescr = function()
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   var soapDoc = AjxSoapDoc.create("privacyIdea", "urn:privacyIdea", null);
   var params = {
      soapDoc: soapDoc,
      asyncMode: true,
      callback:TwoFaZimlet.prototype.displayQR
   };
   soapDoc.getMethod().setAttribute("action", "PIInit");
   soapDoc.getMethod().setAttribute("zimbratokendescr", document.getElementById('zimbratokendescr').value);
   appCtxt.getAppController().sendRequest(params);      
};

TwoFaZimlet.prototype.getAppPasscodewithDescr = function()
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   var soapDoc = AjxSoapDoc.create("privacyIdea", "urn:privacyIdea", null);
   var params = {
      soapDoc: soapDoc,
      asyncMode: true,
      callback:TwoFaZimlet.prototype.displayAppPasscode
   };
   soapDoc.getMethod().setAttribute("action", "PIDeviceInit");
   soapDoc.getMethod().setAttribute("zimbratokendescr", document.getElementById('zimbratokendescr').value);
   appCtxt.getAppController().sendRequest(params);      
};

TwoFaZimlet.prototype.displayQR = function(args)
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   try {
      var imagedata = args._data.response._content;
      zimletInstance._dialog.setTitle('請在您的手機上掃描這組 QR code');
      zimletInstance._dialog.setContent('<img src="'+imagedata+'" onerror="TwoFaZimlet.prototype.displayError(\'An application error occurred\',\''+  window.btoa(args._data.response._content)+'\',\'An application error occurred\')">');
      zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance.showMeImpl));
      zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance.showMeImpl));
      
   }
   catch (exception)
   {
      TwoFaZimlet.prototype.displayError('A Zimlet error occurred',window.btoa(exception),'A Zimlet error occurred');
   }
};

TwoFaZimlet.prototype.displayAppPasscode = function(args)
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   try {
      var data = JSON.parse(args._data.response._content);
      zimletInstance._dialog.setTitle('請在下方輸入您要給 App 使用的的通行碼');
      zimletInstance._dialog.setContent('通行碼: <input value="'+data.detail.otpkey.value.replace('seed://','')+'">');
      zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance.showMeImpl));
      zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance.showMeImpl));
      
   }
   catch (exception)
   {
      TwoFaZimlet.prototype.displayError('A Zimlet error occurred',window.btoa(exception),'A Zimlet error occurred');
   }
};
TwoFaZimlet.prototype.displayError = function(msg, data, title)
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_2fa').handlerObject;
   zimletInstance.displayErrorMessage(msg, window.atob(data), title);
};

TwoFaZimlet.prototype.displayTokens = function(args)
{
   try {
      var data = JSON.parse(args._data.response._content);
      var tokens = data.result.value.tokens;
      for (var i = 0; i < tokens.length; i++) {
         document.getElementById('tk_barrydegraaff_2fa_currentTokens').innerHTML += '<button title=\'Failcount: '+tokens[i].failcount+'\r\nLast used: '+(tokens[i].info.last_auth ? tokens[i].info.last_auth : 'never') +'\' onclick=\'TwoFaZimlet.prototype.deleteTokens("'+tokens[i].serial+'")\' style=\'width:200px;\' >'+tokens[i].serial+'<br>'+tokens[i].description+'</button><br>';
      }
   }
   catch (exception)
   {
      
   }
};

TwoFaZimlet.prototype.deleteTokens = function(serial)
{
   var soapDoc = AjxSoapDoc.create("privacyIdea", "urn:privacyIdea", null);
   var params = {
      soapDoc: soapDoc,
      asyncMode: true,
      callback:TwoFaZimlet.prototype.showMeImpl
   };
   soapDoc.getMethod().setAttribute("action", "PIDelete");
   soapDoc.getMethod().setAttribute("serial", serial);
   appCtxt.getAppController().sendRequest(params);
};
  
