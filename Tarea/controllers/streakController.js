// Tarea/controllers/streakController.js - CÓDIGO ACTUALIZADO Y FINAL
const db = require('../models');
const { Op } = require('sequelize');

// =======================================================
// LÓGICA INTERNA: CÁLCULO Y ASIGNACIÓN DE RACHA/LOGROS
// LLAMADO POR taskController.js
// =======================================================

/**
 * Revisa si el usuario ganó un logro o si debe continuar/reiniciar su racha.
 * Esta función es llamada desde taskController cuando se completa una tarea.
 * @param {number} userId - ID del usuario.
 */
exports.checkAndAward = async (userId) => {
    try {
        const user = await db.User.findByPk(userId);
        if (!user) return;

        // 1. Obtener/Crear registro de racha
        // Asumimos que el modelo Streak tiene campos: userId, daysConsecutive, maxDaysConsecutive, lastActivityDate
        let [streak, created] = await db.Streak.findOrCreate({
            where: { userId: userId },
            defaults: { userId: userId, daysConsecutive: 0, maxDaysConsecutive: 0, lastActivityDate: null },
        });
        
        // 2. Lógica de Racha
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        let shouldUpdateStreak = false;

        // Si la última actividad fue hoy, no actualizamos la racha pero continuamos el chequeo de logros.
        if (streak.lastActivityDate === today) {
            // No hacer nada a daysConsecutive
        } 
        // Si es la primera vez o la racha se rompió
        else if (!streak.lastActivityDate || streak.lastActivityDate < yesterday) {
            streak.daysConsecutive = 1;
            shouldUpdateStreak = true;
        } 
        // Si la racha continúa (última actividad fue ayer)
        else if (streak.lastActivityDate === yesterday) {
            streak.daysConsecutive += 1;
            shouldUpdateStreak = true;
        }

        if (shouldUpdateStreak) {
            streak.lastActivityDate = today;
            // Asegurar que el máximo se actualice
            streak.maxDaysConsecutive = Math.max(streak.maxDaysConsecutive, streak.daysConsecutive);
            await streak.save();
        }

        // --- Lógica de Logros (Chequeo) ---

        // 3. Logros basados en Tareas Completadas
        const totalCompleted = await db.Task.count({
            where: { userId: userId, completed: true }
        });

        // Buscar logros aplicables y que se hayan cumplido
        const taskAchievements = await db.Achievement.findAll({
             where: { 
                type: { [Op.in]: ['PrimerTarea', 'DiezTareas'] },
                target: { [Op.lte]: totalCompleted }
            }
        });
        
        for (const achievement of taskAchievements) {
            const hasAchievement = await user.hasAchievement(achievement);
            if (!hasAchievement) {
                await user.addAchievement(achievement);
                console.log(`Usuario ${userId} ganó el logro: ${achievement.type}`);
            }
        }

        // 4. Logro de Racha (Ej: Racha7Dias)
        const streakAchievement = await db.Achievement.findOne({ where: { type: 'Racha7Dias' } });
        if (streakAchievement && streak.daysConsecutive >= streakAchievement.target) {
            const hasStreakAchievement = await user.hasAchievement(streakAchievement);
            if (!hasStreakAchievement) {
                 await user.addAchievement(streakAchievement);
                 console.log(`Usuario ${userId} ganó el logro: ${streakAchievement.type}`);
            }
        }

    } catch (error) {
        console.error("Error en la lógica de logros/racha:", error);
    }
};


// =======================================================
// ENDPOINT: GET /api/tasks/streak (Llamado por el frontend)
// =======================================================
/**
 * Devuelve el estado actual de la racha al frontend (StreakDisplay.js).
 */
exports.getStreak = async (req, res) => {
    try {
        const streakInfo = await db.Streak.findOne({
            where: { userId: req.user.id },
        });

        if (!streakInfo) {
            // Devolver 0 si no hay registro
            return res.json({ currentStreak: 0, maxStreak: 0, lastActivityDate: null }); 
        }

        res.json({
            currentStreak: streakInfo.daysConsecutive,
            maxStreak: streakInfo.maxDaysConsecutive || streakInfo.daysConsecutive, // Usamos maxDaysConsecutive si existe
            lastActivityDate: streakInfo.lastActivityDate,
        });

    } catch (error) {
        console.error("Error al obtener racha:", error);
        res.status(500).json({ message: 'Error interno al consultar la racha.' });
    }
};
// La función exports.getAchievements fue eliminada, debe estar en achievementController.js