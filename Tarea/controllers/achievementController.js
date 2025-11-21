// Tarea/controllers/achievementController.js - CÓDIGO COMPLETO Y FINAL
const db = require('../models');
const Achievement = db.Achievement;
const UserAchievement = db.UserAchievement; // Asumimos esta es la tabla de unión

// =======================================================
// ENDPOINT: GET /api/achievements (Llamado por el frontend)
// =======================================================

/**
 * Obtiene todos los logros posibles y marca cuáles han sido desbloqueados por el usuario.
 * @param {object} req - Solicitud de Express (contiene req.user.id).
 * @param {object} res - Respuesta de Express.
 */
exports.getAchievements = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Obtener TODOS los logros posibles (bloqueados y desbloqueados)
        const allAchievements = await Achievement.findAll({
            // Excluimos la columna 'target' ya que es interna
            attributes: ['id', 'name', 'description', 'type'], 
            order: [['id', 'ASC']]
        });

        // 2. Obtener los IDs de los logros que el usuario ha desbloqueado
        const unlockedRecords = await UserAchievement.findAll({
            where: { userId: userId },
            attributes: ['achievementId'],
            raw: true,
        });

        // Convertir la lista de logros desbloqueados a un Set para una búsqueda rápida
        const unlockedIds = new Set(unlockedRecords.map(record => record.achievementId));
        
        // 3. Combinar las listas y añadir la propiedad 'unlocked'
        const achievementsList = allAchievements.map(achievement => ({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            type: achievement.type,
            // Determinar si el logro está desbloqueado
            unlocked: unlockedIds.has(achievement.id), 
        }));

        res.json(achievementsList);

    } catch (error) {
        console.error("Error al obtener logros:", error);
        res.status(500).json({ message: 'Error interno al consultar logros.' });
    }
};