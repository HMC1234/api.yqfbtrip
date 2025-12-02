#!/bin/bash
# 服务器端执行命令
# 在服务器上运行此脚本

set -e

echo "=========================================="
echo "服务器环境设置"
echo "=========================================="

# 服务器信息
SERVER_IP="175.178.53.139"
APP_DIR="/var/www/api.yqfbtrip"

echo "服务器IP: $SERVER_IP"
echo "应用目录: $APP_DIR"
echo ""

# 1. 创建应用目录
echo "1. 创建应用目录..."
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# 2. 克隆或更新代码
if [ ! -d ".git" ]; then
    echo "2. 克隆代码..."
    git clone https://github.com/HMC1234/api.yqfbtrip.git .
else
    echo "2. 更新代码..."
    git pull origin main || true
fi

# 3. 检查Node.js
echo "3. 检查Node.js..."
if ! command -v node &> /dev/null; then
    echo "   警告: Node.js 未安装"
    echo "   请执行: curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - && yum install -y nodejs"
else
    echo "   ✓ Node.js: $(node -v)"
fi

# 4. 检查Git
echo "4. 检查Git..."
if ! command -v git &> /dev/null; then
    echo "   警告: Git 未安装"
    echo "   请执行: yum install -y git"
else
    echo "   ✓ Git: $(git --version)"
fi

# 5. 安装依赖
if [ -f "package.json" ]; then
    echo "5. 安装依赖..."
    npm install --production
    echo "   ✓ 依赖安装完成"
fi

# 6. 安装PM2
echo "6. 检查PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "   安装PM2..."
    npm install -g pm2
    echo "   ✓ PM2 安装完成"
else
    echo "   ✓ PM2: $(pm2 -v)"
fi

# 7. 创建日志目录
echo "7. 创建日志目录..."
mkdir -p /var/log
touch /var/log/api-deploy.log
chmod 666 /var/log/api-deploy.log

# 8. 配置环境变量
if [ ! -f ".env" ]; then
    echo "8. 创建.env文件..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "   ⚠ 请编辑 .env 文件配置 APP_KEY 和 APP_SECRET"
        echo "   执行: nano .env"
    fi
else
    echo "8. .env文件已存在"
fi

echo ""
echo "=========================================="
echo "服务器环境设置完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 配置.env文件: nano $APP_DIR/.env"
echo "2. 将SSH公钥添加到 ~/.ssh/authorized_keys"
echo "3. 在GitHub仓库中配置Secrets"
echo ""

