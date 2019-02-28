# 配置

## 环境检查
* where pkg 检查有没有安装 pkg 命令 运行 ```npm install -g pkg```
* where yarn 检查有没有安装 yarn 命令 ```npm install -g yarn```


## 编译
```
yarn install
yarn pkg 
```

## 配置 google 翻译
写入环境变量 vim ~/.bash_profile

```
GOOGLE_APPLICATION_CREDENTIALS="/Users/xiechao/Documents/GTDollar-Production-42f98c739ae0.json"
export GOOGLE_APPLICATION_CREDENTIALS
```

## 运行

```
cd dist 
./translate-macos -h
```

## 配置快捷方式
写入环境变量 vim ~/.bash_profile
```
alias "translategtins"="/Users/admin/Downloads/xctranslate-master/dist/translate-macos  -f /Users/admin/Documents/git/gtins-app/data/locales -t /Users/admin/Documents/git/gtins-app/src/configs/Keys.js"
```