import React, { useState } from 'react';
import { Shield, Upload, Search, Brain, Mail, Network, Lock, Unlock, Quote, FileText } from 'lucide-react';

export default function LandingPage({ 
  file, 
  setFile, 
  error, 
  setError, 
  fileInputRef, 
  handleUpload, 
  handleDemo 
}) {
  const [isDragging, setIsDragging] = useState(false);
  
  const scrollToTryIt = () => {
    document.getElementById('try-it-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-charm-surface)]">
      
      {/* Marketing Header */}
      <header className="bg-[var(--color-charm-accent)] py-6 px-6 md:px-12 border-b border-[var(--color-charm-border)] border-opacity-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-charm-brand)] rounded-full text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-heading text-[var(--color-charm-heading)]">SecureMailScope</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-[var(--color-charm-heading)]">
            <a href="#" className="hover:text-[var(--color-charm-brand)] transition-colors">Home</a>
            <a href="#features" className="hover:text-[var(--color-charm-brand)] transition-colors">Features</a>
            <a href="#" className="hover:text-[var(--color-charm-brand)] transition-colors">How it Works</a>
            <a href="#" className="hover:text-[var(--color-charm-brand)] transition-colors">Insights</a>
            <a href="#" className="hover:text-[var(--color-charm-brand)] transition-colors">About</a>
          </nav>
          <button onClick={scrollToTryIt} className="btn-primary text-sm px-6 py-2">
            Get Started &rarr;
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[var(--color-charm-accent)] pt-16 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle background waves could go here */}
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Text Column */}
          <div className="flex-1 space-y-6 z-10">
            <span className="charm-label-mono text-[var(--color-charm-brand-text)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-charm-brand)]"></span> SECURE EMAIL. STRONGER EVIDENCE.
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-[var(--color-charm-heading)] leading-tight tracking-tight">
              See. Analyse.<br/>
              <span className="text-[var(--color-charm-heading)]">Secure.</span>
            </h1>
            
            <p className="text-lg text-[var(--color-charm-muted)] max-w-lg leading-relaxed">
              Assess the cryptographic security posture of your email communications with AI-assisted network analysis.
            </p>
            
            {/* Feature Icons Row */}
            <div className="flex gap-6 pt-4 pb-6 border-y border-[var(--color-charm-border)] border-opacity-50">
               <div className="flex flex-col items-center gap-2">
                 <div className="p-2 bg-white rounded-xl shadow-sm text-[var(--color-charm-brand)]"><Mail className="w-5 h-5"/></div>
                 <span className="text-xs font-bold text-[var(--color-charm-heading)]">SMTP</span>
                 <span className="text-[10px] text-[var(--color-charm-muted)] text-center leading-tight">Security Analysis</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="p-2 bg-white rounded-xl shadow-sm text-[var(--color-charm-brand)]"><Network className="w-5 h-5"/></div>
                 <span className="text-xs font-bold text-[var(--color-charm-heading)]">IMAP</span>
                 <span className="text-[10px] text-[var(--color-charm-muted)] text-center leading-tight">Protocol Inspection</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="p-2 bg-white rounded-xl shadow-sm text-[var(--color-charm-brand)]"><Lock className="w-5 h-5"/></div>
                 <span className="text-xs font-bold text-[var(--color-charm-heading)]">POP3</span>
                 <span className="text-[10px] text-[var(--color-charm-muted)] text-center leading-tight">Data Protection</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="p-2 bg-white rounded-xl shadow-sm text-[var(--color-charm-brand)]"><Shield className="w-5 h-5"/></div>
                 <span className="text-xs font-bold text-[var(--color-charm-heading)]">TLS/X.509</span>
                 <span className="text-[10px] text-[var(--color-charm-muted)] text-center leading-tight">Certificate Analysis</span>
               </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button onClick={scrollToTryIt} className="btn-primary flex items-center justify-center gap-2 px-8 py-3 text-lg">
                <Upload className="w-5 h-5"/> Upload PCAP File
              </button>
              <a href="#features" className="btn-secondary flex items-center justify-center bg-white px-8 py-3 text-lg">
                Explore Features
              </a>
            </div>
            
            <p className="text-xs text-[var(--color-charm-muted)] pt-2">
              Supports PCAP / PCAPNG - No data leaves your environment
            </p>
          </div>
          
          {/* Right Dashboard Illustration */}
          <div className="flex-1 relative hidden lg:block h-[500px] w-full">
            {/* Background elements */}
            <div className="absolute top-10 right-0 w-72 h-72 bg-white bg-opacity-40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-[var(--color-charm-brand)] opacity-10 rounded-full blur-2xl"></div>
            
            {/* Fake Dashboard Card */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] bg-white rounded-[24px] shadow-xl border border-gray-100 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
               {/* Dashboard Header */}
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-[var(--color-charm-brand)]"></div>
                   <span className="font-bold text-sm">SecureMailScope</span>
                 </div>
                 <div className="flex gap-2">
                   <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                   <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                 </div>
               </div>
               
               {/* Dashboard Body */}
               <div className="grid grid-cols-3 gap-4 mb-4">
                 <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                    <span className="text-3xl font-bold font-heading">127</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Total Sessions</span>
                 </div>
                 <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center border border-green-100">
                    <span className="text-3xl font-bold font-heading text-green-600">90</span>
                    <span className="text-[10px] text-green-600 uppercase tracking-wider mt-1">TLS Protected</span>
                 </div>
                 <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center border border-red-100">
                    <span className="text-3xl font-bold font-heading text-red-600">3</span>
                    <span className="text-[10px] text-red-600 uppercase tracking-wider mt-1">High Severity</span>
                 </div>
               </div>
               
               {/* Graph Area Placeholder */}
               <div className="bg-gray-50 rounded-xl h-40 w-full mt-2 flex items-end justify-start border border-gray-100 relative pb-4 px-6 gap-6">
                  <span className="text-sm font-bold text-gray-400 absolute top-4 left-6">Protocol Distribution</span>
                  <div className="w-12 h-16 bg-blue-200 rounded-t-sm mt-auto relative"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-400">IMAP</span></div>
                  <div className="w-12 h-24 bg-[var(--color-charm-brand)] opacity-80 rounded-t-sm mt-auto relative"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[var(--color-charm-brand)]">SMTP</span></div>
                  <div className="w-12 h-8 bg-green-200 rounded-t-sm mt-auto relative"><span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-500">POP3</span></div>
               </div>
               
               {/* Annotation pointer */}
               <div className="absolute -bottom-12 right-12 flex flex-col items-end">
                 <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M4 4C20 4 36 20 36 36" stroke="#E4544B" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
                 </svg>
                 <span className="text-sm font-medium text-[var(--color-charm-brand)] max-w-[200px] text-right italic">
                   From network packets to actionable security insights.
                 </span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-charm-accent)] flex items-center justify-center text-[var(--color-charm-brand)] mb-6">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-4 text-[var(--color-charm-heading)]">Deep Protocol Analysis</h3>
            <p className="text-[var(--color-charm-muted)] leading-relaxed">
              Identify and analyze SMTP, IMAP, and POP3 communications with accurate session reconstruction.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-charm-accent)] flex items-center justify-center text-[var(--color-charm-brand)] mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-4 text-[var(--color-charm-heading)]">Cryptographic Intelligence</h3>
            <p className="text-[var(--color-charm-muted)] leading-relaxed">
              Detect STARTTLS, analyze TLS handshakes, extract X.509 certificates, and evaluate security configurations.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-charm-accent)] flex items-center justify-center text-[var(--color-charm-brand)] mb-6">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-4 text-[var(--color-charm-heading)]">AI-Assisted Risk Assessment</h3>
            <p className="text-[var(--color-charm-muted)] leading-relaxed">
              Combine deterministic security rules with machine learning to surface anomalies and prioritize real risks.
            </p>
          </div>
          
        </div>
      </section>

      {/* Try It Now Section (Replacing the old basic view) */}
      <section id="try-it-section" className="py-24 px-6 md:px-12 bg-gray-50 border-y border-[var(--color-charm-border)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[var(--color-charm-heading)] mb-4">Start Analyzing Traffic</h2>
            <p className="text-[var(--color-charm-muted)]">Upload your own PCAP evidence or try one of our controlled lab scenarios.</p>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="charm-panel p-8 md:p-10 bg-white shadow-sm border-transparent hover:border-[var(--color-charm-brand)] transition-colors">
              <h2 className="text-2xl font-bold font-heading mb-6 text-[var(--color-charm-heading)]">Upload PCAP Evidence</h2>
              
              <div 
                className={`border-2 border-dashed rounded-[24px] p-8 md:p-12 text-center transition-all ${
                  isDragging 
                    ? 'border-[var(--color-charm-brand)] bg-red-50' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center gap-4 cursor-pointer">
                  <div className={`p-4 rounded-full ${isDragging ? 'bg-red-100' : 'bg-white shadow-sm'}`}>
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-[var(--color-charm-brand)]' : 'text-[var(--color-charm-muted)]'}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--color-charm-heading)] mb-1">
                      {file ? file.name : "Click or drag PCAP file here"}
                    </p>
                    <p className="text-sm text-[var(--color-charm-muted)]">
                      {file ? "File selected. Ready for analysis." : "Supports .pcap and .pcapng files up to 50MB"}
                    </p>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => { setFile(e.target.files[0]); setError(null); }} 
                  accept=".pcap,.pcapng"
                  className="hidden"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleUpload}
                  disabled={!file}
                  className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-charm-brand)] disabled:opacity-50 disabled:cursor-not-allowed text-lg px-10 py-4"
                >
                  <Search className="w-5 h-5"/> Analyze Network Traffic
                </button>
              </div>
            </div>

            <div className="charm-panel p-8 md:p-10 bg-white shadow-sm">
              <h2 className="text-2xl font-bold font-heading mb-6 text-[var(--color-charm-heading)]">Run Demo Scenario</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => handleDemo('secure')} className="charm-panel p-6 bg-white hover:border-success hover:shadow-md transition-all flex flex-col items-center gap-3 focus:outline-none focus:ring-2 focus:ring-success rounded-[24px]">
                  <div className="p-4 bg-green-50 rounded-full text-success mb-2">
                    <Shield className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-[var(--color-charm-heading)]">SECURE SMTP</span>
                  <span className="text-sm text-[var(--color-charm-muted)] text-center">Valid cert, modern TLS</span>
                </button>
                <button onClick={() => handleDemo('weak_tls')} className="charm-panel p-6 bg-white hover:border-warning hover:shadow-md transition-all flex flex-col items-center gap-3 focus:outline-none focus:ring-2 focus:ring-warning rounded-[24px]">
                  <div className="p-4 bg-orange-50 rounded-full text-warning mb-2">
                    <Unlock className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-[var(--color-charm-heading)]">WEAK TLS</span>
                  <span className="text-sm text-[var(--color-charm-muted)] text-center">Deprecated TLS versions</span>
                </button>
                <button onClick={() => handleDemo('expired_cert')} className="charm-panel p-6 bg-white hover:border-danger hover:shadow-md transition-all flex flex-col items-center gap-3 focus:outline-none focus:ring-2 focus:ring-danger rounded-[24px]">
                  <div className="p-4 bg-red-50 rounded-full text-danger mb-2">
                    <Mail className="w-8 h-8" /> {/* AlertTriangle could be used, but keeping consistent styling */}
                  </div>
                  <span className="font-bold text-[var(--color-charm-heading)]">EXPIRED CERT</span>
                  <span className="text-sm text-[var(--color-charm-muted)] text-center">Invalid certificate chain</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="bg-[var(--color-charm-accent)] py-24 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle background waves styling */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-30 text-[var(--color-charm-brand)]" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M0,50 Q25,30 50,50 T100,50" stroke="currentColor" strokeWidth="0.1" fill="none"/>
           <path d="M0,60 Q25,40 50,60 T100,60" stroke="currentColor" strokeWidth="0.1" fill="none"/>
           <path d="M0,70 Q25,50 50,70 T100,70" stroke="currentColor" strokeWidth="0.1" fill="none"/>
        </svg>
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 relative z-10">
          
          {/* Left Text & Stats */}
          <div className="flex-1">
            <span className="charm-label-mono text-[var(--color-charm-muted)] block mb-4">BUILT FOR A MORE SECURE EMAIL ECOSYSTEM</span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-[var(--color-charm-heading)] mb-6">
              Transforming Network Evidence <span className="text-[var(--color-charm-brand-text)]">into Trust</span>
            </h2>
            <p className="text-lg text-[var(--color-charm-muted)] mb-12">
              Clear insights. Stronger security. Safer communications.
            </p>
            
            <div className="flex gap-8 md:gap-12 flex-wrap">
              <div>
                <span className="block text-3xl font-bold font-heading text-[var(--color-charm-heading)]">3+</span>
                <span className="text-sm font-medium text-[var(--color-charm-muted)]">Email Protocols</span>
              </div>
              <div>
                <span className="block text-3xl font-bold font-heading text-[var(--color-charm-heading)]">10+</span>
                <span className="text-sm font-medium text-[var(--color-charm-muted)]">Security Checks</span>
              </div>
              <div>
                <span className="block text-3xl font-bold font-heading text-[var(--color-charm-heading)]">100%</span>
                <span className="text-sm font-medium text-[var(--color-charm-muted)]">Evidence Based</span>
              </div>
              <div>
                <span className="block text-3xl font-bold font-heading text-[var(--color-charm-brand)]">∞</span>
                <span className="text-sm font-medium text-[var(--color-charm-muted)]">Broader Impact</span>
              </div>
            </div>
          </div>
          
          {/* Right Quote */}
          <div className="flex-1 flex items-center">
            <div className="border-l-4 border-[var(--color-charm-brand)] pl-8 py-4">
              <Quote className="w-8 h-8 text-[var(--color-charm-brand)] opacity-50 mb-4" />
              <blockquote className="text-2xl font-bold text-[var(--color-charm-heading)] italic leading-relaxed mb-4">
                "Security is not just about blocking threats, but about understanding them."
              </blockquote>
              <cite className="text-[var(--color-charm-muted)] font-medium not-italic">
                — A more secure digital tomorrow
              </cite>
            </div>
          </div>
          
        </div>
      </section>
      
      {/* Footer is handled globally in App.jsx or we can add it here if it's landing only.
          The screenshot shows it at the bottom. We'll add it here so it doesn't show in the dashboard view. */}
      <footer className="bg-white py-12 px-6 md:px-12 border-t border-[var(--color-charm-border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--color-charm-brand)]" />
            <span className="font-bold font-heading text-[var(--color-charm-heading)]">SecureMailScope</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-[var(--color-charm-muted)]">
            <a href="#" className="hover:text-[var(--color-charm-brand)]">Home</a>
            <a href="#features" className="hover:text-[var(--color-charm-brand)]">Features</a>
            <a href="#" className="hover:text-[var(--color-charm-brand)]">How it Works</a>
            <a href="#" className="hover:text-[var(--color-charm-brand)]">Insights</a>
            <a href="#" className="hover:text-[var(--color-charm-brand)]">About</a>
          </div>
          <div className="text-sm text-[var(--color-charm-muted)]">
            Building a safer and more trusted email ecosystem.
          </div>
        </div>
      </footer>
    </div>
  );
}
