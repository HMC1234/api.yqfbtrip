# 服务器手动设置指南

如果GitHub下载失败，可以手动设置服务器环境。

## 方法一：手动创建脚本文件

### 步骤1: 创建脚本文件

SSH连接到服务器后，执行：

```bash
# 创建脚本文件
cat > /tmp/setup-cicd.sh << 'EOF'
#!/bin/bash

set -e

echo "=========================================="
echo "设置GitHub自动部署环境"
echo "=========================================="

# 创建应用目录
APP_DIR="/var/www/api.yqfbtrip"
echo "创建应用目录: $APP_DIR"
mkdir -p "$APP_DIR"

# 创建日志目录
LOG_DIR="/var/log"
mkdir -p "$LOG_DIR"

# 如果目录为空，克隆代码
if [ ! -d "$APP_DIR/.git" ]; then
    echo "克隆代码..."
    cd "$APP_DIR"
    git clone https://github.com/HMC1234/api.yqfbtrip.git .
else
    echo "代码已存在，更新代码..."
    cd "$APP_DIR"
    git pull origin main || true
fi

# 设置权限
chown -R root:root "$APP_DIR"
chmod +x "$APP_DIR/deploy-server.sh" 2>/dev/null || true

# 创建部署日志文件
touch "$LOG_DIR/api-deploy.log"
chmod 666 "$LOG_DIR/api-deploy.log"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "警告: Node.js 未安装"
    echo "请先安装 Node.js 18+"
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

echo ""
echo "=========================================="
echo "环境设置完成！"
echo "=========================================="
echo ""
echo "应用目录: $APP_DIR"
echo ""
EOF

# 添加执行权限
chmod +x /tmp/setup-cicd.sh

# 运行脚本
/tmp/setup-cicd.sh
```

## 方法二：直接执行命令（最简单）

直接在服务器上执行以下命令：

```bash
# 1. 创建应用目录
mkdir -p /var/www/api.yqfbtrip
cd /var/www/api.yqfbtrip

# 2. 克隆代码（如果还没有）
if [ ! -d ".git" ]; then
    git clone https://github.com/HMC1234/api.yqfbtrip.git .
else
    git pull origin main
fi

# 3. 安装依赖
npm install --production

# 4. 安装PM2（如果还没有）
npm install -g pm2

# 5. 创建日志目录
mkdir -p /var/log
touch /var/log/api-deploy.log
chmod 666 /var/log/api-deploy.log

# 6. 配置环境变量
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "请编辑 .env 文件: nano .env"
fi
```

## 方法三：使用GitHub Gitee镜像（如果GitHub访问慢）

如果GitHub访问慢，可以：

1. 先手动克隆代码到本地
2. 打包上传到服务器

```bash
# 在本地Windows PowerShell中
cd C:\Users\morto\Desktop\YQF_AIR_API
tar -czf api.yqfbtrip.tar.gz --exclude=node_modules --exclude=.git .

# 上传到服务器（使用scp或FTP工具）
# scp api.yqfbtrip.tar.gz root@175.178.53.139:/tmp/

# 在服务器上解压
# cd /var/www
# tar -xzf /tmp/api.yqfbtrip.tar.gz
# mv YQF_AIR_API api.yqfbtrip
```

## 验证设置

执行以下命令验证：

```bash
# 检查目录
ls -la /var/www/api.yqfbtrip

# 检查文件
ls -la /var/www/api.yqfbtrip/package.json

# 检查Node.js
node -v

# 检查PM2
pm2 -v

# 检查Git
git --version
```

## 如果GitHub访问有问题

### 使用代理或镜像

```bash
# 设置Git代理（如果有）
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy https://proxy.example.com:8080

# 或者使用GitHub镜像
# 修改 .github/workflows/deploy.yml 中的仓库地址
```

### 直接使用git clone

```bash
cd /var/www
git clone https://github.com/HMC1234/api.yqfbtrip.git api.yqfbtrip
cd api.yqfbtrip
```

## 常见问题

### 问题1: curl下载失败

**原因**: GitHub raw内容可能无法访问

**解决**: 使用方法二（直接执行命令）或方法三（手动上传）

### 问题2: git clone失败

**原因**: 网络问题或Git未安装

**解决**:
```bash
# 安装Git
yum install -y git  # CentOS
apt install -y git  # Ubuntu

# 重试克隆
cd /var/www
git clone https://github.com/HMC1234/api.yqfbtrip.git api.yqfbtrip
```

### 问题3: npm install失败

**原因**: Node.js未安装或版本太低

**解决**:
```bash
# 安装Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# 验证
node -v  # 应该显示 v18.x.x
npm -v
```

## 推荐操作流程

1. **先验证网络连接**:
   ```bash
   ping github.com
   curl -I https://github.com
   ```

2. **如果GitHub无法访问，使用方法二（直接执行命令）**

3. **如果GitHub可以访问，但下载慢，直接使用git clone**:
   ```bash
   cd /var/www
   git clone https://github.com/HMC1234/api.yqfbtrip.git api.yqfbtrip
   cd api.yqfbtrip
   npm install --production
   ```

