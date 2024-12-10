

# Logging

### 1 Giới thiệu
Logging (ghi log) là một phần quan trọng trong bất kỳ hệ thống phần mềm nào giúp theo dõi các sự kiện, khắc phục sự cố, và giám sát sức khỏe cũng như hiệu suất của ứng dụng. Trong dự án này, chúng tôi sử dụng logging để ghi lại thông tin quan trọng về hệ thống, hành vi của ứng dụng, lỗi, sự kiện bảo mật và các chỉ số hiệu suất.

Tài liệu này cung cấp một cái nhìn tổng quan về các thực tiễn logging, các loại log chúng tôi ghi lại và cách các log được cấu trúc.

### 2 Tại sao Logging quan trọng ?
Logging mang lại một số lợi ích quan trọng:
- **Khắc phục sự cố**: Logs giúp xác định vấn đề và giải quyết chúng nhanh chóng. Khi xảy ra lỗi, logs cung cấp cái nhìn về những gì đã sai và ở đâu.
- **Giám sát hệ thống**: Logs là công cụ thiết yếu để giám sát trạng thái của ứng dụng, máy chủ và các thành phần hệ thống khác.
- **Kiểm tra bảo mật**: Logs ghi lại các sự kiện liên quan đến bảo mật như các lần đăng nhập thất bại, thay đổi quyền truy cập và các hành vi xâm nhập tiềm ẩn.
- **Chỉ số hiệu suất**: Logs có thể giúp theo dõi hiệu suất của hệ thống, phát hiện các điểm nghẽn và tối ưu hóa hành vi của ứng dụng.

### 3 Các loại Log
Chúng tôi phân loại logs theo các loại sau:
- **Logs Ứng Dụng**: Logs liên quan đến chức năng chính của ứng dụng, bao gồm logic nghiệp vụ, hành động của người dùng và các sự kiện quan trọng khác.
- **Logs Hệ Thống**: Logs được tạo ra bởi cơ sở hạ tầng nền tảng, bao gồm hệ điều hành và các sự kiện cấp máy chủ.
- **Logs Truy Cập**: Ghi lại các tương tác của người dùng và các yêu cầu đến, bao gồm địa chỉ IP, thời gian yêu cầu và các điểm cuối được truy cập.
- **Logs Lỗi**: Ghi lại các sự kiện lỗi, dấu vết ngăn xếp (stack trace) và các ngoại lệ chỉ ra rằng có vấn đề xảy ra.
- **Logs Bảo Mật**: Các logs liên quan đến các hành động bảo mật, chẳng hạn như đăng nhập, thay đổi quyền hạn và các lần truy cập không thành công.
- **Audit Logs**: Ghi lại các hành động hoặc thay đổi được thực hiện trong hệ thống, giúp tạo ra một nhật ký theo dõi (audit trail) cho các sự kiện quan trọng.

### 4 Cấu trúc và tiêu chuẩn Log
Logs cần tuân theo một định dạng tiêu chuẩn để dễ dàng phân tích và truy vấn. Cấu trúc log bao gồm các trường chính sau:
- **Timestamp**: Thời gian sự kiện xảy ra (định dạng ISO 8601).
- **Log Level**: Mức độ nghiêm trọng của sự kiện, ví dụ: DEBUG, INFO, WARN, ERROR, CRITICAL.
- **Message**: Mô tả ngắn gọn về sự kiện hoặc hành động.
- **Context/Metadata**: Các chi tiết bổ sung như ID người dùng, ID yêu cầu, và dữ liệu môi trường.

Ví dụ về một mục log:
```json
{
  "timestamp": "2024-12-08T14:00:00Z",
  "level": "ERROR",
  "message": "Kết nối cơ sở dữ liệu thất bại",
  "metadata": {
    "user_id": "12345",
    "request_id": "abcde-12345",
    "ip_address": "192.168.1.1"
  }
}
```

### 5 Nên Log gi?
Chúng ta cần log các thông tin sau:
- **Lỗi**: Các lỗi nghiêm trọng và ngoại lệ làm hỏng chức năng hoặc gây ngừng hoạt động.
- **Hoạt Động Của Người Dùng**: Các hành động như đăng nhập, đăng xuất, cập nhật dữ liệu, và thay đổi quyền hạn.
- **Chỉ Số Hiệu Suất**: Thời gian phản hồi, hiệu suất API, và sử dụng tài nguyên (CPU, bộ nhớ).
- **Sự Kiện Bảo Mật**: Các hành động nghi ngờ như các lần đăng nhập thất bại, leo thang quyền hạn, hoặc truy cập trái phép.
- **Sự Kiện Hệ Thống**: Các thay đổi quan trọng trong hệ thống như khởi động lại máy chủ, thay đổi cấu hình, hoặc dừng dịch vụ.

### 6 Logging tốt nên chú ý
- **Log Levels**: Sử dụng các mức độ log phù hợp để phân loại sự kiện. Ví dụ:
  - `DEBUG` cho thông tin chi tiết trong quá trình phát triển.
  - `INFO` cho các hoạt động hệ thống thông thường và hành động của người dùng.
  - `WARN` cho các vấn đề tiềm ẩn không cần phải xử lý ngay.
  - `ERROR` cho các vấn đề cần sửa chữa.
  - `CRITICAL/FATAL` cho các sự cố nghiêm trọng khiến hệ thống ngừng hoạt động.
  
- **Logging Có Cấu Trúc**: Sử dụng định dạng có cấu trúc như JSON để làm cho logs có thể đọc được bởi máy móc và dễ dàng truy vấn.
  
- **Centralized Logging**: Logs từ các dịch vụ khác nhau nên được tập trung vào một hệ thống quản lý chung (ví dụ: Elasticsearch, Splunk) để dễ dàng tìm kiếm và phân tích.

- **Log Rotation**: Thiết lập log rotation để tránh log files tăng trưởng vô hạn và tiêu tốn dung lượng đĩa. Cấu hình tự động xoay vòng và lưu trữ để không làm đầy ổ đĩa.

- **Cảnh Báo**: Cài đặt hệ thống cảnh báo dựa trên các sự kiện log để nhận thông báo khi có lỗi nghiêm trọng, sự cố bảo mật hoặc giảm hiệu suất.

- **Retention Policies**: Đặt chính sách retention cho logs, chỉ lưu trữ logs trong một khoảng thời gian nhất định và xóa chúng sau khi không còn cần thiết.

- **Phân Quyền Truy Cập**: Đảm bảo rằng chỉ những người có quyền hợp lệ mới có thể truy cập vào logs, đặc biệt là các logs nhạy cảm liên quan đến bảo mật.

- 

#### 6.1 Ví Dụ Về Logging Trong Code
```python
import logging

# Cấu hình logging
logging.basicConfig(
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# Ghi lại các sự kiện
logging.info('Ứng dụng đã khởi động')
logging.warning('Sử dụng bộ nhớ cao')
logging.error('Kết nối cơ sở dữ liệu thất bại')
```

### 7 Logging Tool
Trong môi trường sản xuất, logs thường được gửi đến một máy chủ hoặc dịch vụ logging trung tâm, nơi chúng được xử lý và lưu trữ để truy xuất sau này. Một số giải pháp logging phổ biến bao gồm:
- **Elasticsearch, Logstash và Kibana (ELK Stack)**
- **Splunk**
- **Datadog**
- **AWS CloudWatch**
- **Fluentd**
- **Loki**


