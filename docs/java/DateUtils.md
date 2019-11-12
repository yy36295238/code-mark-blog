---
sidebarDepth: 1
---

# DateUtils
::: tip
常用的日期工具
:::

```java
package com.example.yycode.demo.codemark.dateutils;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * @Author yangyu
 * @create 2019/11/12 13:30
 */
public class DateUtils {

    private final static String YYYY_MM_DD = "yyyy-MM-dd";
    private final static String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
    private final static String YYYY_MM_DD_HH_MM_SS_SSS = "yyyy-MM-dd HH:mm:ss.SSS";

    public static LocalDateTime fmtYYYYMMDD(String dateStr) {
        return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern(YYYY_MM_DD));
    }

    public static LocalDateTime fmtYYYYMMDDHHMMSS(String dateStr) {
        return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern(YYYY_MM_DD_HH_MM_SS));
    }

    public static LocalDateTime fmtYYYYMMDDHHMMSSSSS(String dateStr) {
        return LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern(YYYY_MM_DD_HH_MM_SS_SSS));
    }

    /**
     * N天前
     */
    public static LocalDateTime beforeNDay(int n) {
        return fmtYYYYMMDD(LocalDate.now().minusDays(n).toString());
    }

    /**
     * N小时前
     */
    public static LocalDateTime beforeNHour(int n) {
        return LocalDateTime.now().minusHours(n);
    }

    /**
     * N小时后
     */
    public static LocalDateTime afterNHour(int n) {
        return LocalDateTime.now().plusHours(n);
    }

    /**
     * LocalDateTime 转 Date
     */
    public static Date localDateToDate(LocalDateTime localDateTime) {
        ZonedDateTime zdt = localDateTime.atZone(ZoneId.systemDefault());
        return Date.from(zdt.toInstant());
    }

    /**
     * Date 转 LocalDateTime
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

    /**
     * 两个日期毫秒差
     */
    public static long diffMillis(String startStr, String endStr) {
        DateTimeFormatter df = DateTimeFormatter.ofPattern(YYYY_MM_DD_HH_MM_SS_SSS);
        LocalDateTime start = LocalDateTime.parse(startStr, df);
        LocalDateTime end = LocalDateTime.parse(endStr, df);
        return Duration.between(start, end).toMillis();
    }
}

```