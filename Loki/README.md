# Loki - A Log Aggregation System

Loki là một hệ thống thu thập và lưu trữ logs do Grafana Labs phát triển. Loki thiết kế theo cách đơn giản, hiệu quả và dễ dàng mở rộng, giúp quản lý log trong môi trường phân tán một cách linh hoạt và dễ dàng tích hợp với các công cụ như Grafana.

## Kiến Trúc của Loki


### **1. Các Thành Phần Chính trong Kiến Trúc Loki**

Loki được xây dựng từ các thành phần chính sau:

#### **1.1. Client (Log Shippers)**
Các ứng dụng hoặc dịch vụ trong hệ thống sẽ sử dụng các client (hoặc log shippers) để gửi logs đến Loki. Các client này có thể là:
- **Promtail**: Là agent chính thức của Loki, chịu trách nhiệm thu thập và gửi logs từ các hệ thống hoặc ứng dụng (ví dụ: các pod trong Kubernetes) đến Loki. Promtail đọc logs từ các file, đẩy chúng vào Loki, và tự động gắn các metadata như tên pod, namespace, hoặc container ID.
- **Fluentd hoặc Logstash**: Các công cụ khác có thể được sử dụng để thu thập và gửi logs từ hệ thống đến Loki.

#### **1.2. Loki Server**
Loki server là thành phần chịu trách nhiệm xử lý, lưu trữ và cung cấp logs cho người dùng. Nó bao gồm các thành phần sau:

- **Ingester**: Ingester nhận logs từ các client, xử lý và chia chúng thành các chunk nhỏ hơn. Sau đó, ingester sẽ lưu trữ các chunk này vào bộ lưu trữ. Các ingester có thể chạy trên nhiều node để hỗ trợ khả năng mở rộng theo chiều ngang.
  
- **Distributor**: Distributor tiếp nhận logs từ các client và phân phối chúng đến các ingester. Nó giúp cân bằng tải giữa các ingester, đảm bảo logs được phân phối một cách đồng đều và tối ưu hóa khả năng xử lý.

- **Querier**: Querier là thành phần chịu trách nhiệm truy vấn logs từ bộ lưu trữ. Khi người dùng thực hiện các truy vấn thông qua Grafana hoặc các công cụ khác, querier sẽ xử lý các truy vấn và lấy logs từ bộ lưu trữ để trả về kết quả cho người dùng.

- **Index**: Loki không sử dụng index truyền thống như Elasticsearch, mà thay vào đó chỉ index các **labels** của logs (ví dụ: dịch vụ, tên pod, container ID), giúp giảm thiểu tài nguyên hệ thống và cải thiện hiệu suất truy vấn. Loki chỉ index metadata của logs (labels) thay vì nội dung log đầy đủ.

- **Storage**: Bộ lưu trữ (storage) là nơi lưu trữ các chunk logs của Loki. Loki hỗ trợ lưu trữ logs trên các hệ thống lưu trữ đám mây (ví dụ: S3, GCS) hoặc hệ thống tệp cục bộ. Các logs này được lưu trữ dưới dạng các **chunks**, giúp tối ưu hóa việc truy vấn và giảm bớt yêu cầu về bộ nhớ.

#### **1.3. Chunks**
Loki lưu trữ logs dưới dạng **chunks** thay vì index đầy đủ nội dung logs như Elasticsearch. Chunks là các khối dữ liệu nhỏ được chia nhỏ từ các logs lớn, giúp dễ dàng lưu trữ và truy vấn. Các chunk này được lưu trữ trong bộ lưu trữ và có thể được truy vấn bởi querier khi người dùng yêu cầu.

#### **1.4. Rules**
Loki cho phép người dùng cấu hình các **rules** (quy tắc) để tự động xử lý logs, tạo cảnh báo hoặc phân loại logs. Các quy tắc này có thể được cấu hình trong Grafana để giúp tự động hóa việc giám sát và phân tích logs.

### **2. Quy Trình Hoạt Động Của Loki**

Quy trình hoạt động của Loki có thể được tóm tắt như sau:

1. **Log Shippers (Promtail)**: Các ứng dụng hoặc container trong hệ thống tạo logs, và Promtail (hoặc các log shipper khác như Fluentd) sẽ thu thập logs và gửi chúng đến Loki.
2. **Distributor**: Distributor nhận các logs từ client và phân phối chúng tới các ingester. Distributor giúp phân phối logs một cách đồng đều giữa các ingester.
3. **Ingester**: Ingester nhận các logs từ distributor, chia chúng thành các chunk nhỏ hơn và lưu trữ chúng vào bộ lưu trữ (có thể là object storage như S3 hoặc hệ thống tệp).
4. **Querier**: Khi người dùng thực hiện truy vấn qua Grafana, querier sẽ truy vấn metadata logs từ bộ lưu trữ (index) và trả về các kết quả logs theo yêu cầu.
5. **Storage**: Các logs đã được chia nhỏ thành các chunk và được lưu trữ trên hệ thống lưu trữ (object storage hoặc hệ thống tệp cục bộ).
6. **Rules**: Các quy tắc có thể được cấu hình để giám sát và cảnh báo khi có sự kiện hoặc lỗi xảy ra trong logs.

### **3. Lưu Trữ và Quản Lý Logs**

Loki không sử dụng index toàn bộ nội dung logs như Elasticsearch mà thay vào đó sử dụng các chunk để lưu trữ và chỉ index các metadata như **labels** (tên dịch vụ, pod, container, v.v.). Điều này giúp tiết kiệm tài nguyên và cải thiện hiệu suất truy vấn.

