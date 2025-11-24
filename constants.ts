
import { SubjectType, GradeType } from "./types";

export interface ChapterData {
  id: string;
  subject: SubjectType;
  grade: GradeType;
  domain: string; 
  name: string;
  lessons: string[];
}

export const SUBJECTS: { id: SubjectType; name: string; icon: string }[] = [
  { id: 'Toán', name: 'Toán học', icon: 'Calculator' },
  { id: 'Vật lí', name: 'Vật lí (KHTN)', icon: 'Zap' },
  { id: 'Hóa học', name: 'Hóa học (KHTN)', icon: 'FlaskConical' },
];

export const GRADES: GradeType[] = ['6', '7', '8', '9'];

// Common Domains for Math
export const MATH_DOMAINS = {
  ALGEBRA: "Số và Đại số",
  GEOMETRY: "Hình học và Đo lường",
  STATS: "Thống kê và Xác suất"
};

// Common Domains for Science (Mapped from KHTN)
export const SCIENCE_DOMAINS = {
  MATTER: "Chất và sự biến đổi của chất", // Hóa học mostly
  ENERGY: "Năng lượng và sự biến đổi", // Vật lý mostly
  MECHANICS: "Cơ học (Chuyển động & Lực)", // Vật lý
  OPTICS: "Quang học (Ánh sáng)", // Vật lý
  ACOUSTICS: "Âm học (Âm thanh)", // Vật lý
  ELECTRICITY: "Điện và Từ", // Vật lý
  EARTH: "Trái Đất và Bầu trời" // Vật lý/Thiên văn
};

