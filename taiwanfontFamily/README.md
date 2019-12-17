Zimbra 編輯器台灣常用可選字體修改

請分別將 client 與 admin 下的 `AjxMsg_zh_TW.properties` 檔案丟至下列路徑覆蓋：
/opt/zimbra/jetty_base/webapps/zimbra/WEB-INF/classes/messages/AjxMsg_zh_TW.properties
/opt/zimbra/jetty_base/webapps/zimbraAdmin/WEB-INF/classes/messages/AjxMsg_zh_TW.properties
  
  
完成後，請重新啟動服務，客戶端瀏覽器亦需重新整理以生效。
```bash
su zimbra
zmcontrol restart
```
