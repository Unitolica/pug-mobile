import db from './initDatabase';
import { TimeLog, ProjectActivity } from './types';

export class ActivityManager {
  static async getCurrentActivity(): Promise<ProjectActivity | null> {
    try {
      const initLogs = await db.getAllAsync<TimeLog>(`
        SELECT * FROM time_logs
        WHERE registerType = 'init'
        AND id NOT IN (
          SELECT DISTINCT init_id
          FROM time_logs
          WHERE registerType = 'end'
        )
        ORDER BY timestamp DESC
        LIMIT 1
      `);

      if (initLogs.length === 0) return null;

      const endLogs = await db.getAllAsync<TimeLog>(`
        SELECT * FROM time_logs
        WHERE registerType = 'end'
        AND init_id = ?
      `, [initLogs[0].id]);

      return {
        initLog: initLogs[0],
        endLog: endLogs[0] || undefined
      };
    } catch (error) {
      console.error('Error getting current activity:', error);
      return null;
    }
  }

  static async startActivity(projectId: string, location: { latitude: number; longitude: number }): Promise<boolean> {
    const statement = await db.prepareAsync(`
      INSERT INTO time_logs
        (projectId, timestamp, latitude, longitude, registerType)
      VALUES
        ($projectId, $now, $lat, $long, $type)
    `)
    try {
      const currentActivity = await this.getCurrentActivity();
      if (currentActivity) {
        throw new Error('Cannot start new activity while another is in progress');
      }

      await statement.executeAsync({
        $projectId: projectId,
        $now: Date.now(),
        $lat: location.latitude,
        $long: location.longitude,
        $type: 'init'
      });

      return true;
    } catch (error) {
      console.error('Error starting activity:', error);
      return false;
    } finally {
      await statement.finalizeAsync()
    }
  }

  static async endActivity(location: { latitude: number; longitude: number }): Promise<{
    success: boolean;
    data?: {
      init: {
        timestamp: number;
        location: { latitude: number; longitude: number };
      };
      end: {
        timestamp: number;
        location: { latitude: number; longitude: number };
      };
    };
  }> {
    const statement = await db.prepareAsync(`
      INSERT INTO time_logs
        (projectId, timestamp, latitude, longitude, registerType, init_id)
      VALUES
        ($projectId, $now, $lat, $long, $type, $initId)
    `);
  
    try {
      const currentActivity = await this.getCurrentActivity();
      if (!currentActivity) {
        throw new Error('No activity to end');
      }
  
      const now = Date.now();
  
      await statement.executeAsync({
        $projectId: currentActivity.initLog.projectId,
        $now: now,
        $lat: location.latitude,
        $long: location.longitude,
        $type: 'end',
        $initId: currentActivity.initLog.id
      });
  
      return {
        success: true,
        data: {
          init: {
            timestamp: currentActivity.initLog.timestamp,
            location: {
              latitude: currentActivity.initLog.latitude,
              longitude: currentActivity.initLog.longitude
            }
          },
          end: {
            timestamp: now,
            location: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          },
        }
      };
    } catch (error) {
      console.error('Error ending activity:', error);
      return { success: false };
    } finally {
      await statement.finalizeAsync();
    }
  }
  
}
