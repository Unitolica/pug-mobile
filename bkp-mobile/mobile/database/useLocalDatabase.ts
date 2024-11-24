import { useSQLiteContext } from "expo-sqlite"
import { LocationObject } from "expo-location"

export function useLocalDatabase() {
  const database = useSQLiteContext()

  async function registerInitAction(projectId: string, location: LocationObject) {
    const now = new Date()
    const statement = await database.prepareAsync(
    `
      INSERT INTO hours_init
        (projectId, init, latitute, longiturde)
      VALUES
        ($projectId, $init, $latitute, $longitude)
    `);

    try {
      const result = await statement.executeAsync({
        $projectId: projectId,
        $init: now.toLocaleString(),
        $latitute: location.coords.latitude,
        $longitude: location.coords.longitude
      })

      const insertedRowId = result.lastInsertRowId.toLocaleString()

      return { id: insertedRowId }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function registerActionEnd(initId: number, location: LocationObject, description: string) {
    const now = new Date()
    const statement = await database.prepareAsync(
    `
      INSERT INTO hours_end
        (id, end, latitute, longitude, description)
      VALUES
        ($id ,$end, $latitute, $longitude, $description)
    `);

    try {
      const result = await statement.executeAsync({
        $id: initId,
        $end: now.toLocaleString(),
        $latitute: location.coords.latitude,
        $longitude: location.coords.longitude,
        $description: description
      })

      const insertedRowId = result.lastInsertRowId.toLocaleString()

      return { id: insertedRowId }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function getCurrentAction (projectId: string) {
    const statement = await database.prepareAsync(`
      SELECT id FROM hours_init
      WHERE projectId = $projectId
      AND id NOT IN (SELECT id FROM hours_end)
    `)

    try {
      const result = await statement.executeAsync({
        $projectId: projectId
      })
      return result.getFirstAsync()
    } catch (err) {
      console.error("error while getting current action", err)
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function getCurrentMonthTotalHours (projectId: string) {
    const statement = await database.prepareAsync(`
      SELECT SUM(strftime('%s', end) - strftime('%s', init)) as total_hours
      FROM hours_init
      JOIN hours_end ON hours_init.id = hours_end.id
      WHERE strftime('%m', init) = strftime('%m', 'now') AND hours_init.projectId = $projectId
    `)
    try {
      const result = await statement.executeAsync({
        $projectId: projectId
      })

      return result
    } catch (err) {
      console.error("error while getting current month total hours", err)
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function getHoursRegisters (projectId: string) {
    const statement = await database.prepareAsync(`
      SELECT * FROM hours_init
      JOIN hours_end ON hours_init.id = hours_end.id
      WHERE hours_init.projectId = $projectId
    `)

    try {
      const result = await statement.executeAsync({
        $projectId: projectId
      })
      return result.getAllAsync()
    } catch (err) {
      console.error("error while getting hours registers", err)
    } finally {
      await statement.finalizeAsync()
    }
  }

  return {
    registerInitAction,
    registerActionEnd,
    getCurrentAction,
    getCurrentMonthTotalHours,
    getHoursRegisters,
  }
}
