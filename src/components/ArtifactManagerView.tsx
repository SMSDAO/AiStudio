/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS V11.0.0 — Artifact Management & Storage Center
 * Full implementation of the 14 Persistent File Operations:
 * 1. CREATE  2. OPEN   3. PREVIEW  4. EDIT  5. SAVE  6. COPY  7. RENAME
 * 8. DELETE  9. DUPLICATE  10. MOVE  11. DOWNLOAD  12. RESTORE  13. COMPARE  14. EXPORT
 * Includes SHA-256 Checksums, Version History, and Audit Trail.
 */

import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  FileCode, 
  Plus, 
  Save, 
  Copy, 
  Download, 
  Trash2, 
  Edit3, 
  History, 
  GitCompare, 
  FolderInput, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Terminal,
  FileCheck2,
  Clock,
  Layers,
  Archive
} from 'lucide-react';
import { 
  artifactStorageService, 
  ManagedArtifact, 
  ArtifactAuditEntry, 
  DiffComparisonResult 
} from '../services/artifactStorageService';
import { FlashGlowCard } from './FlashGlowCard';

export const ArtifactManagerView: React.FC = () => {
  const [artifacts, setArtifacts] = useState<ManagedArtifact[]>(() => artifactStorageService.getAllArtifacts());
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(() => artifacts[0]?.id || '');
  const [activeFile, setActiveFile] = useState<ManagedArtifact | null>(() => artifacts[0] || null);
  
  // Editor State
  const [editorContent, setEditorContent] = useState<string>(activeFile?.content || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [auditLog, setAuditLog] = useState<ArtifactAuditEntry[]>(() => artifactStorageService.getAuditTrail());

  // Modals & Panels
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newFilePath, setNewFilePath] = useState<string>('/src/newComponent.tsx');
  const [newFileLang, setNewFileLang] = useState<ManagedArtifact['language']>('typescript');
  
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [renameTargetName, setRenameTargetName] = useState<string>('');

  const [showMoveModal, setShowMoveModal] = useState<boolean>(false);
  const [moveDirectory, setMoveDirectory] = useState<string>('/src/components');

  const [diffResult, setDiffResult] = useState<DiffComparisonResult | null>(null);
  const [showDiffModal, setShowDiffModal] = useState<boolean>(false);

  const refreshState = () => {
    const list = artifactStorageService.getAllArtifacts();
    setArtifacts(list);
    setAuditLog(artifactStorageService.getAuditTrail());
    if (selectedArtifactId) {
      const found = list.find((a) => a.id === selectedArtifactId) || list[0] || null;
      setActiveFile(found);
      if (found && !isEditing) {
        setEditorContent(found.content);
      }
    }
  };

  useEffect(() => {
    refreshState();
  }, [selectedArtifactId]);

  /* -------------------------------------------------------------------------- */
  /* OPERATION HANDLERS                                                         */
  /* -------------------------------------------------------------------------- */
  // 1. CREATE
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;
    const initialContent = `// Created via Master Gods Artifact Manager V11.0.0\nexport const placeholder = true;\n`;
    const created = artifactStorageService.createArtifact(newFilePath, initialContent, newFileLang);
    setShowCreateModal(false);
    setSelectedArtifactId(created.id);
    setActiveFile(created);
    setEditorContent(created.content);
    refreshState();
  };

  // 2. OPEN
  const handleOpen = (id: string) => {
    const file = artifactStorageService.openArtifact(id);
    if (file) {
      setSelectedArtifactId(file.id);
      setActiveFile(file);
      setEditorContent(file.content);
      setIsEditing(false);
      refreshState();
    }
  };

  // 4. EDIT & 5. SAVE
  const handleSave = () => {
    if (!activeFile) return;
    const updated = artifactStorageService.editArtifact(
      activeFile.id,
      editorContent,
      'gxqstudio@gmail.com',
      `Manual update to v${activeFile.currentVersion + 1}`
    );
    setActiveFile(updated);
    setIsEditing(false);
    refreshState();
  };

  // 6. COPY
  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 7. RENAME
  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFile || !renameTargetName.trim()) return;
    const renamed = artifactStorageService.renameArtifact(activeFile.id, renameTargetName.trim());
    setActiveFile(renamed);
    setShowRenameModal(false);
    refreshState();
  };

  // 8. DELETE
  const handleDelete = () => {
    if (!activeFile) return;
    if (window.confirm(`Are you sure you want to delete ${activeFile.path}?`)) {
      artifactStorageService.deleteArtifact(activeFile.id);
      setSelectedArtifactId(artifacts.filter((a) => a.id !== activeFile.id)[0]?.id || '');
      refreshState();
    }
  };

  // 9. DUPLICATE
  const handleDuplicate = () => {
    if (!activeFile) return;
    const copy = artifactStorageService.duplicateArtifact(activeFile.id);
    setSelectedArtifactId(copy.id);
    refreshState();
  };

  // 10. MOVE
  const handleMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFile || !moveDirectory.trim()) return;
    const moved = artifactStorageService.moveArtifact(activeFile.id, moveDirectory.trim());
    setActiveFile(moved);
    setShowMoveModal(false);
    refreshState();
  };

  // 11. DOWNLOAD
  const handleDownload = () => {
    if (!activeFile) return;
    const { filename, mimeType, content } = artifactStorageService.downloadArtifact(activeFile.id);
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 12. RESTORE
  const handleRestore = (versionNum: number) => {
    if (!activeFile) return;
    const restored = artifactStorageService.restoreVersion(activeFile.id, versionNum);
    setActiveFile(restored);
    setEditorContent(restored.content);
    refreshState();
  };

  // 13. COMPARE
  const handleCompare = (baseVer: number, targetVer: number) => {
    if (!activeFile) return;
    try {
      const res = artifactStorageService.compareVersions(activeFile.id, baseVer, targetVer);
      setDiffResult(res);
      setShowDiffModal(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 14. EXPORT
  const handleExportWorkspace = () => {
    const { totalFiles, totalSizeBytes, manifestJson } = artifactStorageService.exportWorkspaceManifest();
    const blob = new Blob([manifestJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master-gods-workspace-manifest-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert(`Exported manifest for ${totalFiles} files (${(totalSizeBytes / 1024).toFixed(1)} KB)`);
    refreshState();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <FlashGlowCard variant="cyan" intensity="medium" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                14 ARTIFACT OPERATIONS INTEGRATED
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                SHA-256 Immutable Audit Logs
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Enterprise Artifact & Asset Management
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Persistent version control, automated diff comparisons, SHA-256 file checksums, and export pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Artifact
            </button>
            <button
              onClick={handleExportWorkspace}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Archive className="w-4 h-4 text-cyan-400" />
              Export Manifest
            </button>
          </div>
        </div>
      </FlashGlowCard>

      {/* Main Workspace: File List + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Artifact File Tree */}
        <div className="space-y-4">
          <FlashGlowCard variant="cyan" intensity="subtle" className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                Active Artifacts ({artifacts.length})
              </span>
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {artifacts.map((art) => (
                <button
                  key={art.id}
                  onClick={() => handleOpen(art.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedArtifactId === art.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{art.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                    v{art.currentVersion}
                  </span>
                </button>
              ))}
            </div>
          </FlashGlowCard>
        </div>

        {/* Right: Active File Editor & Operations Bar */}
        <div className="lg:col-span-3 space-y-4">
          {activeFile ? (
            <div className="space-y-4">
              {/* Operations Toolbar (14 Operations) */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#0B1019] border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-cyan-400" />
                    {activeFile.path}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    v{activeFile.currentVersion}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                    SHA-256: {activeFile.checksumSha256.slice(0, 16)}...
                  </span>
                </div>

                {/* Operation Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isEditing ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Lock' : 'Edit'}</span>
                  </button>

                  {isEditing && (
                    <button
                      onClick={handleSave}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-emerald-950/40"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save (v{activeFile.currentVersion + 1})</span>
                    </button>
                  )}

                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setRenameTargetName(activeFile.name);
                      setShowRenameModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Rename
                  </button>

                  <button
                    onClick={handleDuplicate}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Duplicate
                  </button>

                  <button
                    onClick={() => {
                      setMoveDirectory(activeFile.directory);
                      setShowMoveModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <FolderInput className="w-3.5 h-3.5" />
                    Move
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>

                  {activeFile.versions.length > 1 && (
                    <button
                      onClick={() => handleCompare(1, activeFile.currentVersion)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-semibold flex items-center gap-1 border border-purple-500/40"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      Diff (v1 vs v{activeFile.currentVersion})
                    </button>
                  )}

                  <button
                    onClick={handleDelete}
                    className="px-2 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editor / Viewer Body */}
              <div className="bg-[#070A0F] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {isEditing ? (
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="w-full h-[450px] p-4 bg-transparent text-xs font-mono text-cyan-100 resize-none focus:outline-none leading-relaxed"
                  />
                ) : (
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[450px] leading-relaxed">
                    <code>{editorContent}</code>
                  </pre>
                )}
              </div>

              {/* Version History Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 flex items-center gap-1 font-semibold shrink-0">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  Version Timeline:
                </span>
                {activeFile.versions.map((ver) => (
                  <button
                    key={ver.versionNumber}
                    onClick={() => handleRestore(ver.versionNumber)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono shrink-0 transition-colors ${
                      ver.versionNumber === activeFile.currentVersion
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    v{ver.versionNumber} ({ver.changeSummary})
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">No artifact selected</div>
          )}
        </div>
      </div>

      {/* Audit Trail Section */}
      <FlashGlowCard variant="purple" intensity="subtle" className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Immutable Audit Trail & Checksum Verifications
          </h3>
          <span className="text-xs font-mono text-slate-400">Total Log Entries: {auditLog.length}</span>
        </div>

        <div className="bg-[#070A0F] border border-slate-800 rounded-xl overflow-x-auto max-h-60">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B1019] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">TIMESTAMP</th>
                <th className="p-2.5">OPERATION</th>
                <th className="p-2.5">OPERATOR</th>
                <th className="p-2.5">DETAIL</th>
                <th className="p-2.5">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLog.slice(0, 15).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="p-2.5 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-2.5 font-bold text-cyan-400">{log.operation}</td>
                  <td className="p-2.5 text-purple-300">{log.operator}</td>
                  <td className="p-2.5 text-slate-300">{log.detail}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FlashGlowCard>

      {/* Modal 1: Create Artifact */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-[#0B1019] border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Create New Artifact</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">File Absolute Path</label>
              <input
                type="text"
                value={newFilePath}
                onChange={(e) => setNewFilePath(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                placeholder="/src/services/myService.ts"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Language</label>
              <select
                value={newFileLang}
                onChange={(e) => setNewFileLang(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="typescript">TypeScript</option>
                <option value="solidity">Solidity</option>
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                Create File
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Rename */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleRename} className="w-full max-w-sm bg-[#0B1019] border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Rename Artifact</h3>
            <input
              type="text"
              value={renameTargetName}
              onChange={(e) => setRenameTargetName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                Apply Rename
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: Move */}
      {showMoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleMove} className="w-full max-w-sm bg-[#0B1019] border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Move to Directory</h3>
            <input
              type="text"
              value={moveDirectory}
              onChange={(e) => setMoveDirectory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowMoveModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                Move Artifact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 4: Version Diff Comparison */}
      {showDiffModal && diffResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0B1019] border border-purple-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-purple-400" />
                  Version Comparison (v{diffResult.baseVersion} vs v{diffResult.targetVersion})
                </h3>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Changes: <span className="text-emerald-400 font-bold">+{diffResult.lineChangesCount.added}</span>, <span className="text-red-400 font-bold">-{diffResult.lineChangesCount.removed}</span>, {diffResult.lineChangesCount.unchanged} unchanged
                </div>
              </div>
              <button
                onClick={() => setShowDiffModal(false)}
                className="px-3 py-1 bg-slate-800 text-xs text-slate-300 rounded hover:text-white"
              >
                Close
              </button>
            </div>
            <pre className="p-4 bg-[#070A0F] border border-slate-800 rounded-xl text-xs font-mono text-slate-300 max-h-[400px] overflow-auto leading-relaxed">
              <code>{diffResult.unifiedDiff}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
