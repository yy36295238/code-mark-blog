---
sidebarDepth: 1
---

# Stream
::: tip
java8 中 `stream` 中的一些样例记录
:::


##### - 数据集合
```java
private List<User> list = Arrays.asList(
        new User("钢铁侠", 40, 0, "华盛顿"),
        new User("钢铁侠", 40, 0, "华盛顿"),
        new User("蜘蛛侠", 20, 0, "华盛顿"),
        new User("赵丽颖", 30, 1, "湖北武汉市"),
        new User("詹姆斯", 35, 0, "洛杉矶"),
        new User("李世民", 60, 0, "山西省太原市"),
        new User("蔡徐坤", 20, 1, "陕西西安市"),
        new User("葫芦娃的爷爷", 70, 0, "山西省太原市")
);

@Data
@NoArgsConstructor
@AllArgsConstructor
private class User {
    private String name;
    private Integer age;
    private Integer sex;
    private String address;
}
```

##### filter 过滤(T-> boolean)
```java
@Test
public void filterTest() {
    list.stream().filter(user -> user.getAge() >= 40).collect(toList()).forEach(System.out::println);
}
```

##### distinct 去重 和sql中的distinct关键字很相似
```java
@Test
public void distinctTest() {
    list.stream().filter(user -> user.getAge() >= 40).distinct().collect(toList()).forEach(System.out::println);
}
```

##### sorted排序，如果流中的元素的类实现了 Comparable 接口，即有自己的排序规则，那么可以直接调用 sorted() 方法对元素进行排序
```java
@Test
public void sortTest() {
    // 升序
    list.stream().sorted(Comparator.comparingInt(User::getAge)).collect(toList()).forEach(System.out::println);
    // 降序
    list.stream().sorted((u1, u2) -> u2.getAge() - u1.getAge()).collect(toList()).forEach(System.out::println);
}
```
##### limit()，返回前n个元素 如果流中的元素的类实现了 Comparable 接口，即有自己的排序规则，那么可以直接调用 sorted() 方法对元素进行排序
```java
@Test
public void limitTest() {
    list.stream().limit(1).collect(toList()).forEach(System.out::println);
}
```
##### skip()，与limit恰恰相反，skip的意思是跳过，也就是去除前n个元素
```java
@Test
public void skipTest() {
    list.stream().skip(1).collect(toList()).forEach(System.out::println);
}
```
##### map(T->R)，map是将T类型的数据转为R类型的数据，比如我们想要设置一个新的list，存储用户所有的城市信息。
```java
@Test
public void mapTest() {
    list.stream().map(User::getAddress).distinct().collect(toList()).forEach(System.out::println);
}
```
##### flatMap(T -> Stream)，将流中的每一个元素 T 映射为一个流，再把每一个流连接成为一个流。
```java
@Test
public void flatMapTest() {
    List<String> flatList = new ArrayList<>();
    flatList.add("唱,跳");
    flatList.add("rape,篮球,music");
    flatList.stream().map(s -> s.split(",")).flatMap(Arrays::stream).collect(toList()).forEach(System.out::println);
}
```
##### allMatch（T->boolean），检测是否全部满足参数行为，假如这些用户是网吧上网的用户名单，那就需要检查是不是每个人都年满18周岁了。
```java
@Test
public void allMatchTest() {
    boolean isAdult = list.stream().allMatch(user -> user.getAge() >= 18);
    System.out.println(isAdult);
}
```
##### anyMatch（T->boolean），检测是否有任意元素满足给定的条件，比如，想知道同学名单里是否有女生。
```java
@Test
public void anyMatchTest() {
    boolean isGirl = list.stream().anyMatch(user -> user.getSex() == 1);
    System.out.println(isGirl);
}
```
##### noneMatch(T -> boolean)，流中是否有元素匹配给定的 T -> boolean 条件，比如检测有没有来自巴黎的用户。
```java
@Test
public void noneMatchTest() {
    boolean isLSJ = list.stream().noneMatch(user -> user.getAddress().contains("巴黎"));
    System.out.println(isLSJ);
}

```
##### findFirst():找到第一个元素
```java
@Test
public void findFirstTest() {
    Optional<User> firstUser = list.stream().findFirst();
    System.out.println(firstUser);
}

```
##### findAny():找到任意一个元素，并行流 parallelStream() 中找到的确实是任意一个元素
```java
@Test
public void findAnyTest() {
    Optional<User> anyParallelUser = list.parallelStream().findAny();
    System.out.println(anyParallelUser);
}
```
##### 归纳计算
```java
@Test
public void maxMinTest() {
    // 求最大年龄
    Optional<User> max = list.stream().max(Comparator.comparing(User::getAge));
    System.out.println(max);

    // 求最小年龄
    Optional<User> min = list.stream().min(Comparator.comparing(User::getAge));
    System.out.println(min);

    // 求年龄总和
    int totalAge = list.stream().mapToInt(User::getAge).sum();
    System.out.println(totalAge);

    //求年龄平均值
    double avgAge = list.stream().collect(Collectors.averagingInt(User::getAge));
    System.out.println(avgAge);
}
```
##### 一次性得到元素的个数、总和、最大值、最小值
```java
@Test
public void statisticsTest() {
    IntSummaryStatistics statistics = list.stream().collect(Collectors.summarizingInt(User::getAge));
    System.out.println(statistics);
}
```
##### 字符串拼接
```java
@Test
public void joiningTest() {
    String names = list.stream().map(User::getName).collect(Collectors.joining(", ", "(", ")"));
    System.out.println(names);
}
```
##### 分组，可以根据用户所在城市进行分组
```java
@Test
public void groupTest() {
    Map<String, List<User>> cityMap = list.stream().collect(Collectors.groupingBy(User::getAddress));
    System.out.println(cityMap);
}
```
##### 分组，可以根据用户所在城市和性别进行分组
```java
@Test
    public void groupTest1() {
        Map<String, List<User>> cityMap = list.stream().collect(Collectors.groupingBy(u -> u.address + "_" + u.sex));
        System.out.println(cityMap);
    }
```
##### 分组，二级分组，先根据城市分组再根据性别分组
```java
@Test
public void groupFor2Test() {
    Map<String, Map<Integer, List<User>>> group = list.stream().collect(
            // 一级分组，按所在地区
            Collectors.groupingBy(User::getAddress,
                    // 二级分组，按性别
                    Collectors.groupingBy(User::getSex)));
    System.out.println(group);
}
```
##### 按城市分组并统计人数
```java
@Test
public void countForAddressTest() {
    Map<String, Long> cityCountMap = list.stream().collect(Collectors.groupingBy(User::getAddress, Collectors.counting()));
    System.out.println(cityCountMap);
}
```
##### partitioningBy 分区，分区与分组的区别在于，分区是按照 true 和 false 来分的，因此partitioningBy 接受的参数的 lambda 也是 T -> boolean
```java
@Test
public void partTest() {
    //根据年龄是否小于等于30来分区
    Map<Boolean, List<User>> part = list.stream().collect(partitioningBy(user -> user.getAge() <= 30));
    System.out.println(part);
}
```
