# 國立臺灣大學無人載具研發設計中心

繁體中文與英文靜態網站，採 React、TypeScript、Vite、Tailwind CSS、Radix UI 與 Lucide。包含中心介紹、組織人員、設備平台、人才培育、產學合作及八篇交流紀錄，共34個內容頁與兩個404頁。

## 開發與驗證

使用 Node.js 24，在專案目錄執行：

```sh
npm ci
npm run check
npm test
npm run build
npm run preview
```

預覽網址為 http://localhost:4173/ 。Windows PowerShell 若阻擋 npm.ps1，請改用 npm.cmd。瀏覽器測試先執行 `npx playwright install chromium`，再執行 `npm run test:browser`；測試會自行啟動預覽伺服器。

## GitHub Pages

發布儲存庫： https://github.com/NTU-iEV-M-Lab/UVRDC_web

在儲存庫 Settings → Pages → Build and deployment，將 Source 設為 GitHub Actions。主分支 main 的推送會執行 Publish GitHub Pages；也可於 Actions 手動執行。工作流程讀取實際 Pages 網址，自動設定子路徑，通過型別、內容、單元測試、建置及瀏覽器檢查後，僅部署 dist。首次發布結果以 Actions 與 Pages 顯示的網址為準。

正式模式會提供可索引的靜態正文、各頁canonical、語言關聯與sitemap.xml；預覽及404維持noindex。上線後可在Google Search Console驗證正式網站並提交網站地圖，Google自行決定收錄與排名。若首次推送時尚未設定Pages Source，先完成上述設定，再重新執行發布工作流程。

Search Console採HTML檔案驗證，指定檔案位於public/google2d29a02616a73239.html，發布後可由網站根目錄直接讀取。content/site-verification.json列出允許的驗證檔，建置會核對內容並拒絕未選定HTML。請持續保留此檔以維持驗證有效。

## 內容維護

繁中公開內容在 content/catalog.ts，素材清單在 content/media.json。英文中心與活動翻譯在 content/en，介面字串在 content/en/messages.json。相關連結在 content/related-links.ts。新增活動時提供唯一slug、日期、角色、來源識別、完整正文及英文翻譯，並通過建置檢查。

本儲存庫只收錄選定的公開內容與素材。原始簡報、名冊、私人聯繫資料、來源檔案位置及內部編輯紀錄不收錄；來源識別與完整編輯依據由維護者另行保存。

公開聯絡信箱： kangli@ntu.edu.tw

第三方授權見 public/THIRD_PARTY_NOTICES.txt。
