
import React, { useState } from 'react';
import { AppState, Person } from './types';
import { parseExcelFile } from './services/excelService';
import IDCard from './components/IDCard';
import { Upload, Download, FileSpreadsheet, Printer, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [people, setPeople] = useState<Person[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Excel verilerini kart alanlarına akıllıca eşleştiren fonksiyon.
   * Gemi listelerinde sıkça kullanılan hem Türkçe hem İngilizce terimleri tarar.
   */
  const autoMapData = (rawRows: any[]): Person[] => {
    if (rawRows.length === 0) return [];
    const columns = Object.keys(rawRows[0]);

    const findValue = (row: any, regex: RegExp, defaultValue: string = '') => {
      const colName = columns.find(c => regex.test(c));
      return colName ? String(row[colName] || '').trim() : defaultValue;
    };

    // Bazı bilgiler (Gemi Adı, Bayrak vb.) tüm liste için aynı olabilir.
    // Eğer satırda boşsa ilk satırdaki değeri varsayılan alalım.
    const firstRow = rawRows[0];
    const globalVessel = findValue(firstRow, /Vessel|Gemi|Ship|Name of Ship/i, 'HEBRIDEAN SKY');
    const globalFlag = findValue(firstRow, /Flag|Bandıra|Bayrak|Registry/i, 'BAHAMAS');
    const globalArrival = findValue(firstRow, /Arrival|Geliş|Gelis|ETA/i, '12/10/2024');
    const globalDeparture = findValue(firstRow, /Departure|Gidiş|Gidis|Çıkış|Cikis|ETD/i, '13/10/2024');

    return rawRows.map((row, idx) => {
      const pNo = findValue(row, /Passport|Pasaport|Pass|PPT|No/i);
      
      return {
        id: String(idx),
        firstName: findValue(row, /Name|Adı|Ad$|First|Given/i),
        lastName: findValue(row, /Surname|Soyadı|Soyad$|Last/i),
        role: findValue(row, /Role|Statü|Görevi|Type|Crew|Guest|Statu/i, 'GUEST'),
        barcodeValue: pNo || `ID${1000 + idx}`, // Barkod için öncelik Pasaport No
        nationality: findValue(row, /Nationality|Uyruk|Uyr$|Nat|Country/i),
        passportNo: pNo,
        cabinNo: findValue(row, /Cabin|Kabin|Room|Stateroom/i, '-'),
        arrivalDate: findValue(row, /Arrival|Geliş|Gelis|ETA/i, globalArrival),
        departureDate: findValue(row, /Departure|Gidiş|Gidis|Çıkış|Cikis|ETD/i, globalDeparture),
        flag: findValue(row, /Flag|Bandıra|Bayrak|Registry/i, globalFlag),
        vesselName: findValue(row, /Vessel|Gemi|Ship|Name of Ship/i, globalVessel),
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await parseExcelFile(file);
      const mappedPeople = autoMapData(data);
      setPeople(mappedPeople);
      
      // Kullanıcı deneyimi için kısa bir yükleniyor animasyonu
      setTimeout(() => {
        setState(AppState.PREVIEW);
        setIsProcessing(false);
      }, 1200);
    } catch (err) {
      alert("Hata: Excel dosyası okunamadı veya format uyumsuz. Lütfen geçerli bir liste yükleyin.");
      setIsProcessing(false);
    }
  };

  const downloadAllAsPDF = async () => {
    setIsGenerating(true);
    setProgress(0);
    const pdf = new jsPDF('l', 'mm', 'a4');
    const cardElements = document.querySelectorAll('.id-card-render');
    
    for (let i = 0; i < cardElements.length; i++) {
      if (i > 0) pdf.addPage('a4', 'l');

      const card = cardElements[i] as HTMLElement;
      const canvas = await html2canvas(card, { 
        scale: 2.5, // Daha net barkodlar için ölçeği artırdık
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Kart boyutları 210x148 (A5 yatay), A4 sayfaya tam ortala
      const imgWidth = 210;
      const imgHeight = 148;
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      setProgress(Math.round(((i + 1) / cardElements.length) * 100));
    }
    
    pdf.save(`Landing_Cards_${new Date().toLocaleDateString('tr-TR').replace(/\//g, '-')}.pdf`);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Üst Menü */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md no-print border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">ID AUTOMATOR</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Galataport Istanbul Landing Card System</p>
            </div>
          </div>
          {state === AppState.PREVIEW && (
            <button 
              onClick={() => setState(AppState.UPLOAD)} 
              className="flex items-center gap-2 text-xs bg-slate-800 px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-all font-bold border border-slate-700 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Yeni Liste Yükle
            </button>
          )}
        </div>
      </nav>

      <main className="p-6 max-w-[1200px] mx-auto">
        {/* Yükleme Ekranı */}
        {state === AppState.UPLOAD && (
          <div className="mt-20 max-w-xl mx-auto text-center bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 transition-all">
            {isProcessing ? (
              <div className="flex flex-col items-center py-10">
                <div className="relative">
                  <Loader2 className="w-20 h-20 text-blue-600 animate-spin mb-8" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-200 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-slate-800">Veriler İşleniyor</h2>
                <p className="text-slate-500 mt-3 font-medium text-lg">Excel sütunları otomatik eşleştiriliyor...</p>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100/50">
                  <FileSpreadsheet className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Manifesto Yükle</h2>
                <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                  Yolcu veya mürettebat listenizi (.xlsx) seçin. <br/>
                  Sistem her kullanıcı için otomatik kart oluşturur.
                </p>
                
                <label className="cursor-pointer group relative flex flex-col items-center gap-4 bg-slate-900 text-white px-14 py-14 rounded-[3rem] font-bold hover:bg-blue-600 transition-all shadow-2xl active:scale-95 border-b-8 border-slate-950 hover:border-blue-800">
                  <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
                  <Upload className="w-14 h-14 mb-2 group-hover:-translate-y-2 transition-transform duration-300" />
                  <span className="text-2xl">Dosyayı Seçin</span>
                  <div className="text-xs opacity-50 font-medium tracking-wide">EXCEL, CSV veya XML LISTESI</div>
                </label>
              </>
            )}
          </div>
        )}

        {/* Önizleme ve İndirme Ekranı */}
        {state === AppState.PREVIEW && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white sticky top-24 z-40 no-print">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Kartlar Hazır</h3>
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">Aktif</div>
                </div>
                <p className="text-slate-500 mt-2 font-semibold text-lg">Toplam {people.length} adet belge oluşturuldu.</p>
              </div>
              
              <button 
                onClick={downloadAllAsPDF}
                disabled={isGenerating}
                className="w-full md:w-auto mt-6 md:mt-0 bg-blue-600 text-white px-12 py-5 rounded-3xl font-black shadow-2xl shadow-blue-300/50 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Hazırlanıyor... %{progress}
                  </>
                ) : (
                  <>
                    <Download className="w-7 h-7" />
                    <span className="text-xl">PDF OLARAK İNDİR</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-14 justify-items-center py-6">
              {people.map((person) => (
                <div key={person.id} className="id-card-render shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm bg-white overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                  <IDCard person={person} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer (No print) */}
      <footer className="no-print mt-20 pb-10 text-center text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">
        Hebridean Sky Automation System &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
