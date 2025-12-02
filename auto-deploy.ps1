# 自动部署脚本 - PowerShell版本
# 用于自动配置GitHub Actions部署

Write-Host "=========================================="
Write-Host "GitHub自动部署配置助手"
Write-Host "=========================================="
Write-Host ""

# 检查SSH密钥
if (-not (Test-Path "github_deploy_key")) {
    Write-Host "生成SSH密钥对..."
    ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f github_deploy_key -N '""' -q
    Write-Host "✓ SSH密钥对生成成功"
} else {
    Write-Host "✓ SSH密钥对已存在"
}

# 显示公钥
Write-Host ""
Write-Host "=========================================="
Write-Host "SSH公钥内容（需要添加到服务器）"
Write-Host "=========================================="
$publicKey = Get-Content github_deploy_key.pub
Write-Host $publicKey
Write-Host ""

# 显示私钥（用于GitHub Secrets）
Write-Host "=========================================="
Write-Host "SSH私钥内容（用于GitHub Secrets）"
Write-Host "=========================================="
Write-Host "请复制以下内容到GitHub Secrets的 SERVER_SSH_KEY:"
Write-Host ""
$privateKey = Get-Content github_deploy_key
Write-Host $privateKey
Write-Host ""

# 生成GitHub Secrets配置说明
$secretsConfig = @"
==========================================
GitHub Secrets 配置
==========================================

请在GitHub仓库中配置以下Secrets:
https://github.com/HMC1234/api.yqfbtrip/settings/secrets/actions

1. SERVER_HOST
   值: 175.178.53.139

2. SERVER_USER
   值: root

3. SERVER_SSH_KEY
   值: (上面的私钥内容，整个复制)

4. SERVER_PORT (可选)
   值: 22

5. DEPLOY_PATH (可选)
   值: /var/www/api.yqfbtrip

"@

Write-Host $secretsConfig

# 保存配置到文件
$secretsConfig | Out-File -FilePath "github-secrets-config.txt" -Encoding UTF8
Write-Host "配置说明已保存到: github-secrets-config.txt"
Write-Host ""

