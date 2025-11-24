
import React, { useState, useMemo, useEffect } from 'react';
import { CURRICULUM } from '../constants';
import { SubjectType, GradeType } from '../types';
import { ChevronDown, ChevronRight, CheckSquare, Square, Calculator, Shapes, BarChart3, Check, Zap, FlaskConical, BookOpen } from 'lucide-react';

interface TopicSelectorProps {
  subject: SubjectType;
  grade: GradeType;
  selectedMap: Record<string, string[]>; // { chapterId: [lessonNames] }
  onChange: (newMap: Record<string, string[]>) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ subject, grade, selectedMap, onChange }) => {
  const [activeDomain, setActiveDomain] = useState<string>("");
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // 1. Filter Curriculum by Subject and Grade
  const filteredCurriculum = useMemo(() => {
    return CURRICULUM.filter(c => c.subject === subject && c.grade === grade);
  }, [subject, grade]);

  // 2. Extract unique domains for Tabs
  const availableDomains = useMemo(() => {
    const domains = Array.from(new Set(filteredCurriculum.map(c => c.domain)));
    return domains;
  }, [filteredCurriculum]);

  // 3. Set initial active domain
  useEffect(() => {
    if (availableDomains.length > 0 && !availableDomains.includes(activeDomain)) {
        setActiveDomain(availableDomains[0]);
    }
  }, [availableDomains]);

  // 4. Get chapters for current active domain
  const currentChapters = useMemo(() => {
    return filteredCurriculum.filter(c => c.domain === activeDomain);
  }, [filteredCurriculum, activeDomain]);

  const toggleExpand = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleChapterToggle = (chapterId: string, allLessons: string[]) => {
    const currentSelection = selectedMap[chapterId] || [];
    const isAllSelected = currentSelection.length === allLessons.length;
    
    const newMap = { ...selectedMap };
    if (isAllSelected) {
      delete newMap[chapterId];
    } else {
      newMap[chapterId] = [...allLessons];
    }
    onChange(newMap);
  };

  const handleLessonToggle = (chapterId: string, lesson: string) => {
    const currentSelection = selectedMap[chapterId] || [];
    const exists = currentSelection.includes(lesson);
    
    let newSelection = [];
    if (exists) {
      newSelection = currentSelection.filter(l => l !== lesson);
    } else {
      newSelection = [...currentSelection, lesson];
    }

    const newMap = { ...selectedMap };
    if (newSelection.length === 0) {
      delete newMap[chapterId];
    } else {
      newMap[chapterId] = newSelection;
    }
    onChange(newMap);
  };

  const selectAllInDomain = () => {
    const newMap = { ...selectedMap };
    currentChapters.forEach(ch => {
      newMap[ch.id] = [...ch.lessons];
    });
    onChange(newMap);
  };

  const deselectAllInDomain = () => {
    const newMap = { ...selectedMap };
    currentChapters.forEach(ch => {
      delete newMap[ch.id];
    });
    onChange(newMap);
  };

  const getDomainIcon = (domain: string) => {
    // Basic heuristic for icons
    if (domain.includes("Số") || domain.includes("Đại số")) return <Calculator size={14} />;
    if (domain.includes("Hình")) return <Shapes size={14} />;
    if (domain.includes("Thống kê")) return <BarChart3 size={14} />;
    if (domain.includes("Điện") || domain.includes("Cơ")) return <Zap size={14} />;
    if (domain.includes("Chất")) return <FlaskConical size={14} />;
    return <BookOpen size={14} />;
  };

  if (filteredCurriculum.length === 0) {
      return (
          <div className="p-8 text-center bg-white border border-gray-200 rounded-lg text-gray-500 text-sm">
              Chưa cập nhật dữ liệu chương trình cho {subject} {grade}.
          </div>
      )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200">
         <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase flex justify-between items-center">
            <span>Nội dung ({subject} {grade})</span>
            <div className="flex gap-2">
               <button onClick={selectAllInDomain} className="text-indigo-600 hover:text-indigo-800 text-[10px] font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Chọn hết</button>
               <button onClick={deselectAllInDomain} className="text-gray-500 hover:text-gray-700 text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-gray-200">Bỏ chọn</button>
            </div>
         </div>
         
         {/* Tabs */}
         <div className="flex overflow-x-auto no-scrollbar">
           {availableDomains.map((domain) => (
             <button
               key={domain}
               onClick={() => setActiveDomain(domain)}
               className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                 activeDomain === domain
                   ? 'border-indigo-600 text-indigo-700 bg-white'
                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
               }`}
             >
               {getDomainIcon(domain)}
               {domain.replace(" và ", " & ")}
             </button>
           ))}
         </div>
      </div>

      <div className="h-64 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-gray-50/30">
        {currentChapters.map(chapter => {
          const selectedLessons = selectedMap[chapter.id] || [];
          const isFull = selectedLessons.length === chapter.lessons.length;
          const isPartial = selectedLessons.length > 0 && !isFull;
          const isExpanded = expandedChapters[chapter.id];

          return (
            <div key={chapter.id} className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
              {/* Chapter Header */}
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 transition-colors">
                <button 
                  onClick={() => toggleExpand(chapter.id)} 
                  className="text-gray-400 hover:text-indigo-600 p-1"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                <div 
                  onClick={() => handleChapterToggle(chapter.id, chapter.lessons)}
                  className="flex-1 flex items-center gap-2 cursor-pointer select-none"
                >
                    <div className={`${isFull || isPartial ? 'text-indigo-600' : 'text-gray-300'}`}>
                        {isFull ? <CheckSquare size={16} /> : (isPartial ? <div className="w-4 h-4 bg-indigo-600 rounded-[2px] flex items-center justify-center"><div className="w-2 h-0.5 bg-white"></div></div> : <Square size={16} />)}
                    </div>
                    <span className={`text-sm font-semibold ${isFull || isPartial ? 'text-indigo-900' : 'text-gray-600'}`}>
                        {chapter.name}
                    </span>
                </div>

                <div className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-mono">
                    {selectedLessons.length}/{chapter.lessons.length}
                </div>
              </div>

              {/* Lesson List */}
              {isExpanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {chapter.lessons.map(lesson => {
                    const isSelected = selectedLessons.includes(lesson);
                    return (
                      <div 
                        key={lesson} 
                        onClick={() => handleLessonToggle(chapter.id, lesson)}
                        className={`flex items-start gap-2 cursor-pointer py-2 px-3 pl-9 transition-colors ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}
                      >
                        <div className={`mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-gray-300'}`}>
                           {isSelected ? <Check size={14} strokeWidth={3} /> : <div className="w-3.5 h-3.5 border border-gray-300 rounded-[3px]"></div>}
                        </div>
                        <span className={`text-xs leading-snug ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {lesson}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
