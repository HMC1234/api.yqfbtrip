#!/bin/bash

# 服务器端自动部署脚本
# 用于接收GitHub Actions的部署请求

set -e

# 配置变量
APP_DIR="${DEPLOY_PATH:-/var/www/api.yqfbtrip}"
BRANCH="${DEPLOY_BRANCH:-main}"
LOG_FILE="/var/log/api-deploy.log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "开始自动部署"
log "=========================================="

# 检查目录是否存在
if [ ! -d "$APP_DIR" ]; then
    log "错误: 应用目录不存在: $APP_DIR"
    log "正在创建目录..."
    mkdir -p "$APP_DIR"
    cd "$APP_DIR"
    git clone https://github.com/HMC1234/api.yqfbtrip.git .
fi

cd "$APP_DIR"

# 备份.env文件
if [ -f ".env" ]; then
    log "备份.env文件..."
    cp .env .env.backup.$(date +%Y%m%d-%H%M%S)
fi

# 拉取最新代码
log "拉取最新代码..."
git fetch origin
git reset --hard origin/$BRANCH
git clean -fd

# 恢复.env文件
if [ -f ".env.backup"* ]; then
    LATEST_BACKUP=$(ls -t .env.backup.* | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        log "恢复.env文件..."
        cp "$LATEST_BACKUP" .env
    fi
fi

# 安装依赖
log "安装依赖..."
npm install --production

# 重启服务
log "重启服务..."
if pm2 list | grep -q "api.yqfbtrip"; then
    pm2 restart api.yqfbtrip
else
    pm2 start ecosystem.config.js --env production
    pm2 save
fi

log "=========================================="
log "部署完成！"
log "=========================================="

# 显示服务状态
pm2 status api.yqfbtrip

