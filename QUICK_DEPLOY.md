# 快速部署指南

## 在腾讯云CVM上快速部署

### 步骤1: 克隆代码

```bash
# 创建应用目录
mkdir -p /var/www
cd /var/www

# 克隆代码
git clone https://github.com/HMC1234/api.yqfbtrip.git
cd api.yqfbtrip
```

### 步骤2: 安装依赖

```bash
# 确保在项目目录中
pwd  # 应该显示 /var/www/api.yqfbtrip

# 安装依赖
npm install --production
```

### 步骤3: 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

填入您的配置：
```env
APP_KEY=your_app_key_here
APP_SECRET=your_app_secret_here
API_BASE_URL=https://bizapi.yiqifei.cn/servings
API_VERSION=2.0
REQUEST_TIMEOUT=30000
ENABLE_REQUEST_LOG=true
PORT=3001
```

### 步骤4: 安装PM2（如果未安装）

```bash
npm install -g pm2
```

### 步骤5: 启动服务

```bash
# 确保在项目目录中
cd /var/www/api.yqfbtrip

# 启动服务
pm2 start ecosystem.config.js --env production

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

### 步骤6: 验证部署

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs api.yqfbtrip

# 测试访问（替换为您的服务器IP）
curl http://localhost:3001/health
```

## 完整命令序列（复制粘贴）

```bash
# 1. 克隆代码
mkdir -p /var/www && cd /var/www
git clone https://github.com/HMC1234/api.yqfbtrip.git
cd api.yqfbtrip

# 2. 安装依赖
npm install --production

# 3. 配置环境变量
cp .env.example .env
echo "请编辑 .env 文件配置 APP_KEY 和 APP_SECRET"
nano .env

# 4. 安装PM2
npm install -g pm2

# 5. 启动服务
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 6. 查看状态
pm2 status
```

## 常见问题

### 问题1: 找不到 package.json
**原因**: 不在项目目录中
**解决**: 
```bash
cd /var/www/api.yqfbtrip
pwd  # 确认路径
ls -la package.json  # 确认文件存在
```

### 问题2: Git未安装
**解决**:
```bash
# CentOS
yum install -y git

# Ubuntu
apt install -y git
```

### 问题3: Node.js未安装
**解决**:
```bash
# 使用NodeSource安装
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# 验证
node -v
npm -v
```

