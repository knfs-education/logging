### **Hướng Dẫn Cấu Hình Loki**

Để cấu hình Loki, bạn cần hiểu các thành phần và các tham số trong file cấu hình. Dưới đây là hướng dẫn giải thích các phần chính trong file cấu hình của Loki.

#### **1. Cấu Hình `server`**
Phần này cấu hình các cổng mà Loki sẽ lắng nghe các yêu cầu HTTP và gRPC.

```yaml
server:
  http_listen_port: 3100
  grpc_listen_port: 9095
```

- **`http_listen_port`**: Cổng mà Loki sẽ lắng nghe các yêu cầu HTTP. Mặc định là `3100`. Đây là cổng mà bạn sẽ dùng để gửi các truy vấn hoặc các yêu cầu API đến Loki.
- **`grpc_listen_port`**: Cổng mà Loki sẽ lắng nghe các yêu cầu gRPC. Mặc định là `9095`. Đây là cổng dùng cho các giao tiếp hệ thống với Loki qua giao thức gRPC.

#### **2. Cấu Hình `ingester`**
Ingester chịu trách nhiệm nhận và xử lý các logs gửi đến Loki, chia nhỏ logs thành các chunk và lưu trữ vào bộ lưu trữ.

```yaml
ingester:
  chunk_target_size: 1048576
  max_chunk_age: 1h
  max_streams_per_user: 10000
```

- **`chunk_target_size`**: Kích thước mục tiêu của mỗi chunk log. Ở đây, giá trị là `1048576` (bytes), tương đương với `1MB`. Mỗi chunk log sẽ có kích thước này.
- **`max_chunk_age`**: Tuổi tối đa của một chunk log. Nếu một chunk quá thời gian này, nó sẽ được lưu trữ và không tiếp tục nhận log. Ở đây, giá trị là `1h` (1 giờ).
- **`max_streams_per_user`**: Số lượng stream tối đa mà mỗi người dùng có thể gửi đến Loki. Giá trị này giúp giới hạn số lượng luồng log mà mỗi người dùng có thể tạo ra trong hệ thống.

#### **3. Cấu Hình `schema_config`**
Phần này cấu hình cách Loki tổ chức các chỉ mục (indexes) của logs.

```yaml
schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: s3
      schema: v11
      index:
        prefix: loki_index_
        period: 24h
```

- **`from`**: Ngày bắt đầu áp dụng cấu hình này (định dạng: `YYYY-MM-DD`). Đây là thời điểm Loki sẽ bắt đầu lưu trữ logs theo cấu hình này.
- **`store`**: Chỉ định cách lưu trữ các chỉ mục. Ở đây, sử dụng `boltdb-shipper`, một loại store tối ưu cho môi trường phân tán và giúp duy trì các chỉ mục logs.
- **`object_store`**: Xác định dịch vụ lưu trữ đối tượng (object storage) sử dụng để lưu trữ dữ liệu logs. Ở đây, sử dụng `s3` (Amazon S3).
- **`schema`**: Phiên bản của schema mà Loki sẽ sử dụng để lưu trữ logs. Ở đây, giá trị là `v11`.
- **`index`**: Cấu hình các thông số liên quan đến chỉ mục (index).
  - **`prefix`**: Tiền tố của chỉ mục. Các chỉ mục sẽ có tiền tố là `loki_index_`.
  - **`period`**: Thời gian giữ một chỉ mục. Ở đây, mỗi chỉ mục sẽ tồn tại trong `24h`.

#### **4. Cấu Hình `storage_config`**
Phần này cấu hình nơi lưu trữ logs thực tế (chunks và chỉ mục).

```yaml
storage_config:
  boltdb_shipper:
    active_index_directory: /data/loki/index
    cache_location: /data/loki/cache
    shared_store: filesystem
  filesystem:
    directory: /data/loki/chunks
```

- **`boltdb_shipper`**: Cấu hình lưu trữ chỉ mục với `boltdb-shipper`.
  - **`active_index_directory`**: Đường dẫn nơi lưu trữ các chỉ mục đang hoạt động. Trong trường hợp này, nó sẽ lưu trữ chỉ mục trong thư mục `/data/loki/index`.
  - **`cache_location`**: Đường dẫn nơi lưu trữ các cache chỉ mục. Thường được sử dụng để lưu trữ các dữ liệu tạm thời giúp tăng tốc truy vấn.
  - **`shared_store`**: Cấu hình loại bộ lưu trữ dùng chung. Ở đây sử dụng `filesystem` (hệ thống tệp).
- **`filesystem`**: Cấu hình lưu trữ logs dạng file.
  - **`directory`**: Đường dẫn lưu trữ các chunk logs. Các chunk logs sẽ được lưu tại thư mục `/data/loki/chunks`.

### **5. Tổng Kết**

File cấu hình trên là một ví dụ cấu hình cơ bản của Loki. Các thành phần chính trong file cấu hình bao gồm:

- **`server`**: Cấu hình cổng cho HTTP và gRPC.
- **`ingester`**: Cấu hình các tham số liên quan đến việc xử lý và lưu trữ logs như chunk size, tuổi thọ của chunk, và số lượng streams.
- **`schema_config`**: Cấu hình chỉ mục và cách tổ chức các chỉ mục logs.
- **`storage_config`**: Cấu hình lưu trữ logs, bao gồm cách sử dụng hệ thống lưu trữ tệp và lưu trữ đối tượng.

### **6. Các Tham Số Có Thể Điều Chỉnh**
- **Kích thước chunk và thời gian lưu trữ**: Có thể điều chỉnh các tham số như `chunk_target_size` và `max_chunk_age` để tối ưu hóa cho môi trường cụ thể của bạn.
- **Schema và Indexing**: Cấu hình chỉ mục có thể thay đổi tùy theo yêu cầu về khả năng truy vấn và hiệu suất hệ thống.