export const CURRICULUM: ChapterData[] = [
  // =================================================================
  // TOÁN HỌC (MATH)
  // =================================================================

  // --- TOÁN 6 ---
  {
    id: "m6_c1", subject: "Toán", grade: "6", domain: MATH_DOMAINS.ALGEBRA,
    name: "Tập hợp các số tự nhiên",
    lessons: ["Tập hợp", "Tập hợp số tự nhiên. Ghi số tự nhiên", "Các phép tính trong tập hợp số tự nhiên", "Lũy thừa với số mũ tự nhiên", "Thứ tự thực hiện các phép tính"]
  },
  {
    id: "m6_c2", subject: "Toán", grade: "6", domain: MATH_DOMAINS.ALGEBRA,
    name: "Tính chia hết trong tập hợp số tự nhiên",
    lessons: ["Quan hệ chia hết và tính chất", "Dấu hiệu chia hết cho 2, cho 5", "Dấu hiệu chia hết cho 3, cho 9", "Số nguyên tố. Hợp số", "Ước chung và Ước chung lớn nhất", "Bội chung và Bội chung nhỏ nhất"]
  },
  {
    id: "m6_c3", subject: "Toán", grade: "6", domain: MATH_DOMAINS.ALGEBRA,
    name: "Số nguyên",
    lessons: ["Số nguyên âm và tập hợp các số nguyên", "Thứ tự trong tập hợp số nguyên", "Phép cộng và phép trừ số nguyên", "Quy tắc dấu ngoặc", "Phép nhân và phép chia số nguyên"]
  },
  {
    id: "m6_c4", subject: "Toán", grade: "6", domain: MATH_DOMAINS.GEOMETRY,
    name: "Một số hình phẳng trong thực tiễn",
    lessons: ["Tam giác đều. Hình vuông. Lục giác đều", "Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân", "Chu vi và diện tích của một số hình phẳng"]
  },
  {
    id: "m6_c5", subject: "Toán", grade: "6", domain: MATH_DOMAINS.GEOMETRY,
    name: "Tính đối xứng của hình phẳng",
    lessons: ["Hình có trục đối xứng", "Hình có tâm đối xứng", "Vai trò của tính đối xứng trong thế giới tự nhiên"]
  },
  {
    id: "m6_c6", subject: "Toán", grade: "6", domain: MATH_DOMAINS.ALGEBRA,
    name: "Phân số",
    lessons: ["Mở rộng khái niệm phân số", "So sánh phân số", "Các phép tính với phân số", "Hỗn số", "Bài toán tìm giá trị phân số của một số cho trước"]
  },
  {
    id: "m6_c7", subject: "Toán", grade: "6", domain: MATH_DOMAINS.ALGEBRA,
    name: "Số thập phân",
    lessons: ["Số thập phân", "Các phép tính với số thập phân", "Làm tròn và ước lượng", "Tỉ số và tỉ số phần trăm"]
  },
  {
    id: "m6_c8", subject: "Toán", grade: "6", domain: MATH_DOMAINS.GEOMETRY,
    name: "Những hình học cơ bản",
    lessons: ["Điểm. Đường thẳng", "Điểm nằm giữa hai điểm. Tia", "Đoạn thẳng. Độ dài đoạn thẳng", "Trung điểm của đoạn thẳng", "Góc. Số đo góc"]
  },
  {
    id: "m6_c9", subject: "Toán", grade: "6", domain: MATH_DOMAINS.STATS,
    name: "Dữ liệu và xác suất thực nghiệm",
    lessons: ["Dữ liệu và thu thập dữ liệu", "Bảng thống kê và biểu đồ tranh", "Biểu đồ cột và biểu đồ cột kép", "Kết quả có thể và sự kiện trong trò chơi", "Xác suất thực nghiệm"]
  },

  // --- TOÁN 7 ---
  {
    id: "m7_c1", subject: "Toán", grade: "7", domain: MATH_DOMAINS.ALGEBRA,
    name: "Số hữu tỉ",
    lessons: ["Tập hợp các số hữu tỉ", "Cộng, trừ, nhân, chia số hữu tỉ", "Lũy thừa với số mũ tự nhiên của một số hữu tỉ", "Quy tắc dấu ngoặc và quy tắc chuyển vế"]
  },
  {
    id: "m7_c2", subject: "Toán", grade: "7", domain: MATH_DOMAINS.ALGEBRA,
    name: "Số thực",
    lessons: ["Số vô tỉ. Căn bậc hai số học", "Số thực. Giá trị tuyệt đối của một số thực", "Làm tròn số và ước lượng kết quả"]
  },
  {
    id: "m7_c3", subject: "Toán", grade: "7", domain: MATH_DOMAINS.GEOMETRY,
    name: "Góc và đường thẳng song song",
    lessons: ["Góc ở vị trí đặc biệt. Tia phân giác của một góc", "Hai đường thẳng song song và dấu hiệu nhận biết", "Tiên đề Euclid. Tính chất của hai đường thẳng song song", "Định lí và chứng minh định lí"]
  },
  {
    id: "m7_c4", subject: "Toán", grade: "7", domain: MATH_DOMAINS.GEOMETRY,
    name: "Tam giác bằng nhau",
    lessons: ["Tổng các góc trong một tam giác", "Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất (c.c.c)", "Trường hợp bằng nhau thứ hai (c.g.c)", "Trường hợp bằng nhau thứ ba (g.c.g)", "Tam giác cân. Đường trung trực của đoạn thẳng"]
  },
  {
    id: "m7_c5", subject: "Toán", grade: "7", domain: MATH_DOMAINS.STATS,
    name: "Thu thập và biểu diễn dữ liệu",
    lessons: ["Thu thập và phân loại dữ liệu", "Biểu đồ hình quạt tròn", "Biểu đồ đoạn thẳng"]
  },
  {
    id: "m7_c6", subject: "Toán", grade: "7", domain: MATH_DOMAINS.ALGEBRA,
    name: "Tỉ lệ thức và Đại lượng tỉ lệ",
    lessons: ["Tỉ lệ thức", "Tính chất của dãy tỉ số bằng nhau", "Đại lượng tỉ lệ thuận", "Đại lượng tỉ lệ nghịch"]
  },
  {
    id: "m7_c7", subject: "Toán", grade: "7", domain: MATH_DOMAINS.ALGEBRA,
    name: "Biểu thức đại số và Đa thức một biến",
    lessons: ["Biểu thức đại số", "Đa thức một biến", "Cộng và trừ đa thức một biến", "Phép nhân đa thức một biến", "Phép chia đa thức một biến"]
  },
  {
    id: "m7_c8", subject: "Toán", grade: "7", domain: MATH_DOMAINS.STATS,
    name: "Làm quen với biến cố và xác suất",
    lessons: ["Biến cố trong các trò chơi đơn giản", "Xác suất của biến cố"]
  },
  {
    id: "m7_c9", subject: "Toán", grade: "7", domain: MATH_DOMAINS.GEOMETRY,
    name: "Quan hệ giữa các yếu tố trong tam giác",
    lessons: ["Quan hệ giữa góc và cạnh đối diện", "Quan hệ giữa đường vuông góc và đường xiên", "Quan hệ giữa ba cạnh của một tam giác", "Các đường đồng quy trong tam giác"]
  },

  // --- TOÁN 8 ---
  {
    id: "m8_c1", subject: "Toán", grade: "8", domain: MATH_DOMAINS.ALGEBRA,
    name: "Đa thức",
    lessons: ["Đơn thức và đa thức nhiều biến", "Các phép tính với đa thức nhiều biến", "Hằng đẳng thức đáng nhớ", "Phân tích đa thức thành nhân tử"]
  },
  {
    id: "m8_c2", subject: "Toán", grade: "8", domain: MATH_DOMAINS.ALGEBRA,
    name: "Phân thức đại số",
    lessons: ["Phân thức đại số", "Cộng và trừ phân thức", "Nhân và chia phân thức"]
  },
  {
    id: "m8_c3", subject: "Toán", grade: "8", domain: MATH_DOMAINS.GEOMETRY,
    name: "Tứ giác",
    lessons: ["Tứ giác", "Hình thang cân", "Hình bình hành", "Hình chữ nhật", "Hình thoi và Hình vuông"]
  },
  {
    id: "m8_c4", subject: "Toán", grade: "8", domain: MATH_DOMAINS.GEOMETRY,
    name: "Định lí Thalès",
    lessons: ["Định lí Thalès trong tam giác", "Đường trung bình của tam giác", "Tính chất đường phân giác của tam giác"]
  },
  {
    id: "m8_c5", subject: "Toán", grade: "8", domain: MATH_DOMAINS.STATS,
    name: "Dữ liệu và biểu đồ",
    lessons: ["Thu thập và phân loại dữ liệu", "Lựa chọn biểu đồ", "Phân tích dữ liệu"]
  },
  {
    id: "m8_c6", subject: "Toán", grade: "8", domain: MATH_DOMAINS.ALGEBRA,
    name: "Phương trình bậc nhất và Hàm số bậc nhất",
    lessons: ["Phương trình bậc nhất một ẩn", "Giải bài toán bằng cách lập phương trình", "Hàm số bậc nhất và đồ thị", "Hệ số góc của đường thẳng"]
  },
  {
    id: "m8_c7", subject: "Toán", grade: "8", domain: MATH_DOMAINS.GEOMETRY,
    name: "Tam giác đồng dạng và Hình đồng dạng",
    lessons: ["Tam giác đồng dạng", "Các trường hợp đồng dạng của hai tam giác", "Các trường hợp đồng dạng của tam giác vuông", "Hình đồng dạng"]
  },
  {
    id: "m8_c8", subject: "Toán", grade: "8", domain: MATH_DOMAINS.STATS,
    name: "Xác suất thực nghiệm và lí thuyết",
    lessons: ["Mô tả xác suất bằng tỉ số", "Xác suất lí thuyết và xác suất thực nghiệm"]
  },
  {
    id: "m8_c9", subject: "Toán", grade: "8", domain: MATH_DOMAINS.GEOMETRY,
    name: "Một số hình khối trong thực tiễn",
    lessons: ["Hình chóp tam giác đều", "Hình chóp tứ giác đều"]
  },

  // --- TOÁN 9 ---
  {
    id: "m9_c1", subject: "Toán", grade: "9", domain: MATH_DOMAINS.ALGEBRA,
    name: "Phương trình và hệ phương trình",
    lessons: ["Phương trình quy về phương trình bậc nhất một ẩn", "Phương trình bậc nhất hai ẩn", "Hệ hai phương trình bậc nhất hai ẩn", "Giải hệ phương trình bằng phương pháp thế", "Giải hệ phương trình bằng phương pháp cộng đại số"]
  },
  {
    id: "m9_c2", subject: "Toán", grade: "9", domain: MATH_DOMAINS.ALGEBRA,
    name: "Bất phương trình bậc nhất một ẩn",
    lessons: ["Bất đẳng thức", "Bất phương trình bậc nhất một ẩn"]
  },
  {
    id: "m9_c3", subject: "Toán", grade: "9", domain: MATH_DOMAINS.ALGEBRA,
    name: "Căn bậc hai và Căn bậc ba",
    lessons: ["Căn bậc hai", "Căn thức bậc hai", "Biến đổi đơn giản biểu thức chứa căn thức bậc hai", "Căn bậc ba"]
  },
  {
    id: "m9_c4", subject: "Toán", grade: "9", domain: MATH_DOMAINS.GEOMETRY,
    name: "Hệ thức lượng trong tam giác vuông",
    lessons: ["Tỉ số lượng giác của góc nhọn", "Một số hệ thức về cạnh và góc trong tam giác vuông", "Ứng dụng thực tế của tỉ số lượng giác"]
  },
  {
    id: "m9_c5", subject: "Toán", grade: "9", domain: MATH_DOMAINS.GEOMETRY,
    name: "Đường tròn",
    lessons: ["Đường tròn. Tính đối xứng của đường tròn", "Đường kính và dây của đường tròn", "Vị trí tương đối của đường thẳng và đường tròn", "Tiếp tuyến của đường tròn", "Góc ở tâm. Số đo cung"]
  },
  {
    id: "m9_c6", subject: "Toán", grade: "9", domain: MATH_DOMAINS.ALGEBRA,
    name: "Hàm số y = ax² và Phương trình bậc hai",
    lessons: ["Hàm số y = ax² (a ≠ 0)", "Phương trình bậc hai một ẩn", "Định lí Viète và ứng dụng", "Giải bài toán bằng cách lập phương trình"]
  },
  {
    id: "m9_c7", subject: "Toán", grade: "9", domain: MATH_DOMAINS.STATS,
    name: "Tần số và Tần số tương đối",
    lessons: ["Bảng tần số và tần số tương đối", "Biểu đồ tần số và biểu đồ tần số tương đối", "Xác suất của biến cố trong một số trò chơi đơn giản"]
  },
  {
    id: "m9_c8", subject: "Toán", grade: "9", domain: MATH_DOMAINS.GEOMETRY,
    name: "Hình học không gian",
    lessons: ["Hình trụ", "Hình nón", "Hình cầu"]
  },

  // =================================================================
  // VẬT LÍ (PHYSICS) - Trích xuất từ KHTN
  // =================================================================

  // --- VẬT LÍ 6 (KHTN 6) ---
  {
    id: "p6_c1", subject: "Vật lí", grade: "6", domain: SCIENCE_DOMAINS.MECHANICS,
    name: "Các phép đo",
    lessons: ["Đo chiều dài", "Đo khối lượng", "Đo thời gian", "Thang nhiệt độ Celsius. Đo nhiệt độ"]
  },
  {
    id: "p6_c2", subject: "Vật lí", grade: "6", domain: SCIENCE_DOMAINS.MECHANICS,
    name: "Lực",
    lessons: ["Lực và tác dụng của lực", "Lực tiếp xúc và lực không tiếp xúc", "Biến dạng của lò xo. Phép đo lực", "Trọng lượng và lực hấp dẫn", "Lực ma sát"]
  },
  {
    id: "p6_c3", subject: "Vật lí", grade: "6", domain: SCIENCE_DOMAINS.ENERGY,
    name: "Năng lượng",
    lessons: ["Năng lượng và sự truyền năng lượng", "Bảo toàn năng lượng", "Năng lượng hao phí"]
  },
  {
    id: "p6_c4", subject: "Vật lí", grade: "6", domain: SCIENCE_DOMAINS.EARTH,
    name: "Trái Đất và Bầu trời",
    lessons: ["Chuyển động nhìn thấy của Mặt Trời", "Chuyển động nhìn thấy của Mặt Trăng", "Hệ Mặt Trời và Ngân Hà"]
  },

  // --- VẬT LÍ 7 (KHTN 7) ---
  {
    id: "p7_c1", subject: "Vật lí", grade: "7", domain: SCIENCE_DOMAINS.MECHANICS,
    name: "Tốc độ",
    lessons: ["Tốc độ chuyển động", "Đo tốc độ", "Đồ thị quãng đường - thời gian"]
  },
  {
    id: "p7_c2", subject: "Vật lí", grade: "7", domain: SCIENCE_DOMAINS.ACOUSTICS,
    name: "Âm thanh",
    lessons: ["Mô tả sóng âm", "Độ to và độ cao của âm", "Phản xạ âm", "Sóng âm"]
  },
  {
    id: "p7_c3", subject: "Vật lí", grade: "7", domain: SCIENCE_DOMAINS.OPTICS,
    name: "Ánh sáng",
    lessons: ["Ánh sáng, tia sáng", "Sự phản xạ ánh sáng", "Ảnh của vật qua gương phẳng"]
  },
  {
    id: "p7_c4", subject: "Vật lí", grade: "7", domain: SCIENCE_DOMAINS.ELECTRICITY,
    name: "Từ trường",
    lessons: ["Nam châm", "Từ trường", "Từ trường Trái Đất", "Nam châm điện"]
  },

  // --- VẬT LÍ 8 (KHTN 8) ---
  {
    id: "p8_c1", subject: "Vật lí", grade: "8", domain: SCIENCE_DOMAINS.MECHANICS,
    name: "Khối lượng riêng và Áp suất",
    lessons: ["Khối lượng riêng", "Áp suất trên một bề mặt", "Áp suất chất lỏng", "Áp suất khí quyển", "Lực đẩy Archimedes"]
  },
  {
    id: "p8_c2", subject: "Vật lí", grade: "8", domain: SCIENCE_DOMAINS.MECHANICS,
    name: "Tác dụng làm quay của lực",
    lessons: ["Moment lực", "Đòn bẩy"]
  },
  {
    id: "p8_c3", subject: "Vật lí", grade: "8", domain: SCIENCE_DOMAINS.ELECTRICITY,
    name: "Điện",
    lessons: ["Hiện tượng nhiễm điện do cọ xát", "Dòng điện. Nguồn điện", "Mạch điện và các thiết bị an toàn", "Tác dụng của dòng điện", "Cường độ dòng điện và hiệu điện thế"]
  },
  {
    id: "p8_c4", subject: "Vật lí", grade: "8", domain: SCIENCE_DOMAINS.ENERGY,
    name: "Nhiệt",
    lessons: ["Năng lượng nhiệt và nội năng", "Sự truyền nhiệt", "Sự nở vì nhiệt"]
  },

  // --- VẬT LÍ 9 (KHTN 9) ---
  {
    id: "p9_c1", subject: "Vật lí", grade: "9", domain: SCIENCE_DOMAINS.ENERGY,
    name: "Năng lượng cơ học",
    lessons: ["Động năng. Thế năng", "Cơ năng"]
  },
  {
    id: "p9_c2", subject: "Vật lí", grade: "9", domain: SCIENCE_DOMAINS.OPTICS,
    name: "Ánh sáng",
    lessons: ["Hiện tượng khúc xạ ánh sáng", "Thấu kính hội tụ", "Thấu kính phân kì", "Mắt và các tật của mắt", "Kính lúp"]
  },
  {
    id: "p9_c3", subject: "Vật lí", grade: "9", domain: SCIENCE_DOMAINS.ELECTRICITY,
    name: "Điện từ",
    lessons: ["Từ trường của ống dây có dòng điện", "Lực từ", "Cảm ứng điện từ", "Dòng điện xoay chiều", "Máy biến thế"]
  },
  {
    id: "p9_c4", subject: "Vật lí", grade: "9", domain: SCIENCE_DOMAINS.ENERGY,
    name: "Năng lượng và cuộc sống",
    lessons: ["Vòng tuần hoàn năng lượng trên Trái Đất", "Năng lượng hóa thạch", "Năng lượng tái tạo"]
  },

  // =================================================================
  // HÓA HỌC (CHEMISTRY) - Trích xuất từ KHTN
  // =================================================================

  // --- HÓA HỌC 6 (KHTN 6) ---
  {
    id: "ch6_c1", subject: "Hóa học", grade: "6", domain: SCIENCE_DOMAINS.MATTER,
    name: "Các thể của chất",
    lessons: ["Sự đa dạng của chất", "Ba thể của chất", "Sự chuyển thể của chất"]
  },
  {
    id: "ch6_c2", subject: "Hóa học", grade: "6", domain: SCIENCE_DOMAINS.MATTER,
    name: "Oxygen và Không khí",
    lessons: ["Oxygen và tính chất", "Không khí và bảo vệ môi trường không khí"]
  },
  {
    id: "ch6_c3", subject: "Hóa học", grade: "6", domain: SCIENCE_DOMAINS.MATTER,
    name: "Hỗn hợp và Tách chất",
    lessons: ["Hỗn hợp, chất tinh khiết, dung dịch", "Một số phương pháp tách chất ra khỏi hỗn hợp"]
  },
  {
    id: "ch6_c4", subject: "Hóa học", grade: "6", domain: SCIENCE_DOMAINS.MATTER,
    name: "Nhiên liệu và Nguyên liệu",
    lessons: ["Một số nhiên liệu thông dụng", "Một số nguyên liệu thông dụng", "Một số lương thực - thực phẩm"]
  },

  // --- HÓA HỌC 7 (KHTN 7) ---
  {
    id: "ch7_c1", subject: "Hóa học", grade: "7", domain: SCIENCE_DOMAINS.MATTER,
    name: "Nguyên tử và Nguyên tố hóa học",
    lessons: ["Nguyên tử", "Nguyên tố hóa học"]
  },
  {
    id: "ch7_c2", subject: "Hóa học", grade: "7", domain: SCIENCE_DOMAINS.MATTER,
    name: "Phân tử và Liên kết hóa học",
    lessons: ["Sơ lược về bảng tuần hoàn các nguyên tố hóa học", "Phân tử. Đơn chất. Hợp chất", "Giới thiệu về liên kết hóa học", "Hóa trị và công thức hóa học"]
  },

  // --- HÓA HỌC 8 (KHTN 8) ---
  {
    id: "ch8_c1", subject: "Hóa học", grade: "8", domain: SCIENCE_DOMAINS.MATTER,
    name: "Phản ứng hóa học",
    lessons: ["Biến đổi vật lí và biến đổi hóa học", "Phản ứng hóa học", "Định luật bảo toàn khối lượng", "Phương trình hóa học"]
  },
  {
    id: "ch8_c2", subject: "Hóa học", grade: "8", domain: SCIENCE_DOMAINS.MATTER,
    name: "Tính toán hóa học",
    lessons: ["Mol và tỉ khối của chất khí", "Tính theo phương trình hóa học", "Nồng độ dung dịch"]
  },
  {
    id: "ch8_c3", subject: "Hóa học", grade: "8", domain: SCIENCE_DOMAINS.MATTER,
    name: "Các loại hợp chất vô cơ",
    lessons: ["Acid", "Base", "Oxide", "Muối", "Phân bón hóa học"]
  },

  // --- HÓA HỌC 9 (KHTN 9) ---
  {
    id: "ch9_c1", subject: "Hóa học", grade: "9", domain: SCIENCE_DOMAINS.MATTER,
    name: "Kim loại",
    lessons: ["Tính chất chung của kim loại", "Dãy hoạt động hóa học của kim loại", "Tách kim loại và việc sử dụng hợp kim"]
  },
  {
    id: "ch9_c2", subject: "Hóa học", grade: "9", domain: SCIENCE_DOMAINS.MATTER,
    name: "Phi kim",
    lessons: ["Tính chất của phi kim", "Sơ lược về nhóm Halogen"]
  },
  {
    id: "ch9_c3", subject: "Hóa học", grade: "9", domain: SCIENCE_DOMAINS.MATTER,
    name: "Hợp chất hữu cơ",
    lessons: ["Hợp chất hữu cơ và hóa học hữu cơ", "Cấu tạo phân tử hợp chất hữu cơ", "Alkane", "Alkene"]
  },
  {
    id: "ch9_c4", subject: "Hóa học", grade: "9", domain: SCIENCE_DOMAINS.MATTER,
    name: "Dẫn xuất Hydrocarbon",
    lessons: ["Ethylic alcohol", "Acetic acid", "Ester - Lipid", "Carbohydrate (Glucose, Saccharose, Tinh bột, Cellulose)", "Protein và Polymer"]
  }
];

export const COGNITIVE_LEVELS = ["Biết", "Hiểu", "Vận dụng"];
export const QUESTION_TYPES = ["trắc nghiệm", "tự luận"];