- **Metadata Indexing**: Loki chỉ index metadata của logs như labels (ví dụ: tên dịch vụ, container ID, pod ID), không index toàn bộ nội dung log, giúp tối ưu hóa dung lượng và hiệu suất hệ thống.
- **Object Storage**: Các chunk logs được lưu trữ trong các dịch vụ lưu trữ đối tượng như S3, GCS hoặc hệ thống tệp.
- **Retention and Expiry**: Loki cho phép cấu hình thời gian lưu trữ logs (retention policy) để tự động xóa logs cũ. Thời gian lưu trữ có thể được cấu hình tùy thuộc vào yêu cầu của hệ thống.


## Cách sử dụng Loki

Để sử dụng Loki, bạn cần thực hiện các bước sau:

1. **Cài đặt Loki**: Loki có thể chạy như một service đơn lẻ hoặc thông qua Kubernetes. Bạn có thể cài đặt Loki bằng cách sử dụng Docker hoặc Docker Compose, hoặc triển khai Loki trên Kubernetes.

2. **Thu thập Logs**: Bạn cần gửi logs vào Loki. Các ứng dụng có thể ghi logs thông qua HTTP (với định dạng JSON) hoặc gRPC. Một số công cụ phổ biến như Promtail (công cụ gửi logs của Grafana Labs) có thể được sử dụng để tự động thu thập logs từ các file log và gửi vào Loki.

3. **Tích hợp với Grafana**: Để trực quan hóa logs, bạn có thể tích hợp Loki với Grafana. Grafana cung cấp khả năng kết nối và hiển thị logs từ Loki thông qua các dashboard dễ sử dụng.

4. **Truy vấn Logs**: Bạn có thể sử dụng ngôn ngữ truy vấn LogQL của Loki để tìm kiếm logs, lọc logs theo các nhãn (labels), và hiển thị dữ liệu trong Grafana.

### Ví dụ về LogQL

- Tìm kiếm tất cả logs từ một stream cụ thể:
```PromQL
{job="my-application"}
```

- Tìm kiếm logs với mức độ nghiêm trọng là "error":
```PromQL
{job="my-application", level="error"}
```

- Truy vấn logs trong khoảng thời gian nhất định:
```PromQL
{job="my-application"} |= "error" | line_format "{{.message}}" | range(start="2023-01-01", end="2023-01-02")
```


## Ưu Điểm của Loki

1. **Tích hợp chặt chẽ với Grafana**: Loki được thiết kế để dễ dàng tích hợp với Grafana, cho phép bạn tạo các dashboard và trực quan hóa logs một cách nhanh chóng.

2. **Tiết kiệm tài nguyên**: Loki không tạo chỉ mục cho toàn bộ nội dung logs mà chỉ tạo chỉ mục cho các nhãn (labels), điều này giúp tiết kiệm tài nguyên và làm giảm chi phí lưu trữ.

3. **Khả năng mở rộng tốt**: Loki có thể dễ dàng mở rộng khi cần thiết, đặc biệt khi sử dụng trong các môi trường Kubernetes hoặc Docker.

4. **Đơn giản và dễ sử dụng**: Cấu hình và triển khai Loki khá đơn giản, không yêu cầu các bước phức tạp. Loki có thể được sử dụng trong nhiều hệ thống log với chi phí thấp.

5. **Lưu trữ phân tán**: Loki hỗ trợ nhiều backend lưu trữ phân tán như S3, GCS và các hệ thống file, giúp tăng tính khả dụng và mở rộng hệ thống.

## Nhược Điểm của Loki

1. **Không lưu trữ logs dạng raw**: Loki không lưu trữ toàn bộ logs như cách mà Elasticsearch làm. Thay vào đó, nó chỉ lưu trữ một phần thông tin, như nhãn và chỉ mục, điều này có thể không phù hợp với một số yêu cầu lưu trữ logs đầy đủ.

2. **Khó khăn trong việc tìm kiếm logs dạng full-text**: Vì chỉ mục của Loki chỉ chứa nhãn, việc tìm kiếm logs theo nội dung toàn bộ có thể không hiệu quả như các hệ thống log truyền thống như Elasticsearch.

3. **Cần cài đặt công cụ thu thập logs**: Để sử dụng Loki, bạn cần phải thiết lập các công cụ như Promtail hoặc Fluentd để thu thập và gửi logs vào Loki, điều này đôi khi có thể phức tạp đối với những người mới bắt đầu.
   
4. **Không có index toàn bộ nội dung**: Việc chỉ index metadata có thể làm chậm quá trình tìm kiếm đối với các truy vấn phức tạp hoặc yêu cầu tìm kiếm toàn bộ nội dung logs.

5.  **Cần cấu hình bổ sung cho cảnh báo**: Việc cấu hình các quy tắc và cảnh báo có thể phức tạp nếu không được thực hiện đúng cách.

## Cấu Hình và Tích Hợp

Loki hỗ trợ cấu hình rất linh hoạt thông qua các file cấu hình như `loki-config.yaml`. Bạn có thể điều chỉnh các tham số như cách lưu trữ, cách thức ghi nhận logs, và chỉ mục theo nhu cầu cụ thể của hệ thống.

Loki có thể chạy trên các môi trường như:
- **Docker**: Triển khai nhanh chóng với Docker Compose.
- **Kubernetes**: Triển khai quy mô lớn và dễ dàng mở rộng trên các cluster Kubernetes.