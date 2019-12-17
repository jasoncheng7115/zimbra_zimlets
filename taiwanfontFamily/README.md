# Zimbra 編輯器台灣常用可選字體修改

### 使用說明  
    
請分別將 client(下列第一行) 與 admin(下列第二行) 下的 `AjxMsg_zh_TW.properties` 檔案丟至下列路徑覆蓋：
```
/opt/zimbra/jetty_base/webapps/zimbra/WEB-INF/classes/messages/AjxMsg_zh_TW.properties
/opt/zimbra/jetty_base/webapps/zimbraAdmin/WEB-INF/classes/messages/AjxMsg_zh_TW.properties
```
  
  
完成後，請重新啟動服務，客戶端瀏覽器亦需重新整理以生效。
```bash
su zimbra
zmcontrol restart
```
  
---
  
### 對照擷圖

![image](https://raw.githubusercontent.com/jasoncheng7115/zimbra_zimlets/master/taiwanfontFamily/%E5%85%A9%E5%9C%96%E5%B0%8D%E7%85%A7.png)
