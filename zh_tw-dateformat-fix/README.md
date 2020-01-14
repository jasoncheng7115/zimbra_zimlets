# Zimbra 日期格式重複修正

### 使用說明  
    
主要修正郵件日期格式中的"月"重複寫示問題，請把 `I18nMsg_zh_TW.properties ` 檔案丟至下列路徑覆蓋：
```
/opt/zimbra/jetty_base/webapps/zimbra/WEB-INF/classes/messages/I18nMsg_zh_TW.properties 
```
  
  
完成後，請重新啟動服務，客戶端瀏覽器亦需重新整理以生效。
```bash
su zimbra
zmcontrol restart
```
  
---
  
### 對照擷圖

![image](https://raw.githubusercontent.com/jasoncheng7115/zimbra_zimlets/master/zh_tw-dateformat-fix/%E5%89%8D%E5%BE%8C%E5%B0%8D%E6%AF%94.png)
