#!/bin/bash

# CI/CD设置脚本 - 手动版本
# 在服务器上直接创建此文件并运行

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
    cd "$APP_DIR"
    git pull origin main || true
fi

# 设置权限
echo "设置文件权限..."
chown -R root:root "$APP_DIR"
chmod +x "$APP_DIR/deploy-server.sh" 2>/dev/null || true

# 创建部署日志文件
touch "$LOG_DIR/api-deploy.log"
chmod 666 "$LOG_DIR/api-deploy.log"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "警告: Node.js 未安装"
    echo "请先安装 Node.js 18+"
    echo "安装命令:"
    echo "  curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -"
    echo "  yum install -y nodejs"
else
    echo "✓ Node.js 已安装: $(node -v)"
fi

# 检查PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装PM2..."
    npm install -g pm2
    echo "✓ PM2 安装完成"
else
    echo "✓ PM2 已安装: $(pm2 -v)"
fi

# 检查Git
if ! command -v git &> /dev/null; then
    echo "警告: Git 未安装"
    echo "安装命令: yum install -y git"
else
    echo "✓ Git 已安装: $(git --version)"
fi

# 检查SSH服务
if systemctl is-active --quiet sshd 2>/dev/null || systemctl is-active --quiet ssh 2>/dev/null; then
    echo "✓ SSH服务运行中"
else
    echo "启动SSH服务..."
    systemctl start sshd 2>/dev/null || systemctl start ssh 2>/dev/null || true
    systemctl enable sshd 2>/dev/null || systemctl enable ssh 2>/dev/null || true
fi

# 检查.env文件
if [ ! -f "$APP_DIR/.env" ]; then
    echo "创建.env文件..."
    if [ -f "$APP_DIR/.env.example" ]; then
        cp "$APP_DIR/.env.example" "$APP_DIR/.env"
        echo "⚠ 请编辑 .env 文件配置 APP_KEY 和 APP_SECRET"
        echo "  文件位置: $APP_DIR/.env"
    fi
fi

echo ""
echo "=========================================="
echo "环境设置完成！"
echo "=========================================="
echo ""
echo "应用目录: $APP_DIR"
echo "日志文件: $LOG_DIR/api-deploy.log"
echo ""
echo "下一步："
echo "1. 配置.env文件: nano $APP_DIR/.env"
echo "2. 生成SSH密钥对（在本地计算机）"
echo "3. 将公钥添加到服务器的 ~/.ssh/authorized_keys"
echo "4. 在GitHub仓库中配置Secrets"
echo ""

