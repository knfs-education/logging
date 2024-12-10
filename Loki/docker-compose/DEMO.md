
## 1. Chạy hệ thống

**Khởi động dịch vụ:**
   ```bash
   docker-compose up --build
   ```

**Kiểm tra:**
   - **Node.js App 1:** [http://localhost:3002](http://localhost:3002)  
   - **Node.js App 2:** [http://localhost:3003](http://localhost:3003)  
   - **Grafana:** [http://localhost:3001](http://localhost:3001)  

---

## 2. Sử dụng Grafana

**Đăng nhập vào Grafana:**  
   - Mặc định tài khoản:  
     - Username: `admin`  
     - Password: `admin`.  

**Cấu hình Data Source:**
   - Vào **Connections > Data Sources > Add Data Source/Add new Datasource**.  
   - Chọn **Loki** và nhập URL: `http://loki:3100`.  

**Tạo Explore:**  
   - Chạy log info cho app 1:
  
```logql
  {job="/nodejs-app"} | json | level = `info`
```
   - Chạy log error cho app 1:
```logql
  {job="/nodejs-app"} | json | level = `error`
```
   - Chạy log info cho app 2:
```logql
  {job="/nodejs-app-2"} | json | level = `info`
```
   - Chạy log error cho app 2:
```logql
  {job="/nodejs-app-2"} | json | level = `error`
```

