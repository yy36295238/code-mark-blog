---
sidebarDepth: 1
---

# DateUtils
::: tip
常用的日期工具
:::

```java
package com.mint.kafkadata.utils;

import org.apache.commons.lang3.time.DateUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;

/**
 * @author yangyu
 */
public class KdDateUtils extends DateUtils {

    private final static String YYYY_MM_DD = "yyyy-MM-dd";
    private final static String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";

    public static Date fmtYYYYMMDD(String dateStr) throws ParseException {
        return DateUtils.parseDate(dateStr, YYYY_MM_DD);
    }

    public static Date fmtDate(String dateStr) throws ParseException {
        return DateUtils.parseDate(dateStr, YYYY_MM_DD_HH_MM_SS);
    }

    /**
     * N天前
     */
    public static String beforeNDayStr(int n) {
        return LocalDate.now().minusDays(n).toString();
    }

    /**
     * N天前
     */
    public static Date beforeNDay(int n) throws ParseException {
        return fmtYYYYMMDD(LocalDate.now().minusDays(n).toString());
    }

    /**
     * 昨天
     */
    public static Date yesterday() throws ParseException {
        return fmtYYYYMMDD(LocalDate.now().minusDays(1).toString());
    }

    /**
     * 今天
     */
    public static Date today() throws ParseException {
        return fmtYYYYMMDD(LocalDate.now().toString());
    }

    /**
     * 8小时之后
     */
    public static Date after8Hour() {
        return afterNHour(8);
    }

    /**
     * 指定时间，8小时之后
     */
    public static Date after8Hour(String time) {
        time = time.length() == 10 ? time + " 00:00:00" : time;
        final DateTimeFormatter df = DateTimeFormatter.ofPattern(YYYY_MM_DD_HH_MM_SS);
        try {
            return afterNHour(LocalDateTime.parse(time, df), 8);
        } catch (Exception e) {
            throw new RuntimeException("日期格式化错误...", e);
        }
    }

    /**
     * 当前时间，N小时之后
     */
    public static Date afterNHour(int n) {
        return afterNHour(null, n);
    }

    /**
     * 指定时间，N小时之后
     */
    public static Date afterNHour(LocalDateTime ldt, int n) {
        return localDateToDate((ldt == null ? LocalDateTime.now() : ldt).plusHours(n));
    }

    /**
     * localDateToDate
     */
    public static Date localDateToDate(LocalDateTime localDateTime) {
        ZonedDateTime zdt = localDateTime.atZone(ZoneId.systemDefault());
        return Date.from(zdt.toInstant());
    }

    /**
     * dateToLocalDateTime
     */
    public static LocalDateTime dateToLocalDateTime(Date date) {
        Instant instant = date.toInstant();
        ZoneId zoneId = ZoneId.systemDefault();
        return instant.atZone(zoneId).toLocalDateTime();
    }

    /**
     * 与当前时间比较分钟差
     */
    public static long diffMinute(Date date) {
        return ChronoUnit.MINUTES.between(dateToLocalDateTime(date), LocalDateTime.now());
    }
}

```