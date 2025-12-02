# GitHub自动部署到腾讯云CVM完整指南

## 📋 前置准备

### 需要的信息

请准备以下信息：

1. **服务器信息**
   - 服务器IP地址
   - SSH端口（默认22）
   - SSH用户名（通常是root）

2. **部署路径**
   - 应用部署目录（默认：/var/www/api.yqfbtrip）

## 🚀 设置步骤

### 步骤1: 在服务器上准备环境

SSH连接到您的服务器，执行：

```bash
# 1. 下载并运行设置脚本
curl -O https://raw.githubusercontent.com/HMC1234/api.yqfbtrip/main/setup-cicd.sh
chmod +x setup-cicd.sh
sudo ./setup-cicd.sh

# 2. 或者手动准备
mkdir -p /var/www/api.yqfbtrip
cd /var/www/api.yqfbtrip
git clone https://github.com/HMC1234/api.yqfbtrip.git .
```

### 步骤2: 生成SSH密钥对

**在本地计算机或GitHub Actions环境中生成：**

```bash
# 生成SSH密钥对（专门用于部署）
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f github_deploy_key

# 这会生成两个文件：
# - github_deploy_key (私钥，用于GitHub Secrets)
# - github_deploy_key.pub (公钥，用于服务器)
```

### 步骤3: 将公钥添加到服务器

**方法A: 使用ssh-copy-id（推荐）**

```bash
# 在本地执行
ssh-copy-id -i github_deploy_key.pub root@your-server-ip
```

**方法B: 手动添加**

```bash
# 1. 查看公钥内容
cat github_deploy_key.pub

# 2. SSH连接到服务器
ssh root@your-server-ip

# 3. 在服务器上执行
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "粘贴公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 步骤4: 测试SSH连接

```bash
# 使用私钥测试连接
ssh -i github_deploy_key root@your-server-ip

# 如果能够无密码登录，说明配置成功
```

### 步骤5: 配置GitHub Secrets

1. 访问您的GitHub仓库：https://github.com/HMC1234/api.yqfbtrip
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**，添加以下Secrets：

#### 必需的Secrets：

| Secret名称 | 值 | 说明 |
|-----------|-----|------|
| `SERVER_HOST` | `your-server-ip` | 服务器IP地址 |
| `SERVER_USER` | `root` | SSH用户名 |
| `SERVER_SSH_KEY` | `github_deploy_key`文件内容 | SSH私钥（整个文件内容） |
| `SERVER_PORT` | `22` | SSH端口（可选，默认22） |
| `DEPLOY_PATH` | `/var/www/api.yqfbtrip` | 部署路径（可选，默认此路径） |

#### 如何获取SSH私钥内容：

```bash
# 在本地执行
cat github_deploy_key

# 复制整个输出（包括 -----BEGIN RSA PRIVATE KEY----- 和 -----END RSA PRIVATE KEY-----）
# 粘贴到GitHub Secrets的SERVER_SSH_KEY中
```

### 步骤6: 触发部署

部署会在以下情况自动触发：

1. **推送到main分支** - 每次push到main分支时自动部署
2. **手动触发** - 在GitHub Actions页面点击"Run workflow"

## 🔍 验证部署

### 查看部署日志

1. 访问GitHub仓库的 **Actions** 标签页
2. 点击最新的workflow运行
3. 查看部署日志

### 在服务器上验证

```bash
# SSH连接到服务器
ssh root@your-server-ip

# 检查服务状态
pm2 status

# 查看部署日志
tail -f /var/log/api-deploy.log

# 测试服务
curl http://localhost:3001/health
```

## 🛠️ 故障排查

### 问题1: SSH连接失败

**检查：**
```bash
# 测试SSH连接
ssh -i github_deploy_key -v root@your-server-ip

# 检查服务器SSH配置
cat /etc/ssh/sshd_config | grep -E "PubkeyAuthentication|AuthorizedKeysFile"
```

**解决：**
- 确保服务器SSH服务运行：`systemctl status sshd`
- 确保公钥在 `~/.ssh/authorized_keys` 中
- 检查文件权限：`chmod 600 ~/.ssh/authorized_keys`

### 问题2: 部署失败

**查看日志：**
```bash
# GitHub Actions日志
# 在GitHub仓库的Actions页面查看

# 服务器日志
tail -f /var/log/api-deploy.log
```

**常见原因：**
- 代码拉取失败：检查网络连接
- npm安装失败：检查Node.js版本
- PM2未安装：运行 `npm install -g pm2`

### 问题3: 权限问题

```bash
# 确保部署脚本有执行权限
chmod +x /var/www/api.yqfbtrip/deploy-server.sh

# 确保目录权限正确
chown -R root:root /var/www/api.yqfbtrip
```

## 🔒 安全建议

1. **使用专用SSH密钥**
   - 不要使用个人SSH密钥
   - 为部署创建专门的密钥对

2. **限制SSH访问**
   - 使用防火墙限制SSH端口访问
   - 考虑使用SSH密钥认证而非密码

3. **保护Secrets**
   - 不要在代码中硬编码敏感信息
   - 定期轮换SSH密钥

4. **监控部署**
   - 定期检查部署日志
   - 设置部署通知

## 📝 手动部署（备用方案）

如果自动部署失败，可以手动部署：

```bash
# SSH连接到服务器
ssh root@your-server-ip

# 进入应用目录
cd /var/www/api.yqfbtrip

# 拉取最新代码
git pull origin main

# 安装依赖
npm install --production

# 重启服务
pm2 restart api.yqfbtrip
```

## 🎯 下一步

部署成功后：

1. ✅ 配置环境变量（`.env`文件）
2. ✅ 配置防火墙和安全组
3. ✅ 设置域名和SSL证书（可选）
4. ✅ 配置监控和告警（可选）

