#!/bin/bash

# 快速更新脚本
# 用于更新已部署的服务

set -e

APP_DIR="/var/www/api.yqfbtrip"

if [ ! -d "$APP_DIR" ]; then
    echo "错误: 应用目录不存在: $APP_DIR"
    echo "请先运行 deploy.sh 进行初始部署"
    exit 1
fi

echo "更新代码..."
cd $APP_DIR

# 备份.env文件
if [ -f ".env" ]; then
    cp .env .env.backup
fi

# 拉取最新代码
git pull origin main

# 安装依赖
npm install --production

# 恢复.env文件
if [ -f ".env.backup" ]; then
    mv .env.backup .env
fi

# 重启服务
pm2 restart api.yqfbtrip

echo "更新完成！"
pm2 status

