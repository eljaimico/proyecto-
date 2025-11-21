// Tarea/models/seedAchievements.js
module.exports = async (db) => {
    try {
        const Achievement = db.Achievement;

        const achievementsData = [
            { type: 'PrimerTarea', description: 'Completar tu primera tarea.', target: 1 },
            { type: 'DiezTareas', description: 'Completar 10 tareas.', target: 10 },
            { type: 'Racha7Dias', description: 'Mantener una racha de 7 días.', target: 7 },
        ];

        for (const data of achievementsData) {
            await Achievement.findOrCreate({
                where: { type: data.type },
                defaults: data,
            });
        }
        console.log('Logros iniciales verificados/creados.');

    } catch (error) {
        console.error('Error al inicializar logros:', error);
    }
};