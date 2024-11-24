export type TimeLog = {
  id: number;
  projectId: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  registerType: 'init' | 'end';
  init_id?: number;
};

export type ProjectActivity = {
  initLog: TimeLog;
  endLog?: TimeLog;
};
