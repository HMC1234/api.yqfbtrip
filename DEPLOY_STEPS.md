# 自动部署执行步骤

## ✅ 已完成

1. ✓ SSH密钥对已生成
   - 公钥文件: `github_deploy_key.pub`
   - 私钥文件: `github_deploy_key`

## 📋 需要您执行的操作

### 步骤1: 将SSH公钥添加到服务器

**方法A: 使用ssh-copy-id（推荐）**

在本地PowerShell中执行：

```powershell
ssh-copy-id -i github_deploy_key.pub root@175.178.53.139
```

**方法B: 手动添加**

1. 查看公钥内容：
   ```powershell
   Get-Content github_deploy_key.pub
   ```

2. SSH连接到服务器：
   ```bash
   ssh root@175.178.53.139
   ```

3. 在服务器上执行：
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   echo "粘贴公钥内容" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   exit
   ```

### 步骤2: 在服务器上运行设置命令

SSH连接到服务器后，执行：

```bash
# 创建应用目录并克隆代码
mkdir -p /var/www/api.yqfbtrip
cd /var/www/api.yqfbtrip
git clone https://github.com/HMC1234/api.yqfbtrip.git .

# 安装依赖
npm install --production

# 安装PM2
npm install -g pm2

# 配置环境变量
cp .env.example .env
nano .env  # 编辑配置
```

### 步骤3: 配置GitHub Secrets

访问：https://github.com/HMC1234/api.yqfbtrip/settings/secrets/actions

添加以下Secrets：

1. **SERVER_HOST**: `175.178.53.139`
2. **SERVER_USER**: `root`
3. **SERVER_SSH_KEY**: 复制 `github_deploy_key` 文件的全部内容

### 步骤4: 测试自动部署

在GitHub仓库的Actions页面，点击"Run workflow"测试部署。

## 📝 当前状态

- [x] SSH密钥对已生成
- [ ] SSH公钥已添加到服务器
- [ ] 服务器环境已设置
- [ ] GitHub Secrets已配置
- [ ] 自动部署已测试

