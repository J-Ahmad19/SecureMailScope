export function generateReportHTML(reportData) {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  // Helper to safely get lengths
  const getCount = (arr) => arr ? arr.length : 0;
  
  // Collect all findings
  const allFindings = reportData.sessions?.flatMap(s => 
    s.findings?.map(f => ({ ...f, session: s })) || []
  ) || [];
  
  const highFindings = allFindings.filter(f => f.severity === 'High');
  const medFindings = allFindings.filter(f => f.severity === 'Medium');
  const lowFindings = allFindings.filter(f => f.severity === 'Low');
  
  const hasAnomalies = reportData.sessions?.some(s => s.anomaly_score > 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SecureMailScope Forensic Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&family=Fragment+Mono&family=Inter:wght@400;500;600&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1C1917; /* Heading / dark text */
      background: #FFFFFF;
      line-height: 1.5;
      padding: 40px;
      margin: 0 auto;
      max-width: 900px;
    }
    h1, h2, h3, h4 {
      font-family: 'DM Sans', sans-serif;
      color: #1C1917;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      border-bottom: 1px solid #E7E6E5;
      padding-bottom: 8px;
    }
    h1 { font-size: 28px; border-bottom: 2px solid #E4544B; }
    h2 { font-size: 22px; }
    h3 { font-size: 18px; border-bottom: none; }
    
    .mono {
      font-family: 'Fragment Mono', monospace;
      font-size: 0.9em;
      color: #57534E;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .header h1 { border: none; margin-bottom: 10px; }
    .header p { color: #79716B; margin: 0; }
    
    .card {
      border: 1px solid #E7E6E5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      background-color: #FBFAF9;
      page-break-inside: avoid;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid #E7E6E5;
    }
    th {
      font-family: 'Fragment Mono', monospace;
      font-size: 12px;
      text-transform: uppercase;
      color: #79716B;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: bold;
      font-family: 'Fragment Mono', monospace;
      text-transform: uppercase;
    }
    .badge.high { background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; }
    .badge.medium { background: #FFEDD5; color: #D97706; border: 1px solid #FCD34D; }
    .badge.low { background: #DCFCE7; color: #16A34A; border: 1px solid #86EFAC; }
    
    .evidence-block {
      background: #F7F7F5;
      padding: 12px;
      border-left: 4px solid #E4544B;
      font-family: 'Fragment Mono', monospace;
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-all;
      margin-top: 8px;
    }
    
    .page-break { page-break-before: always; }
  </style>
</head>
<body>

  <div class="header">
    <h1>SecureMailScope Forensic Report</h1>
    <p>Generated on ${date} at ${time}</p>
    <p>File: <span class="mono">${reportData.filename}</span></p>
  </div>

  <!-- 1. Executive summary -->
  <h2>1. Executive Summary</h2>
  <p>This report presents the findings of a passive cryptographic posture assessment of email communications captured in the provided PCAP file. The overall risk level of the analyzed traffic is evaluated as <strong>${reportData.risk_level.toUpperCase()}</strong> (Score: ${reportData.overall_risk_score}/100).</p>
  <p>The analysis extracted <strong>${reportData.total_sessions}</strong> total network sessions, of which <strong>${reportData.tls_sessions}</strong> utilized TLS encryption and <strong>${reportData.plaintext_sessions}</strong> were transmitted in plaintext.</p>

  <!-- 2. Scope and capture metadata -->
  <h2>2. Scope and Capture Metadata</h2>
  <div class="card">
    <p><strong>Filename:</strong> <span class="mono">${reportData.filename}</span></p>
    <p><strong>Analysis ID:</strong> <span class="mono">${reportData.id || 'N/A'}</span></p>
    <p><strong>Status:</strong> ${reportData.status}</p>
  </div>

  <!-- 3. Protocol/session statistics -->
  <h2>3. Protocol and Session Statistics</h2>
  <table>
    <thead>
      <tr>
        <th>Total Sessions</th>
        <th>TLS Protected</th>
        <th>Plaintext</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-size: 24px; font-weight: bold;">${reportData.total_sessions}</td>
        <td style="font-size: 24px; font-weight: bold; color: #16A34A;">${reportData.tls_sessions}</td>
        <td style="font-size: 24px; font-weight: bold; color: #DC2626;">${reportData.plaintext_sessions}</td>
      </tr>
    </tbody>
  </table>

  <!-- 4. TLS and certificate posture -->
  <h2>4. TLS and Certificate Posture</h2>
  <p>The following summarizes the cryptographic strength and certificate validity observed across all extracted sessions.</p>
  <table>
    <thead>
      <tr>
        <th>Protocol</th>
        <th>Endpoints</th>
        <th>TLS Version</th>
        <th>Cipher Suite</th>
        <th>Cert Status</th>
      </tr>
    </thead>
    <tbody>
      ${reportData.sessions?.map(s => `
        <tr>
          <td><strong>${s.protocol}</strong></td>
          <td class="mono" style="font-size: 11px;">${s.source_ip}:${s.source_port} &rarr;<br/>${s.destination_ip}:${s.destination_port}</td>
          <td>${s.tls_version !== 'unknown' ? s.tls_version : 'N/A'}</td>
          <td class="mono" style="font-size: 11px;">${s.cipher_suite !== 'unknown' ? s.cipher_suite : 'N/A'}</td>
          <td>${s.certificate ? (s.certificate.status === 'valid' ? '<span style="color:#16A34A">Valid</span>' : '<span style="color:#DC2626">Invalid/Expired</span>') : 'N/A'}</td>
        </tr>
      `).join('') || '<tr><td colspan="5">No session data available.</td></tr>'}
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- 5. Top findings by severity -->
  <h2>5. Top Findings by Severity</h2>
  <div style="display: flex; gap: 20px; margin-bottom: 20px;">
    <div class="card" style="flex: 1; text-align: center;">
      <h3 style="color: #DC2626; margin: 0; font-size: 32px;">${highFindings.length}</h3>
      <span class="mono">High Severity</span>
    </div>
    <div class="card" style="flex: 1; text-align: center;">
      <h3 style="color: #D97706; margin: 0; font-size: 32px;">${medFindings.length}</h3>
      <span class="mono">Medium Severity</span>
    </div>
    <div class="card" style="flex: 1; text-align: center;">
      <h3 style="color: #16A34A; margin: 0; font-size: 32px;">${lowFindings.length}</h3>
      <span class="mono">Low/Info</span>
    </div>
  </div>

  <!-- 6. Detailed evidence per finding -->
  <h2>6. Detailed Evidence per Finding</h2>
  ${allFindings.length === 0 ? '<p>No security findings were detected in the provided PCAP.</p>' : ''}
  
  ${allFindings.map(f => `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h3 style="margin-top: 0; color: #1C1917;">${f.title}</h3>
        <span class="badge ${f.severity.toLowerCase()}">${f.severity}</span>
      </div>
      <p style="margin-top: 8px;">${f.description}</p>
      
      <p style="margin-bottom: 4px; font-weight: bold; font-size: 14px;">Forensic Evidence:</p>
      <div class="evidence-block">Rule ID: ${f.rule_id}
Session: ${f.session.protocol} (${f.session.source_ip}:${f.session.source_port} -> ${f.session.destination_ip}:${f.session.destination_port})
Evidence: ${f.evidence || 'Observable via PCAP trace.'}</div>
    </div>
  `).join('')}

  <!-- 7. AI/ML anomaly observations -->
  <h2>7. AI/ML Anomaly Observations</h2>
  ${hasAnomalies ? `
    <p>The machine learning layer identified unusual behavioral characteristics in the network traffic.</p>
    <ul>
      ${reportData.sessions?.filter(s => s.anomaly_score > 0).map(s => `
        <li><strong>Session ${s.id} (${s.protocol})</strong>: Anomaly score of ${s.anomaly_score}. This session exhibited deviations from baseline training data, potentially indicating misconfigured or non-standard cryptographic handshakes.</li>
      `).join('')}
    </ul>
  ` : `
    <p>No significant anomalies were detected by the AI/ML layer. The traffic conforms to standard baseline behavior.</p>
  `}

  <!-- 8. Recommendations and remediation priorities -->
  <h2>8. Recommendations & Remediation Priorities</h2>
  ${allFindings.length === 0 ? '<p>No immediate remediation actions required based on current policy rules.</p>' : ''}
  <ul>
    ${allFindings.map(f => `
      <li style="margin-bottom: 10px;"><strong>[${f.severity}] ${f.title}:</strong> ${f.recommendation}</li>
    `).join('')}
  </ul>

  <!-- 9. Methodology and evidence limitations -->
  <div class="page-break"></div>
  <h2>9. Methodology and Evidence Limitations</h2>
  <div class="card" style="background: #F1F2EA; border: none;">
    <p>SecureMailScope operates as a <strong>passive cryptographic posture assessment tool</strong>. The following limitations apply to this forensic report:</p>
    <ul>
      <li><strong>Passive PCAP evidence only:</strong> The system relies exclusively on metadata exposed during network transport.</li>
      <li><strong>No application payload decryption:</strong> Encrypted application content (email bodies, attachments) is not decrypted by this tool.</li>
      <li><strong>Anomaly scores are decision support:</strong> AI/ML anomaly scores highlight unusual characteristics relative to baseline data, but do not definitively prove malicious intent.</li>
      <li><strong>Incomplete evidence handling:</strong> When specific protocol details (e.g., full certificate chains) are not captured in the PCAP, they are marked as <code>unknown</code> or <code>N/A</code> rather than inferred.</li>
    </ul>
  </div>

</body>
</html>
  `;
}
