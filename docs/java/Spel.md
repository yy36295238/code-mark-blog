---
sidebarDepth: 1
---

# Spel
::: tip
常用的Map工具
:::

```java
package com.yyself.warpper.annotition;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * 方法执行时间
 */
@Target(METHOD)
@Retention(RUNTIME)
@Documented
public @interface CostTime {
    String[] spel() default {};
}

```

```java
package com.yyself.warpper;

import com.yyself.warpper.annotition.CostTime;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

/**
 * @author yangyu
 */
@Aspect
@Component
@Slf4j
public class CostTimeAop {

    public static long MIN_TIME = 100;
    public static long MID_TIME = 5000;
    public static long MAX_TIME = 10000;


    @Pointcut("@annotation(com.yyself.warpper.annotition.CostTime)")
    public void costTimePointcut() {
    }

    @Around("costTimePointcut()")
    public Object costTime(ProceedingJoinPoint pdj) throws Throwable {

        LocalVariableTableParameterNameDiscoverer discoverer = new LocalVariableTableParameterNameDiscoverer();

        final long start = System.currentTimeMillis();
        final Object proceed = pdj.proceed();

        // 获取方法参数值
        Object[] arguments = pdj.getArgs();
        // 获取方法
        Method method = ((MethodSignature) pdj.getSignature()).getMethod();
        String methodName = method.getName();
        String className = pdj.getTarget().getClass().getName();

        if (arguments == null || arguments.length <= 0) {
            printCostTime(start, System.currentTimeMillis(), className, methodName, null);
            return proceed;
        }

        final CostTime costTimeAnno = method.getAnnotation(CostTime.class);

        String[] spels = costTimeAnno.spel();
        if (spels.length <= 0) {
            printCostTime(start, System.currentTimeMillis(), className, methodName, null);
            return proceed;
        }

        List<Object> paramList = new ArrayList<>();
        EvaluationContext context = new StandardEvaluationContext();
        String[] params = discoverer.getParameterNames(method);
        for (int len = 0; len < params.length; len++) {
            final String key = params[len];
            final Object val = arguments[len];
            context.setVariable(key, val);
        }


        for (String spel : spels) {
            // 解析spel表达式
            paramList.add(parseSpel(spel, context));
        }
        printCostTime(start, System.currentTimeMillis(), className, methodName, paramList);
        return proceed;

    }

    private void printCostTime(long start, long end, String className, String methodName, List<Object> paramList) {
        boolean showLog = true;
        String costName = "方法耗时";
        long costTime = end - start;
        if (costTime > MAX_TIME) {
            costName += "严重";
        } else if (costTime > MID_TIME) {
            costName += "中度";
        } else if (costTime > MIN_TIME) {
            costName += "一般";
        } else {
            costName += "正常";
            showLog = false;
        }
        if (showLog) {
            log.info("{} [{}]：class={},method={},param={}", costName, costTime, className, methodName, paramList);
        }
    }

    private Object parseSpel(String spel, EvaluationContext context) {

        ExpressionParser parser = new SpelExpressionParser();
        try {
            Expression expression = parser.parseExpression(spel);
            return expression.getValue(context);
        } catch (Exception e) {
            log.warn("表达式解析错误");
            return null;
        }
    }


}

```