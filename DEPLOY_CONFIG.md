# 自动部署配置 - 服务器IP: 175.178.53.139

## 📋 服务器信息

- **服务器IP**: 175.178.53.139
- **SSH端口**: 22 (默认)
- **SSH用户**: root (默认)
- **部署路径**: /var/www/api.yqfbtrip

## 🚀 快速设置步骤

### 步骤1: 在服务器上准备环境

SSH连接到服务器：

```bash
ssh root@175.178.53.139
```

在服务器上执行：

```bash
# 下载并运行设置脚本
curl -O https://raw.githubusercontent.com/HMC1234/api.yqfbtrip/main/setup-cicd.sh
chmod +x setup-cicd.sh
./setup-cicd.sh
```

### 步骤2: 生成SSH密钥对（在本地计算机）

在您的本地Windows计算机上，打开PowerShell或CMD，执行：

```bash
# 生成SSH密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f github_deploy_key

# 按提示操作（可以直接按Enter使用默认值，或设置密码）
```

这会生成两个文件：
- `github_deploy_key` (私钥，用于GitHub Secrets)
- `github_deploy_key.pub` (公钥，用于服务器)

### 步骤3: 将公钥添加到服务器

**方法A: 使用ssh-copy-id（如果已安装）**

```bash
ssh-copy-id -i github_deploy_key.pub root@175.178.53.139
```

**方法B: 手动添加（推荐）**

```bash
# 1. 查看公钥内容
cat github_deploy_key.pub

# 2. 复制输出的内容（类似：ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ...）

# 3. SSH连接到服务器
ssh root@175.178.53.139

# 4. 在服务器上执行以下命令：
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "粘贴刚才复制的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

### 步骤4: 测试SSH连接

在本地计算机执行：

```bash
# 测试SSH连接（应该能够无密码登录）
ssh -i github_deploy_key root@175.178.53.139

# 如果成功连接，执行 exit 退出
```

### 步骤5: 配置GitHub Secrets

1. **访问GitHub仓库**: https://github.com/HMC1234/api.yqfbtrip
2. **点击 Settings** → **Secrets and variables** → **Actions**
3. **点击 New repository secret**，依次添加以下Secrets：

#### Secret 1: SERVER_HOST
- **Name**: `SERVER_HOST`
- **Value**: `175.178.53.139`

#### Secret 2: SERVER_USER
- **Name**: `SERVER_USER`
- **Value**: `root`

#### Secret 3: SERVER_SSH_KEY
- **Name**: `SERVER_SSH_KEY`
- **Value**: 打开 `github_deploy_key` 文件，复制**整个文件内容**（包括 -----BEGIN RSA PRIVATE KEY----- 和 -----END RSA PRIVATE KEY-----）

获取私钥内容（在本地PowerShell中）：

```powershell
Get-Content github_deploy_key
```

复制整个输出，粘贴到GitHub Secrets的 `SERVER_SSH_KEY` 中。

#### Secret 4: SERVER_PORT (可选)
- **Name**: `SERVER_PORT`
- **Value**: `22`

#### Secret 5: DEPLOY_PATH (可选)
- **Name**: `DEPLOY_PATH`
- **Value**: `/var/www/api.yqfbtrip`

### 步骤6: 配置服务器环境变量

SSH连接到服务器：

```bash
ssh root@175.178.53.139
```

执行：

```bash
cd /var/www/api.yqfbtrip
cp .env.example .env
nano .env
```

编辑 `.env` 文件，填入您的配置：

```env
APP_KEY=your_app_key_here
APP_SECRET=your_app_secret_here
API_BASE_URL=https://bizapi.yiqifei.cn/servings
API_VERSION=2.0
REQUEST_TIMEOUT=30000
ENABLE_REQUEST_LOG=true
PORT=3001
```

保存：按 `Ctrl+X`，然后 `Y`，最后 `Enter`

### 步骤7: 测试自动部署

#### 方法A: 手动触发

1. 访问GitHub仓库：https://github.com/HMC1234/api.yqfbtrip
2. 点击 **Actions** 标签页
3. 点击 **Deploy to Tencent Cloud CVM** workflow
4. 点击 **Run workflow** → **Run workflow**

#### 方法B: 推送代码触发

```bash
# 在本地项目目录中
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### 步骤8: 验证部署

#### 查看GitHub Actions日志

1. 访问GitHub仓库的 **Actions** 标签页
2. 点击最新的workflow运行
3. 查看部署日志，应该看到 "Deploy to server" 步骤成功

#### 在服务器上验证

```bash
# SSH连接到服务器
ssh root@175.178.53.139

# 检查服务状态
pm2 status

# 查看部署日志
tail -f /var/log/api-deploy.log

# 测试服务
curl http://localhost:3001/health

# 应该返回: {"status":"ok","timestamp":"..."}
```

#### 测试外部访问

在浏览器中访问：
```
http://175.178.53.139:3001
```

应该能看到前端测试页面。

## 🔒 安全配置

### 配置防火墙（如果未配置）

```bash
# CentOS
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload

# Ubuntu
ufw allow 3001/tcp
ufw enable
```

### 配置腾讯云安全组

1. 登录腾讯云控制台
2. 进入 **CVM** → 选择您的实例
3. 点击 **安全组** → **修改规则**
4. 添加入站规则：
   - **类型**: 自定义
   - **协议端口**: TCP:3001
   - **来源**: 0.0.0.0/0
   - **策略**: 允许

## 🐛 故障排查

### SSH连接失败

```bash
# 测试连接
ssh -i github_deploy_key -v root@175.178.53.139

# 检查服务器SSH配置
ssh root@175.178.53.139
cat /etc/ssh/sshd_config | grep -E "PubkeyAuthentication|AuthorizedKeysFile"
```

### 部署失败

查看日志：

```bash
# GitHub Actions日志
# 在GitHub仓库的Actions页面查看

# 服务器日志
ssh root@175.178.53.139
tail -f /var/log/api-deploy.log
```

### 服务无法访问

```bash
# 检查服务状态
ssh root@175.178.53.139
pm2 status

# 检查端口监听
netstat -tulpn | grep 3001

# 检查防火墙
firewall-cmd --list-ports  # CentOS
ufw status                 # Ubuntu
```

## ✅ 完成检查清单

- [ ] 服务器环境已准备（运行setup-cicd.sh）
- [ ] SSH密钥对已生成
- [ ] 公钥已添加到服务器
- [ ] SSH连接测试成功
- [ ] GitHub Secrets已配置
- [ ] 服务器.env文件已配置
- [ ] 腾讯云安全组已开放3001端口
- [ ] 自动部署测试成功
- [ ] 服务可以正常访问

## 📞 下一步

部署成功后：

1. ✅ 配置域名（可选）
2. ✅ 配置SSL证书（可选）
3. ✅ 设置监控和告警（可选）
4. ✅ 定期备份.env文件

