import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  CloudLightning, 
  Upload, 
  Check, 
  AlertCircle, 
  Loader2, 
  LogOut, 
  ExternalLink,
  RefreshCw,
  Sparkles,
  FileDown
} from 'lucide-react';
import { SkinScan, UserProfile } from '../types';
import { googleSignIn, initAuth, logout, getAccessToken } from '../utils/firebase';
import { exportReportToPDF } from '../utils/pdfGenerator';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
}

interface GoogleDriveProps {
  latestReport: SkinScan | null;
  userProfile: UserProfile;
  onImportImageForScan: (base64Url: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function GoogleDrive({ 
  latestReport, 
  userProfile, 
  onImportImageForScan,
  onNavigateToTab
}: GoogleDriveProps) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'images' | 'pdfs'>('all');
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [previewingFile, setPreviewingFile] = useState<GoogleDriveFile | null>(null);
  const [importingImage, setImportingImage] = useState<string | null>(null);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Files once Token is Available
  useEffect(() => {
    if (token) {
      fetchDriveFiles();
    }
  }, [token, fileTypeFilter]);

  const handleLogin = async () => {
    setSigningIn(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to authenticate with Google Drive.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      setFiles([]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriveFiles = async () => {
    if (!token) return;
    setFilesLoading(true);
    setError(null);

    try {
      let q = "trashed = false";
      if (fileTypeFilter === 'images') {
        q += " and mimeType contains 'image/'";
      } else if (fileTypeFilter === 'pdfs') {
        q += " and mimeType = 'application/pdf'";
      }

      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,thumbnailLink,webViewLink)&pageSize=35`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, log out
          handleLogout();
          throw new Error('OAuth token expired. Please sign in again.');
        }
        throw new Error('Failed to retrieve files from Google Drive.');
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with Google Drive.');
    } finally {
      setFilesLoading(false);
    }
  };

  // Mutating workspace operation: Export report PDF (requires confirmation dialog)
  const handleExportPDF = async () => {
    if (!latestReport || !token) return;

    // MANDATORY USER CONFIRMATION
    const filename = `SkinGPT_Report_${userProfile.name.replace(/\s+/g, '_')}_${latestReport.date.replace(/\//g, '-')}.pdf`;
    const confirmed = window.confirm(
      `Do you want to generate and upload "${filename}" directly to your Google Drive?`
    );
    if (!confirmed) return;

    setExporting(true);
    setError(null);
    setExportSuccess(null);

    try {
      // 1. Generate jsPDF doc
      const doc = exportReportToPDF(latestReport, userProfile, false);
      const pdfBlob = doc.output('blob');

      // 2. Prepare multipart upload to Google Drive
      const metadata = {
        name: filename,
        mimeType: 'application/pdf',
      };

      const boundary = 'skingpt_drive_multipart_boundary';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const metadataPart = JSON.stringify(metadata);
      
      const reader = new FileReader();
      
      const uploadPromise = new Promise<any>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            const enc = new TextEncoder();
            const part1 = enc.encode(`${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${metadataPart}\r\n${delimiter}Content-Type: application/pdf\r\n\r\n`);
            const part3 = enc.encode(`${closeDelimiter}`);
            
            const bodyBlob = new Blob([part1, uint8Array, part3], { type: 'multipart/related; boundary=' + boundary });
            
            const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': `multipart/related; boundary=${boundary}`
              },
              body: bodyBlob
            });

            if (!uploadRes.ok) {
              throw new Error('Failed to upload file to Google Drive.');
            }

            const resData = await uploadRes.json();
            resolve(resData);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read PDF blob.'));
        reader.readAsArrayBuffer(pdfBlob);
      });

      const uploadedFile = await uploadPromise;
      setExportSuccess(`Successfully uploaded skin report as PDF to Google Drive! (ID: ${uploadedFile.id})`);
      fetchDriveFiles(); // Refresh files list
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to export report to Google Drive.');
    } finally {
      setExporting(false);
    }
  };

  // Import photo from Google Drive (reads as base64 and passes to scanner)
  const handleImportImage = async (file: GoogleDriveFile) => {
    if (!token) return;
    setImportingImage(file.id);
    setError(null);

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download image from Google Drive.');
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        onImportImageForScan(base64Url);
        // Switch tab to scanner
        onNavigateToTab('scanner');
      };
      reader.onerror = () => {
        throw new Error('Error converting image data.');
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to download selected file.');
      setImportingImage(null);
    }
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Synchronizing Cloud Services...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn" id="google-drive-integration-panel">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-brand-900 dark:text-white font-display">
            Google Drive Integration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xl">
            Securely link your Google Workspace Drive. Import high-res clinical skin photos for computer-vision derm analysis, and export clinical report PDFs back to your drive folder.
          </p>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-rose-950/25 border border-red-200 dark:border-rose-900/30 rounded-2xl flex items-start gap-3 text-red-700 dark:text-rose-400 text-xs">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Error Encountered</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {exportSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-start gap-3 text-emerald-700 dark:text-emerald-400 text-xs animate-fadeIn">
          <Check className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Success</p>
            <p className="mt-1">{exportSuccess}</p>
          </div>
        </div>
      )}

      {!user ? (
        <div className="bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
          <div className="mx-auto h-14 w-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Folder className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">Connect to Google Drive</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
              Securely authenticate with your Google account. This lets SkinGPT browse images from your drive and upload detailed PDF routine analysis cards directly.
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={signingIn}
            className="gsi-material-button mx-auto shadow-sm hover:shadow-md transition-shadow cursor-pointer disabled:opacity-60"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                {signingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                ) : (
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                )}
              </div>
              <span className="gsi-material-button-contents">{signingIn ? 'Connecting...' : 'Sign in with Google'}</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Active integration controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Account Details */}
            <div className="bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Workspace Connection</h3>
              <div className="flex items-center gap-3.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="h-11 w-11 rounded-full border border-indigo-200" referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-11 w-11 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {user.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-gray-950 dark:text-white">{user.displayName}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[190px]">{user.email}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-brand-100 dark:border-slate-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-450 text-[10px] font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Google Drive API Connected (Read/Write)
              </div>
            </div>

            {/* Export Report Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 dark:from-slate-900 dark:to-indigo-950 border border-indigo-800 dark:border-indigo-950 text-white rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Export to Workspace</h3>
                  <h4 className="text-lg font-bold font-display">Export Skin Analysis</h4>
                </div>
                <CloudLightning className="h-5 w-5 text-indigo-300 animate-pulse-subtle" />
              </div>
              
              <p className="text-xs text-indigo-100/80 leading-relaxed">
                Save your latest comprehensive SkinGPT report directly to your Google Drive for chronic skin progression logs or dermatologist consultations.
              </p>

              {latestReport ? (
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-indigo-200">Wellness Index:</span>
                      <span className="font-bold font-mono">{latestReport.score.overall}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-200">Skin Type:</span>
                      <span className="font-bold text-indigo-300">{latestReport.skinType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-200">Date Logged:</span>
                      <span className="font-mono text-[11px]">{latestReport.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleExportPDF}
                    disabled={exporting}
                    className="w-full py-3 bg-white text-indigo-950 hover:bg-indigo-50 disabled:opacity-55 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow transition-all active:scale-[0.98]"
                  >
                    {exporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-950" />
                        Uploading PDF...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Export PDF to Google Drive
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-center text-xs text-indigo-200">
                  <p>No active skin scan report found.</p>
                  <button
                    onClick={() => onNavigateToTab('scanner')}
                    className="mt-3.5 px-4 py-2 bg-indigo-500/25 hover:bg-indigo-500/45 border border-indigo-400/20 text-white rounded-lg font-bold"
                  >
                    Perform Skin Scan
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right panel: File Browser */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-brand-100 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white font-display">Drive File Explorer</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Select skin photos or clinical logs to import directly into SkinGPT.</p>
              </div>

              <div className="flex gap-1">
                {[
                  { id: 'all', label: 'All Files' },
                  { id: 'images', label: 'Photos Only' },
                  { id: 'pdfs', label: 'PDF Reports' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setFileTypeFilter(filter.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      fileTypeFilter === filter.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-brand-50/40 hover:bg-brand-50/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-550 dark:text-gray-400'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files in Google Drive..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-950 dark:text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={fetchDriveFiles}
                disabled={filesLoading}
                className="absolute right-3.5 top-2.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer disabled:opacity-40"
              >
                <RefreshCw className={`h-4 w-4 ${filesLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* File List Grid */}
            {filesLoading ? (
              <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
                <Loader2 className="h-7 w-7 text-indigo-600 animate-spin mb-3" />
                <p className="text-xs text-gray-400 dark:text-gray-550">Retrieving drive directories...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-brand-200 dark:border-slate-800 rounded-3xl min-h-[300px] flex flex-col justify-center items-center space-y-3">
                <FileText className="h-8 w-8 text-gray-350" />
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">No matching files found in your Google Drive.</p>
                <p className="text-[10px] text-gray-400 max-w-xs">Upload raw selfie images or clinical reports to your Google Drive to view them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredFiles.map(file => {
                  const isImage = file.mimeType.startsWith('image/');
                  const isPdf = file.mimeType === 'application/pdf';

                  return (
                    <div 
                      key={file.id} 
                      className={`p-4 border rounded-2xl bg-brand-50/5 hover:bg-brand-50/15 dark:bg-slate-900/40 dark:hover:bg-slate-900/95 transition-all flex flex-col justify-between space-y-4 ${
                        previewingFile?.id === file.id 
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                          : 'border-brand-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 bg-brand-100/50 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          {isImage && file.thumbnailLink ? (
                            <img src={file.thumbnailLink} alt={file.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : isImage ? (
                            <ImageIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          ) : isPdf ? (
                            <FileText className="h-5 w-5 text-rose-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-slate-500" />
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-950 dark:text-white truncate" title={file.name}>
                            {file.name}
                          </h4>
                          <span className="text-[10px] font-mono text-gray-450 uppercase block font-bold">
                            {isImage ? 'Image File' : isPdf ? 'Clinical PDF' : 'Document'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-brand-100/40 dark:border-slate-800/40">
                        {isImage && (
                          <button
                            onClick={() => handleImportImage(file)}
                            disabled={importingImage === file.id}
                            className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            {importingImage === file.id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3" />
                                Scan Image
                              </>
                            )}
                          </button>
                        )}

                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 border border-brand-200 dark:border-slate-700 hover:bg-brand-50 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                            title="Open in Drive"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
