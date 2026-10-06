# Boreviax 板材网站部署说明

## 已有 GitHub Desktop 仓库的更新步骤

本次新增 HPL、PET、PVC 三个独立产品系列、103 款花色，以及英文、马来语、阿拉伯语内容。首页视频及现有产品页面已保留。

1. 下载并解压最新的 `boreviax-panels-vercel.zip`。
2. 在 GitHub Desktop 中选中板材网站仓库，点击 `Repository` → `Show in Explorer`（Mac 为 `Show in Finder`）。
3. 打开解压后的 `boreviax-panels-vercel` 文件夹，把里面的内容复制到上一步打开的仓库文件夹，选择替换同名文件。目标仓库里应直接看到 `app`、`public`、`package.json`，不要再套一层文件夹。
4. 返回 GitHub Desktop，Summary 填 `Add decorative surface collections`，点击 `Commit to main`。
5. 点击 `Push origin`。等待现有 Vercel 项目自动部署完成，状态显示 Ready。
6. 检查首页新增的 Decorative Surfaces 区块、产品总览分类、三个新产品页及语言切换。检查花色筛选、放大预览、样册下载和询价按钮。

无需新建仓库、重新绑定域名或修改 DNS。此次没有替你直接更新线上网站；完成 Push 后才会发布到 Vercel。

新页面路径：`/products/hpl`、`/products/pet-film`、`/products/pvc-film`。对应马来语、阿拉伯语页面分别带 `/ms`、`/ar` 前缀。

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
