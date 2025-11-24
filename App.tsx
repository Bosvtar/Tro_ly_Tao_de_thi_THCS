
import React, { useState, useEffect } from 'react';
import { CURRICULUM, COGNITIVE_LEVELS, SUBJECTS, GRADES } from './constants';
import { ExamConfig, ExamData, GeneratedQuestion, QuestionFormat, DifficultyConfig, CognitiveLevel, SelectedTopic, SubjectType, GradeType } from './types';
import { generateExamQuestions } from './services/geminiService';
import { QuestionCard } from './components/QuestionCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TopicSelector } from './components/TopicSelector';
import { SettingsModal } from './components/SettingsModal';
import { hasApiKey } from './lib/apiKeyStorage';
import { Calculator, Sparkles, AlertCircle, FileText, Settings, RefreshCw, Layers, Zap, Printer, ArrowLeft, FlaskConical } from 'lucide-react';

const App: React.FC = () => {
  // --- Global Selection State ---
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('Toán');
  const [selectedGrade, setSelectedGrade] = useState<GradeType>('6');

  // Config State
  const [mode, setMode] = useState<'quick' | 'full'>('full');
  
  // Selection State: { chapterId: [lessonNames] }
  const [selectedTopicsMap, setSelectedTopicsMap] = useState<Record<string, string[]>>({});

  // Reset topics when subject/grade changes
  useEffect(() => {
    setSelectedTopicsMap({});
  }, [selectedSubject, selectedGrade]);

  // Difficulty State
  const [diffMode, setDiffMode] = useState<'fixed' | 'ratio'>('fixed');
  const [fixedLevel, setFixedLevel] = useState<CognitiveLevel>('Hiểu');
  const [ratioBiet, setRatioBiet] = useState(30);
  const [ratioHieu, setRatioHieu] = useState(40);
  // ratioVandung is calculated automatically

  // Quantities for Full Mode
  const [qtyMCQ, setQtyMCQ] = useState(4);
  const [qtyShort, setQtyShort] = useState(2);
  const [qtyEssay, setQtyEssay] = useState(1);

  // Quick Mode Selection
  const [quickType, setQuickType] = useState<QuestionFormat>('mcq');
  const [quickCount, setQuickCount] = useState(5);

  // App Logic State
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Debug: Log showSettings changes
  useEffect(() => {
    console.log('App: showSettings changed to:', showSettings);
    console.log('App: Current step:', step);
  }, [showSettings, step]);

  const getVandungRatio = () => {
    const remaining = 100 - ratioBiet - ratioHieu;
    return remaining > 0 ? remaining : 0;
  };

  const handleStartConfiguration = () => {
    // Auto-select the first chapter of the subject/grade to prevent empty state
    const firstChapter = CURRICULUM.find(c => c.subject === selectedSubject && c.grade === selectedGrade);
    if (firstChapter) {
        setSelectedTopicsMap({
            [firstChapter.id]: [...firstChapter.lessons]
        });
    }
    setStep('configure');
  };

  const generateExam = async () => {
    // Check API key first
    if (!hasApiKey()) {
        setError("Vui lòng cài đặt API key trước khi tạo đề thi. Click nút ⚙️ Cài đặt ở góc trên bên phải.");
        setShowSettings(true);
        return;
    }

    setLoading(true);
    setError(null);
    setExamData(null);

    // Validate Selection
    if (Object.keys(selectedTopicsMap).length === 0) {
        setError("Vui lòng chọn ít nhất 1 bài học.");
        setLoading(false);
        return;
    }

    if (diffMode === 'ratio' && (ratioBiet + ratioHieu > 100)) {
        setError("Tổng tỷ lệ Biết + Hiểu không được vượt quá 100%.");
        setLoading(false);
        return;
    }

    // Convert map to API format
    const selectedTopicsList: SelectedTopic[] = Object.keys(selectedTopicsMap).map(cId => {
        const chapter = CURRICULUM.find(c => c.id === cId);
        return {
            chapterName: chapter ? chapter.name : "",
            lessons: selectedTopicsMap[cId]
        };
    });

    // Calculate effective counts
    let configCounts = { mcq: 0, short: 0, essay: 0 };
    if (mode === 'full') {
        configCounts = { mcq: qtyMCQ, short: qtyShort, essay: qtyEssay };
    } else {
        if (quickType === 'mcq') configCounts.mcq = quickCount;
        if (quickType === 'short') configCounts.short = quickCount;
        if (quickType === 'essay') configCounts.essay = quickCount;
    }

    const totalQ = configCounts.mcq + configCounts.short + configCounts.essay;
    if (totalQ === 0) {
        setError("Vui lòng chọn ít nhất 1 câu hỏi.");
        setLoading(false);
        return;
    }

    // Difficulty Config
    const difficultyConfig: DifficultyConfig = {
        mode: diffMode,
        fixedLevel: diffMode === 'fixed' ? fixedLevel : undefined,
        ratio: diffMode === 'ratio' ? { biet: ratioBiet, hieu: ratioHieu, vandung: getVandungRatio() } : { biet:0, hieu:0, vandung:0 }
    };

    try {
      const config: ExamConfig = {
        subject: selectedSubject,
        grade: selectedGrade,
        mode,
        topics: selectedTopicsList,
        difficultyConfig,
        counts: configCounts
      };

      const questions = await generateExamQuestions(config);
      
      const examCode = Math.floor(100 + Math.random() * 900).toString();
      // Generate title based on first selected chapter
      const firstChapName = selectedTopicsList[0]?.chapterName || "Tổng hợp";
      const titleSuffix = selectedTopicsList.length > 1 ? " (và các chương khác)" : "";

      setExamData({
        id: examCode,
        subject: selectedSubject,
        grade: selectedGrade,
        title: `Đề kiểm tra: ${firstChapName}${titleSuffix}`,
        questions,
        createdAt: Date.now()
      });

    } catch (err) {
      console.error(err);
      setError("Hệ thống đang bận hoặc quá tải. Vui lòng thử lại sau giây lát.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    if (!examData) return;

    // Build HTML content for Word
    let bodyContent = '';

    // Header
    bodyContent += `
        <div style="font-family: 'Times New Roman', serif; margin-bottom: 20px;">
            <table style="width: 100%; border: none; margin-bottom: 20px;">
                <tr>
                    <td style="text-align: center; width: 40%; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold;">Phòng GD&ĐT ........................</p>
                        <p style="margin: 0; font-weight: bold;">Trường THCS ........................</p>
                    </td>
                    <td style="text-align: center; width: 60%; vertical-align: top;">
                        <h2 style="margin: 0; font-size: 16pt; text-transform: uppercase;">ĐỀ KIỂM TRA ${examData.subject.toUpperCase()} ${examData.grade}</h2>
                        <p style="margin: 5px 0; font-style: italic;">${examData.title}</p>
                        <p style="margin: 0;">Thời gian: 45 phút - Mã đề: ${examData.id}</p>
                    </td>
                </tr>
            </table>
            <p style="margin-bottom: 20px;"><b>Họ và tên:</b> .............................................................. <b>Lớp:</b> ..........</p>
    `;

    // Process questions
    let qIndex = 1;
    
    // Part 1: MCQ
    const mcqs = examData.questions.filter(q => q.type === 'mcq');
    if (mcqs.length > 0) {
        bodyContent += `<h3 style="margin-top: 15px; margin-bottom: 10px;">Phần I. TRẮC NGHIỆM</h3>`;
        mcqs.forEach((q) => {
            bodyContent += `<div style="margin-bottom: 10px;"><b>Câu ${qIndex++}:</b> ${q.question}</div>`;
            if (q.options) {
                bodyContent += `<table style="width: 100%; margin-bottom: 10px;"><tr>`;
                q.options.forEach((opt, idx) => {
                    const label = String.fromCharCode(65 + idx);
                    bodyContent += `<td style="width: 25%; padding: 5px;"><b>${label}.</b> ${opt}</td>`;
                });
                bodyContent += `</tr></table>`;
            }
        });
    }

    // Part 2: Short
    const shorts = examData.questions.filter(q => q.type === 'short');
    if (shorts.length > 0) {
        bodyContent += `<h3 style="margin-top: 15px; margin-bottom: 10px;">Phần II. TRẢ LỜI NGẮN</h3>`;
        shorts.forEach((q) => {
            bodyContent += `<div style="margin-bottom: 15px;"><b>Câu ${qIndex++}:</b> ${q.question} <br/><br/>Trả lời: .......................................</div>`;
        });
    }

    // Part 3: Essay
    const essays = examData.questions.filter(q => q.type === 'essay');
    if (essays.length > 0) {
        bodyContent += `<h3 style="margin-top: 15px; margin-bottom: 10px;">Phần III. TỰ LUẬN</h3>`;
        essays.forEach((q) => {
            bodyContent += `<div style="margin-bottom: 30px;"><b>Câu ${qIndex++} (${q.points} điểm):</b> ${q.question} <br/><br/><br/><br/><br/></div>`;
        });
    }

    // Solutions (if needed, usually teachers want this at the end)
    bodyContent += `<br/><hr/><h3 style="text-align: center;">HƯỚNG DẪN GIẢI CHI TIẾT</h3>`;
    examData.questions.forEach((q, i) => {
         bodyContent += `<div style="margin-bottom: 10px;"><b>Câu ${i+1}:</b> Đáp án: <b>${q.answer}</b>. <br/><i>HD: ${q.solution}</i></div>`;
    });

    bodyContent += `</div>`;

    const htmlString = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${examData.title}</title>
        </head>
        <body>${bodyContent}</body>
        </html>
    `;

    const blob = new Blob(['\ufeff', htmlString], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `De_${examData.subject}_${examData.grade}_${examData.id}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuestionUpdate = (updatedQ: GeneratedQuestion, index: number) => {
    if (!examData) return;
    const newQuestions = [...examData.questions];
    newQuestions[index] = updatedQ;
    setExamData({ ...examData, questions: newQuestions });
  };

  // --- RENDER: SELECTION SCREEN ---
  if (step === 'select') {
    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
                {/* Settings Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Settings button clicked (select screen), opening modal');
                        setShowSettings(true);
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-lg transition-colors z-10 ${
                        hasApiKey() 
                            ? 'text-gray-400 hover:bg-gray-100 hover:text-indigo-600' 
                            : 'text-orange-500 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                    title={hasApiKey() ? 'Cài đặt API Key' : 'Chưa có API Key - Click để cài đặt'}
                >
                    <Settings size={20} />
                </button>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Trợ lý tạo đề thi AI</h1>
                    <p className="text-gray-500">Chương trình Giáo dục phổ thông 2018</p>
                    {!hasApiKey() && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-700">
                                <AlertCircle className="inline mr-1" size={14} />
                                Vui lòng cài đặt API Key để sử dụng ứng dụng
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Subject Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">1. Chọn môn học</label>
                        <div className="grid grid-cols-3 gap-4">
                            {SUBJECTS.map((sub) => {
                                const Icon = sub.id === 'Toán' ? Calculator : (sub.id === 'Vật lí' ? Zap : FlaskConical);
                                return (
                                    <button
                                        key={sub.id}
                                        onClick={() => setSelectedSubject(sub.id)}
                                        className={`relative overflow-hidden rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200 ${
                                            selectedSubject === sub.id
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md scale-105'
                                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        <Icon size={28} />
                                        <span className="font-bold">{sub.name}</span>
                                        {selectedSubject === sub.id && (
                                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-indigo-600" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grade Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">2. Chọn lớp</label>
                        <div className="flex justify-between gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                            {GRADES.map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setSelectedGrade(g)}
                                    className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all ${
                                        selectedGrade === g
                                        ? 'bg-white shadow text-indigo-600 ring-2 ring-indigo-100'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    Lớp {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleStartConfiguration}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 active:translate-y-0 text-lg flex items-center justify-center gap-2"
                    >
                        Tiếp tục <Settings size={20} />
                    </button>
                </div>
            </div>
        </div>
        
        {/* Settings Modal - Also render on selection screen */}
        <SettingsModal 
          isOpen={showSettings}
          onClose={() => {
            console.log('App: Closing settings modal (selection screen)');
            setShowSettings(false);
          }}
          onApiKeySaved={() => {
            setError(null);
          }}
        />
        </>
    );
  }

  // --- RENDER: MAIN APP ---
  return (
    <div className="min-h-screen pb-20 print:pb-0 print:bg-white bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20 print:hidden border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setStep('select')}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors"
                    title="Quay lại chọn môn"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md shadow-indigo-200">
                    {selectedSubject === 'Toán' ? <Calculator size={20} /> : (selectedSubject === 'Vật lí' ? <Zap size={20} /> : <FlaskConical size={20} />)}
                </div>
                <div>
                    <h1 className="text-lg font-extrabold text-gray-900 leading-none">AI Exam Gen</h1>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{selectedSubject} {selectedGrade} - GDPT 2018</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {examData && (
                    <>
                        <button 
                            onClick={handleExportWord}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold hover:bg-blue-700 transition-all shadow hover:shadow-lg active:scale-95 uppercase"
                        >
                            <FileText size={16} /> Word
                        </button>
                        <button 
                            onClick={handlePrint}
                            className="bg-gray-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold hover:bg-black transition-all shadow hover:shadow-lg active:scale-95 uppercase"
                        >
                            <Printer size={16} /> PDF/In
                        </button>
                    </>
                )}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Settings button clicked, opening modal');
                        setShowSettings(true);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                        hasApiKey() 
                            ? 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600' 
                            : 'text-orange-500 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                    title={hasApiKey() ? 'Cài đặt API Key' : 'Chưa có API Key - Click để cài đặt'}
                >
                    <Settings size={20} />
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Configuration */}
            <div className="lg:col-span-4 xl:col-span-3 print:hidden sidebar">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Settings className="text-indigo-600" size={20} /> Cấu hình đề thi
                    </h2>

                    {/* Mode Switch */}
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                        <button 
                            onClick={() => setMode('full')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'full' ? 'bg-white shadow-sm text-indigo-700 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Layers size={14} /> Đề chuẩn
                        </button>
                        <button 
                            onClick={() => setMode('quick')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'quick' ? 'bg-white shadow-sm text-indigo-700 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Zap size={14} /> Đề nhanh
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Topic Selection */}
                        <TopicSelector 
                            subject={selectedSubject}
                            grade={selectedGrade}
                            selectedMap={selectedTopicsMap} 
                            onChange={setSelectedTopicsMap} 
                        />

                        {/* Difficulty Selection */}
                        <div className="border-t border-gray-100 pt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mức độ tư duy</label>
                            
                            <div className="flex gap-4 mb-3 text-xs">
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input 
                                        type="radio" name="diffMode" 
                                        checked={diffMode === 'fixed'} 
                                        onChange={() => setDiffMode('fixed')}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>Cố định</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input 
                                        type="radio" name="diffMode" 
                                        checked={diffMode === 'ratio'} 
                                        onChange={() => setDiffMode('ratio')}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>Theo tỷ lệ</span>
                                </label>
                            </div>

                            {diffMode === 'fixed' ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {COGNITIVE_LEVELS.map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => setFixedLevel(lvl as CognitiveLevel)}
                                            className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                                                fixedLevel === lvl
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-green-700 font-medium">Biết: {ratioBiet}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="100" step="10"
                                            value={ratioBiet}
                                            onChange={(e) => setRatioBiet(Number(e.target.value))}
                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-blue-700 font-medium">Hiểu: {ratioHieu}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="100" step="10"
                                            value={ratioHieu}
                                            onChange={(e) => setRatioHieu(Number(e.target.value))}
                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-gray-200">
                                        <span className="text-orange-700">Vận dụng:</span>
                                        <span className={`${getVandungRatio() < 0 ? 'text-red-500' : 'text-orange-700'}`}>
                                            {getVandungRatio()}%
                                        </span>
                                    </div>
                                    {getVandungRatio() < 0 && (
                                        <p className="text-[10px] text-red-500 mt-1">Tổng tỷ lệ đang vượt quá 100%!</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quantity Config */}
                        <div className="border-t border-gray-100 pt-4">
                        {mode === 'full' ? (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cấu trúc đề</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700">Trắc nghiệm</label>
                                        <input 
                                            type="number" min="0" max="40"
                                            value={qtyMCQ}
                                            onChange={(e) => setQtyMCQ(Number(e.target.value))}
                                            className="w-16 text-center border border-gray-300 rounded-md p-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700">Trả lời ngắn</label>
                                        <input 
                                            type="number" min="0" max="20"
                                            value={qtyShort}
                                            onChange={(e) => setQtyShort(Number(e.target.value))}
                                            className="w-16 text-center border border-gray-300 rounded-md p-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700">Tự luận</label>
                                        <input 
                                            type="number" min="0" max="10"
                                            value={qtyEssay}
                                            onChange={(e) => setQtyEssay(Number(e.target.value))}
                                            className="w-16 text-center border border-gray-300 rounded-md p-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn dạng bài</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button 
                                            onClick={() => setQuickType('mcq')}
                                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${quickType === 'mcq' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <span className="text-sm font-medium">Trắc nghiệm</span>
                                            {quickType === 'mcq' && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                                        </button>
                                        <button 
                                            onClick={() => setQuickType('short')}
                                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${quickType === 'short' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <span className="text-sm font-medium">Trả lời ngắn</span>
                                            {quickType === 'short' && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                                        </button>
                                        <button 
                                            onClick={() => setQuickType('essay')}
                                            className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${quickType === 'essay' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <span className="text-sm font-medium">Tự luận</span>
                                            {quickType === 'essay' && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng câu</label>
                                    <input 
                                        type="number" min="1" max="50"
                                        value={quickCount}
                                        onChange={(e) => setQuickCount(Number(e.target.value))}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        )}
                        </div>

                        <button
                            onClick={generateExam}
                            disabled={loading || (diffMode === 'ratio' && ratioBiet + ratioHieu > 100)}
                            className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 mt-2 ${
                                loading || (diffMode === 'ratio' && ratioBiet + ratioHieu > 100)
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-98'
                            }`}
                        >
                            {loading ? 'Đang khởi tạo...' : 'Tạo đề thi ngay'}
                            {!loading && <Sparkles size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 xl:col-span-9">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3 mb-6 print:hidden animate-fade-in">
                        <AlertCircle className="mt-0.5 shrink-0" size={20} />
                        <div>
                            <p className="font-bold">Đã xảy ra lỗi</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {loading && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <LoadingSpinner />
                    <p className="text-gray-500 mt-4 text-sm animate-pulse">AI đang soạn thảo đề thi {selectedSubject} {selectedGrade}...</p>
                  </div>
                )}

                {!examData && !loading && !error && (
                    <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300 print:hidden flex flex-col items-center justify-center h-full">
                        <div className="bg-indigo-50 p-6 rounded-full mb-4">
                            {selectedSubject === 'Toán' ? <Calculator className="text-indigo-300" size={48} /> : (selectedSubject === 'Vật lí' ? <Zap className="text-indigo-300" size={48} /> : <FlaskConical className="text-indigo-300" size={48} />)}
                        </div>
                        <h3 className="text-gray-900 font-bold text-xl mb-2">Chưa có đề thi nào</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">Vui lòng chọn bài học, cấu hình mức độ và bấm nút "Tạo đề thi ngay".</p>
                    </div>
                )}

                {examData && !loading && (
                    <div className="animate-fade-in print:w-full">
                        {/* Exam Paper Controls */}
                        <div className="bg-indigo-900 text-white p-4 rounded-t-xl flex justify-between items-center print:hidden shadow-lg controls">
                            <div className="flex items-center gap-3">
                                <span className="font-mono bg-white/10 px-3 py-1 rounded text-sm font-medium border border-white/20">Mã: {examData.id}</span>
                                <span className="text-sm font-light text-indigo-100 border-l border-indigo-700 pl-3 hidden sm:inline">{examData.questions.length} câu hỏi</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-white text-indigo-200 transition-colors select-none">
                                    <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" name="toggle" id="toggle" checked={showSolutions} onChange={(e) => setShowSolutions(e.target.checked)} className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer left-1 top-1 transition-transform duration-200 ease-in-out checked:translate-x-full checked:border-indigo-600"/>
                                        <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${showSolutions ? 'bg-indigo-500' : 'bg-gray-700'}`}></label>
                                    </div>
                                    <span className="hidden sm:inline">Hiện đáp án</span>
                                </label>
                                <div className="h-6 w-px bg-indigo-700"></div>
                                <button onClick={generateExam} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-indigo-200 hover:text-white" title="Tạo lại đề mới">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>

                        {/* The Actual Paper */}
                        <div className="bg-white p-10 shadow-xl min-h-[800px] print:shadow-none print:p-0 print:w-full print:min-h-0 rounded-b-xl">
                            
                            {/* Exam Header */}
                            <div className="border-b-2 border-black pb-4 mb-8 hidden print:block">
                                <div className="flex justify-between items-start">
                                    <div className="text-center w-1/3">
                                        <h3 className="uppercase font-bold text-sm leading-tight">Phòng GD&ĐT ........................</h3>
                                        <h4 className="font-bold text-sm mt-1">Trường THCS ........................</h4>
                                    </div>
                                    <div className="text-center w-1/3">
                                        <h2 className="uppercase font-bold text-xl">ĐỀ KIỂM TRA {examData.subject.toUpperCase()} {examData.grade}</h2>
                                        <p className="italic text-sm mt-1">{examData.title.replace('Đề kiểm tra: ', 'Chủ đề: ')}</p>
                                        <p className="italic text-sm">Thời gian làm bài: 45 phút</p>
                                    </div>
                                    <div className="w-1/3 flex justify-end">
                                        <div className="border border-black p-2 min-w-[100px] text-center">
                                            <span className="block text-[10px] font-bold tracking-wider">MÃ ĐỀ THI</span>
                                            <span className="text-xl font-mono font-bold">{examData.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex text-sm">
                                    <div className="w-1/2">Họ và tên: ............................................................................</div>
                                    <div className="w-1/2 text-right">Lớp: ...........</div>
                                </div>
                            </div>

                            {/* Section: MCQ */}
                            {examData.questions.some(q => q.type === 'mcq') && (
                                <div className="mb-8 section-mcq">
                                    <h3 className="font-bold text-lg uppercase mb-4 text-indigo-900 print:text-black border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <span className="print:hidden w-1 h-6 bg-indigo-600 rounded-full"></span>
                                        Phần I. Trắc nghiệm
                                        <span className="text-sm font-normal normal-case text-gray-500 print:hidden ml-auto">Chọn đáp án đúng nhất</span>
                                    </h3>
                                    {examData.questions.filter(q => q.type === 'mcq').map((q, idx) => (
                                        <QuestionCard 
                                            key={q.id} 
                                            data={q} 
                                            index={idx} 
                                            showSolution={showSolutions} 
                                            onUpdate={(updated) => handleQuestionUpdate(updated, idx)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Section: Short Answer */}
                            {examData.questions.some(q => q.type === 'short') && (
                                <div className="mb-8 section-short page-break-inside-avoid">
                                    <h3 className="font-bold text-lg uppercase mb-4 text-indigo-900 print:text-black border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <span className="print:hidden w-1 h-6 bg-indigo-600 rounded-full"></span>
                                        Phần II. Trắc nghiệm trả lời ngắn
                                    </h3>
                                    <p className="italic text-sm text-gray-600 mb-4 print:text-black print:mb-2 print:text-xs">
                                        * Học sinh ghi kết quả (số hoặc biểu thức tối giản) vào ô trống.
                                    </p>
                                    {examData.questions.filter(q => q.type === 'short').map((q, idx) => (
                                        <QuestionCard 
                                            key={q.id} 
                                            data={q} 
                                            index={idx + examData.questions.filter(x => x.type === 'mcq').length} 
                                            showSolution={showSolutions} 
                                            onUpdate={(updated) => handleQuestionUpdate(updated, idx + examData.questions.filter(x => x.type === 'mcq').length)}
                                        />
                                    ))}
                                </div>
                            )}

                             {/* Section: Essay */}
                             {examData.questions.some(q => q.type === 'essay') && (
                                <div className="mb-8 section-essay page-break-inside-avoid">
                                    <h3 className="font-bold text-lg uppercase mb-4 text-indigo-900 print:text-black border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <span className="print:hidden w-1 h-6 bg-indigo-600 rounded-full"></span>
                                        Phần III. Tự luận
                                    </h3>
                                    {examData.questions.filter(q => q.type === 'essay').map((q, idx) => (
                                        <QuestionCard 
                                            key={q.id} 
                                            data={q} 
                                            index={idx + examData.questions.filter(x => x.type !== 'essay').length} 
                                            showSolution={showSolutions} 
                                            onUpdate={(updated) => handleQuestionUpdate(updated, idx + examData.questions.filter(x => x.type !== 'essay').length)}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="text-center mt-12 pt-4 border-t border-gray-300 hidden print:block text-sm italic">
                                --- HẾT ---
                                <div className="mt-2 text-[10px] text-gray-400">Đề thi được tạo tự động bởi AI Exam Gen</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => {
          console.log('App: Closing settings modal');
          setShowSettings(false);
        }}
        onApiKeySaved={() => {
          setError(null); // Clear any API key related errors
        }}
      />
      
      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #687280;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #4f46e5;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db; 
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af; 
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
