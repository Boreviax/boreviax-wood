# Boreviax 板材网站部署说明

## 一、上传到 GitHub

1. 解压 `boreviax-panels-vercel.zip`。
2. 在 GitHub 右上角点击 `+`，选择 `New repository`。
3. Repository name 填写 `boreviax-wood`，建议选择 `Private`。
4. 不要勾选添加 README、.gitignore 或 License，然后点击 `Create repository`。
5. 点击 `uploading an existing file`，或点击 `Add file` → `Upload files`。
6. 打开解压后的文件夹，选择文件夹里面的全部内容并拖入上传页面。不要只上传 ZIP 文件。
7. 确认仓库首页直接显示 `app`、`public`、`package.json` 和 `vercel.json`，不能在外面再套一层文件夹。
8. Commit message 填写 `Initial Boreviax wood website`，点击 `Commit changes`。

## 二、在 Vercel 部署

1. 登录 Vercel，点击 `Add New` → `Project`。
2. 找到 `boreviax-wood`，点击 `Import`。
3. Framework Preset 应自动显示 `Next.js`。
4. Root Directory 保持 `./`，不要填写子文件夹。
5. 不需要添加 Environment Variables，也不要修改 Build and Output Settings。
6. 点击 `Deploy`，等待状态变成 Ready。
7. 先打开 Vercel 提供的临时网址，检查首页、产品页、图片和 WhatsApp 按钮。

## 三、连接 wood.boreviax.com

1. 进入 Vercel 项目 → `Settings` → `Domains`。
2. 添加 `wood.boreviax.com`。
3. 复制 Vercel 页面显示的 CNAME 目标值。
4. 在当前域名 DNS 管理页面中，找到主机名为 `wood` 的现有 CNAME。
5. 把它的目标从 `custom-domains.chatgpt.site` 改成 Vercel 提供的值。不要同时保留两个 `wood` 记录。
6. 保存后返回 Vercel，等待域名和 SSL 状态变为有效。
7. 最后访问 `https://wood.boreviax.com` 验证。

注意：只有在 Vercel 临时网址测试正常后，才修改 DNS。Vercel 对中国大陆访问仍不作可用性保证。
