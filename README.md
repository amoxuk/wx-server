# wx-server
wxapp node server
wx-server 是一个使用`nodejs`作为小程序后台的服务应用，项目中使用了mysql，对服务器数据进行增删改查。
## start
下载项目 
```bat
git clone git@github.com:amoxuk/wx-server.git
```
## 执行安装
`npm install`
## 配置
1. 在config下新建config.js
2. 新建数据库
```sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for memoirs
-- ----------------------------
DROP TABLE IF EXISTS `memoirs`;
CREATE TABLE `memoirs`  (
  `id` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `title` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `username` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `content` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `creat_time` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 303 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

```
3. 编辑内容：
    ```javascript
    var mysql = {
        host: 'mysql的ip',
        user: '用户名',
        password: '密码',
        database: '数据库',
        charset: "连接的字符集",
    }
    module.exports = mysql;
    ```
    
## 启动运行
```bat
set DEBUG=* & npm start
```
## 查看运行
访问 `http://127.0.0.1:9000/api` 查看查询结果

## 部署
修改bin/www文件中port为80或者443
```shell
forever list
forever stop 10000
forever start bin/www
```
