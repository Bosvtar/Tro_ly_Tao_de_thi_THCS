# 🚀 Hướng dẫn Deploy lên Vercel

## Phương pháp 1: Deploy qua Vercel CLI (Khuyến nghị)

### Bước 1: Cài đặt Vercel CLI
```bash
npm i -g vercel
```

### Bước 2: Login vào Vercel
```bash
vercel login
```

### Bước 3: Deploy
```bash
vercel
```

Lần đầu tiên, Vercel sẽ hỏi:
- **Set up and deploy?** → Chọn `Y`
- **Which scope?** → Chọn account của bạn
- **Link to existing project?** → Chọn `N` (tạo project mới)
- **Project name?** → Nhấn Enter để dùng tên mặc định
- **Directory?** → Nhấn Enter (dùng thư mục hiện tại)
- **Override settings?** → Nhấn Enter (không cần)

### Bước 4: Setup Environment Variable
Sau khi deploy, vào [Vercel Dashboard](https://vercel.com/dashboard):
1. Chọn project vừa tạo
2. Vào **Settings** → **Environment Variables**
3. Thêm biến:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** API key của bạn (lấy từ https://aistudio.google.com/app/apikey)
   - **Environment:** Chọn tất cả (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** project để áp dụng env var

---

## Phương pháp 2: Deploy qua GitHub (Tự động)

### Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Bước 2: Import project trên Vercel
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Chọn repository từ GitHub
4. Vercel tự động detect Vite project

### Bước 3: Cấu hình Build Settings
Vercel sẽ tự động detect:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Bước 4: Setup Environment Variable
Trước khi deploy:
1. Trong màn hình **Configure Project**
2. Thêm **Environment Variable:**
   - **Name:** `GEMINI_API_KEY`
   - **Value:** API key của bạn
3. Click **Deploy**

### Bước 5: Auto Deploy
Sau khi setup xong, mỗi lần push code lên GitHub, Vercel sẽ tự động deploy!

---

## ⚙️ Cấu hình đã có sẵn

### File `vercel.json`
Đã được tạo với cấu hình:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite
- SPA routing: Rewrite tất cả routes về `/index.html`

### Environment Variables cần thiết
- `GEMINI_API_KEY`: API key từ Google AI Studio

---

## 🔍 Kiểm tra sau khi deploy

1. **Build thành công?**
   - Vào **Deployments** tab trên Vercel Dashboard
   - Kiểm tra build logs

2. **App hoạt động?**
   - Click vào deployment URL
   - Test tạo đề thi

3. **API key hoạt động?**
   - Nếu lỗi "API key invalid", kiểm tra lại env var trên Vercel
   - Đảm bảo đã redeploy sau khi thêm env var

---

## 🐛 Troubleshooting

### Lỗi: "API key is not defined"
**Giải pháp:**
1. Kiểm tra env var `GEMINI_API_KEY` đã được thêm trên Vercel
2. Đảm bảo env var có trong tất cả environments (Production, Preview, Development)
3. Redeploy project

### Lỗi: "Build failed"
**Giải pháp:**
1. Kiểm tra build logs trên Vercel
2. Đảm bảo `package.json` có script `build`
3. Test build local: `npm run build`

### Lỗi: "404 Not Found" khi refresh page
**Giải pháp:**
- File `vercel.json` đã có rewrite rules, không cần làm gì thêm

---

## 📝 Lưu ý

- ✅ **Không commit** file `.env.local` lên GitHub (đã có trong `.gitignore`)
- ✅ **Luôn** thêm `GEMINI_API_KEY` trên Vercel Dashboard
- ✅ **Redeploy** sau khi thay đổi env vars
- ✅ Vercel có **free tier** rất tốt cho personal projects

---

## 🎉 Hoàn thành!

Sau khi deploy thành công, bạn sẽ có:
- ✅ Production URL: `https://your-project.vercel.app`
- ✅ Custom domain (có thể thêm sau)
- ✅ Auto deploy từ GitHub
- ✅ Preview deployments cho mỗi PR

