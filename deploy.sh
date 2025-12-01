#!/bin/bash

# 一起飞API部署脚本
# 用于腾讯云CVM服务器部署

set -e

echo "=========================================="
echo "开始部署一起飞API服务"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js 未安装${NC}"
    echo "请先安装 Node.js (推荐版本 18+)"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js 版本: ${NODE_VERSION}${NC}"

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo -e "${RED}错误: Git 未安装${NC}"
    exit 1
fi

# 配置变量
REPO_URL="https://github.com/HMC1234/api.yqfbtrip.git"
APP_DIR="/var/www/api.yqfbtrip"
BACKUP_DIR="/var/www/backups"
BRANCH="main"
PORT=${PORT:-3001}

echo -e "${YELLOW}配置信息:${NC}"
echo "  仓库: ${REPO_URL}"
echo "  目录: ${APP_DIR}"
echo "  分支: ${BRANCH}"
echo "  端口: ${PORT}"

# 创建应用目录
echo -e "\n${YELLOW}创建应用目录...${NC}"
sudo mkdir -p ${APP_DIR}
sudo mkdir -p ${BACKUP_DIR}
sudo chown -R $USER:$USER ${APP_DIR}

# 备份现有部署（如果存在）
if [ -d "${APP_DIR}/.git" ]; then
    echo -e "\n${YELLOW}备份现有部署...${NC}"
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    sudo cp -r ${APP_DIR} ${BACKUP_DIR}/${BACKUP_NAME}
    echo -e "${GREEN}✓ 备份完成: ${BACKUP_DIR}/${BACKUP_NAME}${NC}"
fi

# 克隆或更新代码
echo -e "\n${YELLOW}更新代码...${NC}"
if [ -d "${APP_DIR}/.git" ]; then
    cd ${APP_DIR}
    git fetch origin
    git reset --hard origin/${BRANCH}
    git clean -fd
    echo -e "${GREEN}✓ 代码更新完成${NC}"
else
    git clone -b ${BRANCH} ${REPO_URL} ${APP_DIR}
    echo -e "${GREEN}✓ 代码克隆完成${NC}"
fi

cd ${APP_DIR}

# 安装依赖
echo -e "\n${YELLOW}安装依赖...${NC}"
npm install --production
echo -e "${GREEN}✓ 依赖安装完成${NC}"

# 检查.env文件
if [ ! -f "${APP_DIR}/.env" ]; then
    echo -e "\n${YELLOW}创建.env文件...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠ 警告: 请编辑 .env 文件并配置 APP_KEY 和 APP_SECRET${NC}"
    echo "  文件位置: ${APP_DIR}/.env"
fi

# 检查PM2是否安装
if ! command -v pm2 &> /dev/null; then
    echo -e "\n${YELLOW}安装PM2...${NC}"
    sudo npm install -g pm2
    echo -e "${GREEN}✓ PM2 安装完成${NC}"
fi

# 停止现有服务
echo -e "\n${YELLOW}停止现有服务...${NC}"
pm2 stop api.yqfbtrip 2>/dev/null || true
pm2 delete api.yqfbtrip 2>/dev/null || true

# 启动服务
echo -e "\n${YELLOW}启动服务...${NC}"
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo -e "\n${GREEN}=========================================="
echo "部署完成！"
echo "==========================================${NC}"
echo ""
echo "服务信息:"
echo "  应用目录: ${APP_DIR}"
echo "  端口: ${PORT}"
echo ""
echo "常用命令:"
echo "  查看状态: pm2 status"
echo "  查看日志: pm2 logs api.yqfbtrip"
echo "  重启服务: pm2 restart api.yqfbtrip"
echo "  停止服务: pm2 stop api.yqfbtrip"
echo ""
echo "访问地址:"
echo "  http://$(curl -s ifconfig.me):${PORT}"
echo ""

