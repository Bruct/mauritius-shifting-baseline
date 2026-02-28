'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Image, Mic, X, Upload, StopCircle } from 'lucide-react';
import type { WizardData } from '../SubmissionWizard';

interface Step5Props {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export function Step5Media({ data, onUpdate }: Step5Props) {
  const t = useTranslations('submission');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newMedia = files.map((file) => ({ file, type: 'photo' as const }));
    onUpdate({ media_files: [...data.media_files, ...newMedia] });
  };

  const removeFile = (index: number) => {
    onUpdate({ media_files: data.media_files.filter((_, i) => i !== index) });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        onUpdate({ media_files: [...data.media_files, { file, type: 'audio' }] });
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      alert('Microphone access denied. Please allow access to record audio.');
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const photos = data.media_files.filter((f) => f.type === 'photo');
  const audios = data.media_files.filter((f) => f.type === 'audio');

  return (
    <div className="space-y-6">
      <p className="text-sm text-ocean-600">{t('step5_desc')}</p>

      {/* Photos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ocean-800 flex items-center gap-1.5">
            <Image className="h-4 w-4" /> Photos
          </h3>
          <button
            onClick={() => photoInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ocean-50 hover:bg-ocean-100 text-ocean-700 text-xs font-medium rounded-lg transition-colors border border-ocean-200"
          >
            <Upload className="h-3.5 w-3.5" />
            {t('upload_photo')}
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((item, i) => {
              const idx = data.media_files.indexOf(item);
              return (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-ocean-50 border border-ocean-100">
                  <img
                    src={URL.createObjectURL(item.file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 h-5 w-5 bg-white/90 rounded-full flex items-center justify-center text-coral-500 hover:bg-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audio */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ocean-800 flex items-center gap-1.5">
            <Mic className="h-4 w-4" /> Audio Recording
          </h3>
        </div>

        {!recording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-coral-50 hover:bg-coral-100 text-coral-700 text-sm font-medium rounded-xl border border-coral-200 transition-colors"
          >
            <Mic className="h-4 w-4" />
            {t('record_audio')}
          </button>
        ) : (
          <div className="flex items-center gap-4 p-3 bg-coral-50 rounded-xl border border-coral-200">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-coral-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-coral-700">{formatTime(recordingTime)}</span>
            </div>
            <button
              onClick={stopRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-coral-500 text-white text-xs font-medium rounded-lg"
            >
              <StopCircle className="h-3.5 w-3.5" />
              Stop
            </button>
          </div>
        )}

        {audios.length > 0 && (
          <div className="mt-3 space-y-2">
            {audios.map((item, i) => {
              const idx = data.media_files.indexOf(item);
              return (
                <div key={i} className="flex items-center justify-between p-2.5 bg-ocean-50 rounded-lg border border-ocean-100">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-ocean-500" />
                    <span className="text-sm text-ocean-700">{item.file.name}</span>
                    <span className="text-xs text-ocean-400">
                      ({(item.file.size / 1024).toFixed(0)}KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="text-coral-400 hover:text-coral-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
