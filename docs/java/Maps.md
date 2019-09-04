---
sidebarDepth: 1
---

# Maps
::: tip
常用的Map工具
:::

```java
package com.mintech.risk.core.utils;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

/**
 * @author YangYu
 */
@Slf4j
public class Maps {
    public static String getString(Map<String, Object> map, String key) {
        final Object val = map.get(key);
        if (val == null) {
            return null;
        }
        return val.toString();
    }

    public static Boolean getBoolean(Map<String, Object> map, String key) {
        final Object val = map.get(key);
        if (val == null) {
            return null;
        }
        return Boolean.parseBoolean(val.toString());
    }

    public static Boolean getBooleanOrdefault(Map<String, Object> map, String key, boolean defaultVal) {
        final Object val = map.get(key);
        if (val == null) {
            return defaultVal;
        }
        return Boolean.parseBoolean(val.toString());
    }

    public static Long getLong(Map<String, Object> map, String key) {
        final Object val = map.get(key);
        if (val == null) {
            return null;
        }
        return Long.parseLong(val.toString());
    }

    public static Map<String, Object> newHashMap(String key, Object val) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, val);
        return map;
    }

    public static NewMap buildHashMap(String key, Object val) {
        final NewMap newMap = new NewMap();
        return newMap.put(key, val);
    }

    public static NewMap buildHashMap() {
        return new NewMap();
    }

    public static class NewMap {
        private Map<String, Object> map = new HashMap<>();

        public NewMap put(String key, Object val) {
            map.put(key, val);
            return this;
        }

        public Map<String, Object> build() {
            return map;
        }
    }

}
```