#!/bin/bash

# CI/CD设置脚本
# 在服务器上运行此脚本来准备自动部署环境

set -e

echo "=========================================="
echo "设置GitHub自动部署环境"
echo "=========================================="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用root用户运行此脚本"
    exit 1
fi

# 创建应用目录
APP_DIR="/var/www/api.yqfbtrip"
echo "创建应用目录: $APP_DIR"
mkdir -p "$APP_DIR"

# 创建日志目录
LOG_DIR="/var/log"
echo "创建日志目录: $LOG_DIR"
mkdir -p "$LOG_DIR"

# 如果目录为空，克隆代码
if [ ! -d "$APP_DIR/.git" ]; then
    echo "克隆代码..."
    cd "$APP_DIR"
    git clone https://github.com/HMC1234/api.yqfbtrip.git .
else
    echo "代码已存在，跳过克隆"
fi

# 设置权限
echo "设置文件权限..."
chown -R root:root "$APP_DIR"
chmod +x "$APP_DIR/deploy-server.sh"

# 创建部署日志文件
touch "$LOG_DIR/api-deploy.log"
chmod 666 "$LOG_DIR/api-deploy.log"

# 检查PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装PM2..."
    npm install -g pm2
fi

# 检查SSH服务
if ! systemctl is-active --quiet sshd; then
    echo "启动SSH服务..."
    systemctl start sshd
    systemctl enable sshd
fi

echo ""
echo "=========================================="
echo "环境设置完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 生成SSH密钥对（如果还没有）"
echo "2. 将公钥添加到服务器的authorized_keys"
echo "3. 在GitHub仓库中配置Secrets"
echo ""
echo "运行以下命令生成SSH密钥（在本地或GitHub Actions中）："
echo "  ssh-keygen -t rsa -b 4096 -C 'github-actions' -f github_deploy_key"
echo ""

