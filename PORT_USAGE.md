# 端口使用说明

## 当前配置

由于3000端口已被占用，服务器已配置为使用其他端口。

## 启动方式

### 方式1：使用默认端口（3001）
```bash
npm start
```
访问：http://localhost:3001

### 方式2：指定端口（通过环境变量）
```bash
# Windows PowerShell
$env:PORT=3002; npm start

# Windows CMD
set PORT=3002 && npm start

# Linux/Mac
PORT=3002 npm start
```

### 方式3：使用预定义脚本
```bash
npm run start:3001  # 使用3001端口
npm run start:3002  # 使用3002端口
npm run start:8080  # 使用8080端口
```

### 方式4：命令行参数
```bash
node server.js 3002
```

## 检查端口占用

### Windows
```bash
# 查看3000端口占用
netstat -ano | findstr :3000

# 结束占用进程（替换PID为实际进程ID）
taskkill /F /PID <PID>
```

### Linux/Mac
```bash
# 查看端口占用
lsof -i :3000

# 结束占用进程
kill -9 <PID>
```

## 推荐端口

- **3001** - 默认备用端口
- **3002** - 另一个常用端口
- **8080** - Web服务常用端口
- **5000** - 开发常用端口

## 注意事项

1. 如果修改了端口，记得更新前端页面中的API地址
2. 确保防火墙允许所选端口的访问
3. 生产环境建议使用环境变量配置端口

