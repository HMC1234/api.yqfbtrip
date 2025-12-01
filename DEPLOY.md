# 腾讯云CVM部署指南

本指南将帮助您将一起飞API服务部署到腾讯云CVM服务器。

## 📋 前置要求

1. **腾讯云CVM实例**
   - 推荐配置：2核4GB内存
   - 操作系统：Ubuntu 20.04 LTS 或 CentOS 7+
   - 已配置安全组（开放3001端口）

2. **服务器访问**
   - SSH密钥或密码
   - root权限或sudo权限

## 🚀 快速部署

### 方法一：使用部署脚本（推荐）

#### 1. 连接到服务器

```bash
ssh root@your-server-ip
```

#### 2. 安装必要工具

```bash
# Ubuntu/Debian
apt update
apt install -y git curl

# CentOS/RHEL
yum update -y
yum install -y git curl
```

#### 3. 安装Node.js

```bash
# 使用NodeSource安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用nvm安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### 4. 下载部署脚本

```bash
# 创建临时目录
mkdir -p /tmp/deploy
cd /tmp/deploy

# 下载部署脚本
curl -O https://raw.githubusercontent.com/HMC1234/api.yqfbtrip/main/deploy.sh
chmod +x deploy.sh
```

#### 5. 执行部署

```bash
./deploy.sh
```

#### 6. 配置环境变量

```bash
cd /var/www/api.yqfbtrip
nano .env
```

编辑以下内容：
```env
APP_KEY=your_app_key_here
APP_SECRET=your_app_secret_here
API_BASE_URL=https://bizapi.yiqifei.cn/servings
API_VERSION=2.0
REQUEST_TIMEOUT=30000
ENABLE_REQUEST_LOG=true
PORT=3001
```

#### 7. 重启服务

```bash
pm2 restart api.yqfbtrip
```

### 方法二：手动部署

#### 1. 克隆代码

```bash
cd /var/www
git clone https://github.com/HMC1234/api.yqfbtrip.git
cd api.yqfbtrip
```

#### 2. 安装依赖

```bash
npm install --production
```

#### 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

#### 4. 安装PM2

```bash
npm install -g pm2
```

#### 5. 启动服务

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 🔧 配置说明

### 端口配置

默认端口为3001，如需修改：

1. 修改 `ecosystem.config.js` 中的 PORT
2. 修改 `.env` 文件中的 PORT
3. 重启服务：`pm2 restart api.yqfbtrip`

### 安全组配置

在腾讯云控制台配置安全组规则：

1. 登录腾讯云控制台
2. 进入 CVM 实例 -> 安全组
3. 添加入站规则：
   - 类型：自定义
   - 协议端口：TCP:3001
   - 来源：0.0.0.0/0（或指定IP）
   - 策略：允许

### Nginx反向代理（可选）

如果需要使用80端口或HTTPS，可以配置Nginx：

```bash
# 安装Nginx
apt install -y nginx

# 创建配置文件
nano /etc/nginx/sites-available/api.yqfbtrip
```

配置文件内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：
```bash
ln -s /etc/nginx/sites-available/api.yqfbtrip /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 📊 服务管理

### PM2常用命令

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs api.yqfbtrip

# 查看详细信息
pm2 info api.yqfbtrip

# 重启服务
pm2 restart api.yqfbtrip

# 停止服务
pm2 stop api.yqfbtrip

# 删除服务
pm2 delete api.yqfbtrip

# 查看监控
pm2 monit
```

### 查看日志

```bash
# 实时日志
pm2 logs api.yqfbtrip

# 错误日志
tail -f /var/www/api.yqfbtrip/logs/error.log

# 输出日志
tail -f /var/www/api.yqfbtrip/logs/out.log
```

## 🔄 更新部署

### 自动更新

```bash
cd /var/www/api.yqfbtrip
git pull origin main
npm install --production
pm2 restart api.yqfbtrip
```

### 使用部署脚本更新

```bash
./deploy.sh
```

## 🔒 安全建议

1. **防火墙配置**
   ```bash
   # Ubuntu
   ufw allow 3001/tcp
   ufw enable
   
   # CentOS
   firewall-cmd --permanent --add-port=3001/tcp
   firewall-cmd --reload
   ```

2. **使用非root用户**
   ```bash
   # 创建专用用户
   useradd -m -s /bin/bash apiuser
   usermod -aG sudo apiuser
   ```

3. **定期更新**
   ```bash
   apt update && apt upgrade -y
   ```

4. **备份配置**
   ```bash
   # 定期备份.env文件
   cp .env .env.backup.$(date +%Y%m%d)
   ```

## 🐛 故障排查

### 服务无法启动

1. 检查Node.js版本
   ```bash
   node -v  # 应该是 v18+
   ```

2. 检查端口占用
   ```bash
   netstat -tulpn | grep 3001
   ```

3. 检查日志
   ```bash
   pm2 logs api.yqfbtrip --err
   ```

### 无法访问服务

1. 检查防火墙
   ```bash
   ufw status
   ```

2. 检查安全组规则

3. 检查服务状态
   ```bash
   pm2 status
   ```

### 内存不足

1. 增加swap空间
   ```bash
   fallocate -l 2G /swapfile
   chmod 600 /swapfile
   mkswap /swapfile
   swapon /swapfile
   ```

2. 限制PM2内存
   修改 `ecosystem.config.js` 中的 `max_memory_restart`

## 📞 支持

如遇问题，请查看：
- [README.md](./README.md) - 使用说明
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - 开发指南
- GitHub Issues: https://github.com/HMC1234/api.yqfbtrip/issues

