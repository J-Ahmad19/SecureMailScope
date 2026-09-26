import React, { useState, useEffect, useRef } from 'react';
import { api } from './services/api';
import { Shield, Upload, FileTerminal, AlertTriangle, CheckCircle, Info, RefreshCw, XCircle, ChevronRight, Lock, Unlock, ArrowLeft, Loader2, Download, FileJson, FileCode, FileText } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import gsap from 'gsap';
import html2pdf from 'html2pdf.js';
import { generateReportHTML } from './utils/reportGenerator';
import LandingPage from './components/LandingPage';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, analyzing, dashboard, session_detail
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  
  // Data states
  const [reportData, setReportData] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const dashboardRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentView === 'dashboard' && dashboardRef.current) {
      gsap.fromTo(
        dashboardRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [currentView]);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PCAP file first.');
      return;
    }
    if (!file.name.endsWith('.pcap') && !file.name.endsWith('.pcapng')) {
      setError('Invalid file type. Only PCAP/PCAPNG files are allowed.');
      return;
    }
    
    setError(null);
    setCurrentView('analyzing');
    
    try {
      const uploadRes = await api.uploadPcap(file);
      await fetchReport(uploadRes.analysis_id);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDemo = async (scenario) => {
    setError(null);
    setCurrentView('analyzing');
    try {
      const demoRes = await api.getDemo(scenario);
      await fetchReport(demoRes.analysis_id);
    } catch (err) {
      handleApiError(err);
    }
  };

  const fetchReport = async (analysisId) => {
    try {
      const [summary, sessions, findings, reportJson] = await Promise.all([
        api.getSummary(analysisId),
        api.getSessions(analysisId),
        api.getFindings(analysisId),
        api.getReport(analysisId)
      ]);
      
      setReportData(reportJson);
      setCurrentView('dashboard');
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleApiError = (err) => {
    console.error(err);
    setError(err.response?.data?.detail || err.message || 'An unexpected error occurred during analysis. Please try again.');
    setCurrentView('landing');
  };

  const resetFlow = () => {
    setFile(null);
    setError(null);
    setReportData(null);
    setSelectedSession(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setCurrentView('landing');
  };

  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `securemailscope-report-${reportData.id || 'analysis'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportToHTML = () => {
    const htmlStr = generateReportHTML(reportData);
    const dataStr = "data:text/html;charset=utf-8," + encodeURIComponent(htmlStr);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `securemailscope-report-${reportData.id || 'analysis'}.html`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportToPDF = () => {
    const htmlStr = generateReportHTML(reportData);
    const opt = {
      margin:       10,
      filename:     `securemailscope-report-${reportData.id || 'analysis'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    const element = document.createElement('div');
    element.innerHTML = htmlStr;
    html2pdf().set(opt).from(element).save();
  };

  const renderRiskChart = (score) => {
    const data = [
      { name: 'Risk', value: score, fill: score >= 70 ? 'var(--color-danger)' : score >= 30 ? 'var(--color-warning)' : 'var(--color-success)' }
    ];
    return (
      <div className="h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={data} startAngle={180} endAngle={0}>
            <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-[var(--color-charm-heading)] font-heading">
              {score}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (currentView === 'landing') {
    return (
      <>
        {/* Global Error Toast floating above landing page */}
        {error && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
            <div className="p-4 bg-red-50 border border-danger rounded-full shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3 text-danger ml-2">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-sm">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-danger hover:text-red-700 focus:outline-none bg-red-100 p-1.5 rounded-full hover:bg-red-200 transition-colors mr-2">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        <LandingPage 
          file={file} 
          setFile={setFile} 
          error={error} 
          setError={setError} 
          fileInputRef={fileInputRef} 
          handleUpload={handleUpload} 
          handleDemo={handleDemo} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans text-[var(--color-charm-body)] bg-[var(--color-charm-surface)]">
      {/* Simple Header for Application Views */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={resetFlow}>
          <div className="p-2 bg-[var(--color-charm-brand)] rounded-full text-white shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-[var(--color-charm-heading)]">SecureMailScope</h1>
        </div>
        <div className="inline-block bg-[var(--color-charm-accent)] text-[var(--color-charm-brand-text)] text-xs font-bold px-4 py-1.5 rounded-full font-mono uppercase tracking-widest self-start md:self-auto border border-[var(--color-charm-border)]">
          Analysis Workspace
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        
        {/* Error Toast for Application Views */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-danger rounded-full shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3 text-danger ml-2">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold text-sm">{error}</span>
            </div>
            <div className="flex items-center gap-4 mr-2">
              <button onClick={resetFlow} className="text-sm font-bold text-danger hover:underline focus:outline-none">Dismiss</button>
              <button onClick={() => setError(null)} className="text-danger hover:text-red-700 focus:outline-none bg-red-100 p-1.5 rounded-full hover:bg-red-200 transition-colors">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* View: Analyzing */}
        {currentView === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-[var(--color-charm-brand)] animate-spin mb-6" />
            <h2 className="text-2xl font-bold font-heading text-[var(--color-charm-heading)]">Analyzing Network Traffic</h2>
            <p className="text-[var(--color-charm-muted)] mt-2">Extracting sessions and evaluating certificates...</p>
          </div>
        )}

        {/* View: Dashboard */}
        {currentView === 'dashboard' && reportData && (
          <div ref={dashboardRef} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-[var(--color-charm-border)] pb-6">
              <div>
                <h2 className="text-3xl font-bold font-heading text-[var(--color-charm-heading)]">Analysis Dashboard</h2>
                <p className="charm-label-mono mt-2">File: {reportData.filename}</p>
              </div>
              <div className="flex gap-2 relative">
                <div className="relative group">
                  <button className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[var(--color-charm-border)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100 flex flex-col py-2">
                    <div className="px-4 py-2 border-b border-[var(--color-charm-border)] mb-1">
                      <span className="text-xs font-bold text-[var(--color-charm-muted)] uppercase tracking-wider">Export Format</span>
                    </div>
                    <button onClick={exportToJSON} className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-charm-surface)] text-[var(--color-charm-heading)] font-bold transition-colors flex items-center gap-3">
                      <FileJson className="w-4 h-4 text-[var(--color-charm-brand)]" />
                      JSON Data
                    </button>
                    <button onClick={exportToHTML} className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-charm-surface)] text-[var(--color-charm-heading)] font-bold transition-colors flex items-center gap-3">
                      <FileCode className="w-4 h-4 text-[var(--color-charm-brand)]" />
                      HTML Report
                    </button>
                    <button onClick={exportToPDF} className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-charm-surface)] text-[var(--color-charm-heading)] font-bold transition-colors flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[var(--color-charm-brand)]" />
                      PDF Document
                    </button>
                  </div>
                </div>
                <button onClick={resetFlow} className="btn-secondary flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> New Analysis
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="charm-panel p-8 flex flex-col items-center justify-center relative min-h-[300px]">
                <h3 className="text-xl font-bold font-heading absolute top-6 left-6 text-[var(--color-charm-heading)]">Risk Score</h3>
                <div className="mt-8 w-full">{renderRiskChart(reportData.overall_risk_score)}</div>
                <p className={`text-sm font-bold uppercase tracking-widest mt-[-2rem] px-4 py-1.5 rounded-full ${
                  reportData.overall_risk_score >= 70 ? 'bg-red-50 text-danger' : 
                  reportData.overall_risk_score >= 30 ? 'bg-orange-50 text-warning' : 
                  'bg-green-50 text-success'
                }`}>
                  {reportData.risk_level} Risk
                </p>
              </div>
              <div className="charm-panel p-8 md:col-span-2">
                 <h3 className="text-xl font-bold font-heading mb-6 text-[var(--color-charm-heading)]">Traffic Overview</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-3xl border border-[var(--color-charm-border)] flex flex-col items-center justify-center shadow-sm">
                      <span className="block text-4xl font-bold text-[var(--color-charm-heading)] mb-2 font-heading">{reportData.total_sessions}</span>
                      <span className="charm-label-mono text-center">Total Sessions</span>
                    </div>
                    <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex flex-col items-center justify-center shadow-sm">
                      <span className="block text-4xl font-bold text-success mb-2 font-heading">{reportData.tls_sessions}</span>
                      <span className="charm-label-mono text-success text-center">TLS Protected</span>
                    </div>
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center justify-center shadow-sm">
                      <span className="block text-4xl font-bold text-danger mb-2 font-heading">{reportData.plaintext_sessions}</span>
                      <span className="charm-label-mono text-danger text-center">Plaintext</span>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Findings List */}
            <div className="charm-panel p-8">
              <h3 className="text-xl font-bold font-heading mb-6 text-[var(--color-charm-heading)]">Security Findings</h3>
              {reportData.sessions.flatMap(s => s.findings).length === 0 ? (
                <div className="p-12 text-center bg-[var(--color-charm-accent)] rounded-3xl">
                  <div className="w-16 h-16 bg-green-100 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-[var(--color-charm-heading)] text-lg">No major security findings detected.</p>
                  <p className="text-[var(--color-charm-muted)] mt-2">The analyzed traffic appears to follow secure practices.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportData.sessions.flatMap((s) => s.findings.map(f => ({...f, session: s}))).map((finding, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${
                      finding.severity === 'High' ? 'bg-red-50 border border-red-100' : 
                      finding.severity === 'Medium' ? 'bg-orange-50 border border-orange-100' : 
                      'bg-green-50 border border-green-100'
                    }`}>
                      <div className="flex-1">
                        <h4 className="font-bold flex items-center gap-3 text-[var(--color-charm-heading)] text-lg">
                          {finding.severity === 'High' && <div className="p-1.5 bg-danger text-white rounded-full"><AlertTriangle className="w-4 h-4"/></div>}
                          {finding.title}
                          <span className={`text-xs px-3 py-1 bg-white rounded-full font-mono uppercase tracking-wider shadow-sm ${
                            finding.severity === 'High' ? 'text-danger' : finding.severity === 'Medium' ? 'text-warning' : 'text-success'
                          }`}>{finding.severity}</span>
                        </h4>
                        <p className="mt-3 text-[var(--color-charm-body)] leading-relaxed">{finding.description}</p>
                        <div className="mt-4 p-3 bg-white/60 rounded-2xl text-sm">
                          <span className="font-bold text-[var(--color-charm-heading)]">Recommendation:</span> <span className="text-[var(--color-charm-muted)]">{finding.recommendation}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setSelectedSession(finding.session); setCurrentView('session_detail'); }}
                        className="btn-secondary whitespace-nowrap bg-white hover:bg-gray-50 flex items-center gap-2"
                      >
                        View Session <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sessions List */}
            <div className="charm-panel p-8">
              <h3 className="text-xl font-bold font-heading mb-6 text-[var(--color-charm-heading)]">Network Sessions</h3>
              {reportData.sessions.length === 0 ? (
                <div className="p-12 text-center bg-[var(--color-charm-accent)] rounded-3xl">
                  <p className="text-[var(--color-charm-muted)]">No sessions found in the provided PCAP.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-[var(--color-charm-border)]">
                      <tr>
                        <th className="py-4 px-4 charm-label-mono">Protocol</th>
                        <th className="py-4 px-4 charm-label-mono">Source</th>
                        <th className="py-4 px-4 charm-label-mono">Destination</th>
                        <th className="py-4 px-4 charm-label-mono">TLS Version</th>
                        <th className="py-4 px-4 charm-label-mono text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-charm-border)]">
                      {reportData.sessions.map((session, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                          <td className="py-4 px-4 font-bold text-[var(--color-charm-heading)]">{session.protocol}</td>
                          <td className="py-4 px-4 font-mono text-sm text-[var(--color-charm-muted)]">{session.source_ip}:{session.source_port}</td>
                          <td className="py-4 px-4 font-mono text-sm text-[var(--color-charm-muted)]">{session.destination_ip}:{session.destination_port}</td>
                          <td className="py-4 px-4">
                            {session.tls_version !== 'unknown' && session.tls_version ? (
                              <span className="bg-green-50 text-success px-3 py-1 rounded-full text-sm font-bold border border-green-100">{session.tls_version}</span>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Plaintext/Unknown</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => { setSelectedSession(session); setCurrentView('session_detail'); }}
                              className="text-[var(--color-charm-brand)] font-bold hover:text-[var(--color-charm-brand-text)] bg-[var(--color-charm-accent)] px-4 py-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-charm-brand)]"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View: Session Detail */}
        {currentView === 'session_detail' && selectedSession && (
          <div className="space-y-8">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="text-sm font-bold text-[var(--color-charm-muted)] hover:text-[var(--color-charm-heading)] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-charm-brand)] rounded-full px-4 py-2 bg-white border border-[var(--color-charm-border)] shadow-sm transition-all hover:shadow"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            
            <div className="flex items-center gap-4 border-b border-[var(--color-charm-border)] pb-6">
              <h2 className="text-3xl font-bold font-heading text-[var(--color-charm-heading)]">Session Details</h2>
              <span className="charm-label-mono bg-[var(--color-charm-accent)] px-3 py-1 rounded-full border border-[var(--color-charm-border)]">
                {selectedSession.protocol}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="charm-panel p-8">
                <h3 className="text-xl font-bold font-heading mb-6 text-[var(--color-charm-heading)] flex items-center gap-2">
                  <div className="p-1.5 bg-[var(--color-charm-accent)] text-[var(--color-charm-brand)] rounded-full"><Info className="w-5 h-5" /></div> Connection Info
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-[var(--color-charm-border)] pb-3">
                    <span className="charm-label-mono pt-1">Source</span>
                    <span className="font-mono text-sm bg-white border border-[var(--color-charm-border)] px-3 py-1 rounded-full shadow-sm">{selectedSession.source_ip}:{selectedSession.source_port}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-charm-border)] pb-3">
                    <span className="charm-label-mono pt-1">Destination</span>
                    <span className="font-mono text-sm bg-white border border-[var(--color-charm-border)] px-3 py-1 rounded-full shadow-sm">{selectedSession.destination_ip}:{selectedSession.destination_port}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="charm-label-mono pt-1">Anomaly Score</span>
                    <span className="font-bold text-lg text-[var(--color-charm-heading)]">{selectedSession.anomaly_score}</span>
                  </div>
                </div>
              </div>
              
              <div className="charm-panel p-8">
                <h3 className="text-xl font-bold font-heading mb-6 text-[var(--color-charm-heading)] flex items-center gap-2">
                  <div className="p-1.5 bg-[var(--color-charm-accent)] text-[var(--color-charm-brand)] rounded-full"><Shield className="w-5 h-5" /></div> TLS Parameters
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-[var(--color-charm-border)] pb-3">
                    <span className="charm-label-mono pt-1">Version</span>
                    <span className="font-bold text-[var(--color-charm-heading)]">{selectedSession.tls_version !== 'unknown' ? selectedSession.tls_version : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-charm-border)] pb-3">
                    <span className="charm-label-mono pt-1">Cipher Suite</span>
                    <span className="font-mono text-sm text-[var(--color-charm-muted)] max-w-[200px] truncate" title={selectedSession.cipher_suite}>{selectedSession.cipher_suite !== 'unknown' ? selectedSession.cipher_suite : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="charm-label-mono pt-1">STARTTLS Detected</span>
                    <span className="font-bold text-[var(--color-charm-heading)]">{selectedSession.starttls_detected === 'detected' ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedSession.certificate && (
              <div className="charm-panel p-8">
                <h3 className="text-xl font-bold font-heading mb-6 text-[var(--color-charm-heading)]">X.509 Certificate Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <span className="charm-label-mono block mb-3">Validity</span> 
                    {selectedSession.certificate.status === 'valid' ? (
                      <span className="text-success font-bold flex items-center gap-2 bg-green-50 w-fit px-4 py-2 rounded-full border border-green-100 shadow-sm"><CheckCircle className="w-5 h-5"/> Valid Certificate</span>
                    ) : (
                      <span className="text-danger font-bold flex items-center gap-2 bg-red-50 w-fit px-4 py-2 rounded-full border border-red-100 shadow-sm"><AlertTriangle className="w-5 h-5"/> Invalid / Expired</span>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <span className="charm-label-mono block mb-2">Subject</span> 
                      <div className="font-mono text-sm text-[var(--color-charm-muted)] bg-white p-4 rounded-2xl border border-[var(--color-charm-border)] break-words shadow-sm">
                        {selectedSession.certificate.subject || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="charm-label-mono block mb-2">Issuer</span> 
                      <div className="font-mono text-sm text-[var(--color-charm-muted)] bg-white p-4 rounded-2xl border border-[var(--color-charm-border)] break-words shadow-sm">
                        {selectedSession.certificate.issuer || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
