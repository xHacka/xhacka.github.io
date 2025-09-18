# AndroidDropper

# AndroidDropper

### Description

This app does nothing!

dropper.apk sha256sum: `aaf49dcee761d13da52a95f86b7b92596e7b63c14d0a04bce5dd24c7927ecea9`

Author: `gchip`

Link: [http://misc.csaw.io:3003/](http://misc.csaw.io:3003/)\
Downloads: [dropper.apk](https://ctf.csaw.io/files/f89978a8a3bbdbf6be8d85c2a0fd00b7/dropper.apk?token=eyJ1c2VyX2lkIjoyODEzLCJ0ZWFtX2lkIjoxMTI0LCJmaWxlX2lkIjozM30.ZQcqkA.EG01whRn8oi1YkODWa68A893tQg)

### Analysis

Since it's troublesome to run the app let's try reversing it. Using [dex2jar](https://github.com/pxb1988/dex2jar) convert Apk -> JAR. Using [Java-Decompiler](https://github.com/java-decompiler/jd-gui) open JAR to read the code.

```bash
└─$ dex2jar dropper.apk -o dropper.apk.jar
dex2jar dropper.apk -> dropper.apk.jar
```

```java
package com.example.dropper;

import android.app.AlertDialog;
import android.content.Context;
import android.os.Bundle;
import android.os.StrictMode;
import android.util.Base64;
import d.l;
import dalvik.system.DexClassLoader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Method;

public class MainActivity extends l {
  public final void onCreate(Bundle paramBundle) {
    super.onCreate(paramBundle);
    setContentView(2131427356);
    try {
      byte[] arrayOfByte = Base64.decode("ZGV4CjAzNQAWORryq3+hLJ+yXt9y3L5lCBAqyp3c8Q6UBwAAcAAAAHhWNBIAAAAAAAAAANAGAAAoAAAAcAAAABMAAAAQAQAACwAAAFwBAAABAAAA4AEAABAAAADoAQAAAQAAAGgCAAAMBQAAiAIAAPYDAAD4AwAAAAQAAA4EAAARBAAAFAQAABoEAAAeBAAAPQQAAFkEAABzBAAAigQAAKEEAAC+BAAA0AQAAOcEAAD7BAAADwUAAC0FAAA9BQAAVwUAAHMFAACHBQAAigUAAI4FAACSBQAAlgUAAJ8FAACnBQAAswUAAL8FAADIBQAA2AUAAPIFAAD+BQAAAwYAABMGAAAkBgAALgYAADUGAAADAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABgAAAAZAAAABAAAAAUAAAAAAAAABAAAAAoAAAAAAAAABQAAAAoAAADMAwAABAAAAA0AAAAAAAAABAAAAA4AAAAAAAAAFgAAABAAAAAAAAAAFwAAABAAAADYAwAAFwAAABAAAADgAwAAFwAAABAAAADoAwAAFwAAABAAAADwAwAABgAAABEAAADoAwAAAQARACEAAAABAAUAAQAAAAEAAQAeAAAAAQACACIAAAADAAcAAQAAAAMAAQAlAAAABgAGAAEAAAAIAAUAJAAAAAkABQABAAAACgAJAAEAAAALAAUAGgAAAAsABQAcAAAACwAAAB8AAAAMAAgAAQAAAAwAAwAjAAAADgAKABsAAAAPAAQAHQAAAAEAAAABAAAACQAAAAAAAAACAAAAuAYAAJYGAAAAAAAABAAAAAMAAgCoAwAASwAAAAAAIgAMABoBIABwIAwAEABuEA0AAAAMAB8ACwBuEAkAAAAiAQMAIgIGAG4QCwAAAAwDcCAFADIAcCADACEAbhAEAAEADAFuEAoAAAAoDA0BKB8NAW4QBgABAG4QCgAAABoBAABxAA8AAAAMAG4gDgAQAAwAaQAAABMAEwETATIBEwIqAHEwAgAQAgwAEQBuEAoAAAAnAQAADgAAABUAAQAqAAAAAwAFAAJ/CCknACcABwADAAIAAAC/AwAAGQAAALFFI1ASABIBNVEPAGICAACQAwQBSAICA7dijiJQAgAB2AEBASjyIgQKAHAgCAAEABEEAAABAAEAAQAAAKQDAAAEAAAAcBAHAAAADgAKAA4AEQAOHnhqPOFOPBwpHj08LqamAnkdPAAnAwAAAA48PKM+AAAAAwAAAAAAAAAAAAAAAQAAAAUAAAABAAAABwAAAAEAAAAKAAAAAQAAABIAAAAGPGluaXQ+AAxEcm9wcGVkLmphdmEAAUkAAUwABExJSUkAAkxMAB1MY29tL2V4YW1wbGUvZHJvcHBlZC9Ecm9wcGVkOwAaTGRhbHZpay9hbm5vdGF0aW9uL1Rocm93czsAGExqYXZhL2lvL0J1ZmZlcmVkUmVhZGVyOwAVTGphdmEvaW8vSU9FeGNlcHRpb247ABVMamF2YS9pby9JbnB1dFN0cmVhbTsAG0xqYXZhL2lvL0lucHV0U3RyZWFtUmVhZGVyOwAQTGphdmEvaW8vUmVhZGVyOwAVTGphdmEvbGFuZy9FeGNlcHRpb247ABJMamF2YS9sYW5nL09iamVjdDsAEkxqYXZhL2xhbmcvU3RyaW5nOwAcTGphdmEvbmV0L0h0dHBVUkxDb25uZWN0aW9uOwAOTGphdmEvbmV0L1VSTDsAGExqYXZhL25ldC9VUkxDb25uZWN0aW9uOwAaTGphdmEvdXRpbC9CYXNlNjQkRGVjb2RlcjsAEkxqYXZhL3V0aWwvQmFzZTY0OwABVgACVkwAAltCAAJbQwAHY29ubmVjdAAGZGVjb2RlAApkaXNjb25uZWN0AApnZXREZWNvZGVyAAdnZXRGbGFnAA5nZXRJbnB1dFN0cmVhbQAYaHR0cDovL21pc2MuY3Nhdy5pbzozMDAzAApub3RUaGVGbGFnAANvYmYADm9wZW5Db25uZWN0aW9uAA9wcmludFN0YWNrVHJhY2UACHJlYWRMaW5lAAV2YWx1ZQBXfn5EOHsiY29tcGlsYXRpb24tbW9kZSI6ImRlYnVnIiwiaGFzLWNoZWNrc3VtcyI6ZmFsc2UsIm1pbi1hcGkiOjEsInZlcnNpb24iOiIyLjEuNy1yMSJ9AAICASYcARgEAQADAAAIAIGABIwHAQmIBQEJyAYAAAAAAAABAAAAjgYAAKwGAAAAAAAAAQAAAAAAAAABAAAAsAYAABAAAAAAAAAAAQAAAAAAAAABAAAAKAAAAHAAAAACAAAAEwAAABABAAADAAAACwAAAFwBAAAEAAAAAQAAAOABAAAFAAAAEAAAAOgBAAAGAAAAAQAAAGgCAAABIAAAAwAAAIgCAAADIAAAAwAAAKQDAAABEAAABQAAAMwDAAACIAAAKAAAAPYDAAAEIAAAAQAAAI4GAAAAIAAAAQAAAJYGAAADEAAAAgAAAKwGAAAGIAAAAQAAALgGAAAAEAAAAQAAANAGAAA=", 0);
      FileOutputStream fileOutputStream = openFileOutput("dropped.dex", 0);
      fileOutputStream.write(arrayOfByte);
      fileOutputStream.flush();
      fileOutputStream.close();
    } catch (IOException iOException) {
      iOException.printStackTrace();
    } 
    StrictMode.setThreadPolicy((new StrictMode.ThreadPolicy.Builder()).permitAll().build());
    File file = new File(getFilesDir(), "dropped.dex");
    String str1 = file.getAbsolutePath();
    String str2 = getCacheDir().getAbsolutePath();
    ClassLoader classLoader = getClassLoader();
    NoSuchMethodException noSuchMethodException2 = null;
    DexClassLoader dexClassLoader = new DexClassLoader(str1, str2, null, classLoader);
    try {
      Class<?> clazz = dexClassLoader.loadClass("com.example.dropped.Dropped");
    } catch (ClassNotFoundException classNotFoundException) {
      classNotFoundException.printStackTrace();
      str2 = null;
    } 
    try {
      dexClassLoader = str2.newInstance();
    } catch (IllegalAccessException|InstantiationException illegalAccessException) {
      illegalAccessException.printStackTrace();
      illegalAccessException = null;
    } 
    try {
      Method method = str2.getMethod("getFlag", null);
    } catch (NoSuchMethodException noSuchMethodException1) {
      noSuchMethodException1.printStackTrace();
      noSuchMethodException1 = noSuchMethodException2;
    } 
    try {
      noSuchMethodException1.invoke(illegalAccessException, new Object[0]);
    } catch (IllegalAccessException|java.lang.reflect.InvocationTargetException illegalAccessException1) {
      illegalAccessException1.printStackTrace();
    } 
    file.delete();
    AlertDialog.Builder builder = new AlertDialog.Builder((Context)this);
    builder.setMessage("test");
    builder.show();
    finish();
    System.exit(0);
  }
}
```

From the looks of it program creates a `dex` file, calls `getFlag` and exits. The previous tool allows us to decompile `dex` files too.

```bash
└─$ echo -n '{BASE64BLOB}' | base64 -d > dropped.dex 

└─$ file dropped.dex 
dropped.dex: Dalvik dex file version 035

└─$ dex2jar dropped.dex -o dropped.dex.jar
dex2jar dropped.dex -> dropped.dex.jar                                    
```

dropped.dex.jar:

```java
package com.example.dropped;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

public class Dropped {
  static byte[] notTheFlag;
  
  public static String getFlag() throws IOException {
    Exception exception;
    HttpURLConnection httpURLConnection = (HttpURLConnection)(new URL("http://misc.csaw.io:3003")).openConnection();
    try {
      httpURLConnection.connect();
      BufferedReader bufferedReader = new BufferedReader();
      InputStreamReader inputStreamReader = new InputStreamReader();
      this(httpURLConnection.getInputStream());
      this(inputStreamReader);
      String str = bufferedReader.readLine();
      httpURLConnection.disconnect();
    } catch (Exception exception1) {
      exception1.printStackTrace();
      httpURLConnection.disconnect();
      String str = "";
    } finally {}
    notTheFlag = Base64.getDecoder().decode((String)exception);
    return obf(275, 306, 42);
  }
  
  public static String obf(int paramInt1, int paramInt2, int paramInt3) {
    int i = paramInt2 - paramInt1;
    char[] arrayOfChar = new char[i];
    for (paramInt2 = 0; paramInt2 < i; paramInt2++)
      arrayOfChar[paramInt2] = (char)(char)(notTheFlag[paramInt1 + paramInt2] ^ paramInt3); 
    return new String(arrayOfChar);
  }
}
```

Prettify:

```java
public static String obf(int paramInt1, int index, int key) {
  int length = index - paramInt1; // Calculate Length
  char[] flag = new char[i]; // Allocate Buffer
  for (index = 0; index < length; index++) { // Loop
    flag[index] = (char)(char)(notTheFlag[paramInt1 + index] ^ key); // Do XOR On Each Character With `key` 
  }
  return new String(flag); // Array -> String
}
```

### Solution

Take the base64 blob from website, paste it in CyberChef, `From Base64`, `XOR -> 42 (Decimal)`

[Recipe](https://gchq.github.io/CyberChef/#recipe=From_Base64\('A-Za-z0-9%2B/%3D',true,false\)XOR\(%7B'option':'Decimal','string':'42'%7D,'Standard',false\)\&input=YkVWWUNrTkVXVjVMUkVsUEJncEZSQXBlUWs4S1drWkxSRTllQ205TFdGNUNCZ3BIUzBRS1FrdE9Da3RHWFV0VFdRcExXVmxmUjA5T0NsNUNTMTRLUWs4S1hVdFpDa2RGV0U4S1EwUmVUMFpHUTAxUFJGNEtYa0pMUkFwT1JVWmFRa05FV1FwSVQwbExYMWxQQ2tKUENrSkxUZ3BMU1VKRFQxeFBUZ3BaUlFwSFgwbENDZ2NLWGtKUENsMUNUMDlHQmdwa1QxMEtjMFZZUVFZS1hVdFlXUXBMUkU0S1dVVUtSVVFLQndwZFFrTkdXVjRLUzBaR0NsNUNUd3BPUlVaYVFrTkVXUXBDUzA0S1QxeFBXQXBPUlVSUENsMUxXUXBIWDBsQkNrdElSVjllQ2tORUNsNUNUd3BkUzE1UFdBcENTMXhEUkUwS1N3cE5SVVZPQ2w1RFIwOEVDbWhmWGdwSlJVUmNUMWhaVDBaVEJncEpXVXRkU1Y1TVVVNVRSQjVIRzBsMVJrVWVUazk0V1hWWWRVeGZaQXRYSUY1Q1R3cE9SVVphUWtORVdRcENTMDRLUzBaZFMxTlpDa2hQUmtOUFhFOU9DbDVDUzE0S1hrSlBVd3BkVDFoUENreExXQXBIUlZoUENrTkVYazlHUmtOTlQwUmVDbDVDUzBRS1IwdEVDZ2NLVEVWWUNscFlUMGxEV1U5R1V3cGVRazhLV1V0SFR3cFlUMHRaUlVSWkJBPT0)

_For instance, on the planet Earth, man had always assumed that he was more intelligent than dolphins because he had achieved so much - the wheel, New York, wars and so on - whilst all the dolphins had ever done was muck about in the water having a good time. But conversely, csawctf{dyn4m1c\_lo4deRs\_r\_fuN!}_\
_the dolphins had always believed that they were far more intelligent than man - for precisely the same reasons._

::: tip Flag
`csawctf{dyn4m1c\_lo4deRs\_r\_fuN!}`
:::

### Note

If you want to get deep into Android Application Reverse Engineering try [Mobile Security Framework MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF)

[DEF CON Safe Mode Demo Labs - Ajin Abraham - Mobile App Security Testing with MobSF](https://youtu.be/1NIQs82n3nw)
