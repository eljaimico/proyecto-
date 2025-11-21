// Tarea/controllers/taskController.js - CÓDIGO COMPLETO Y FINAL
const db = require('../models');
const Task = db.Task;
const { Op } = require('sequelize');
const streakController = require('./streakController'); // Lógica de racha

// Obtener ID del usuario desde el middleware auth
const getUserId = (req) => req.user.id;

// =======================================================
// GET /api/tasks - Obtener todas las tareas del usuario
// =======================================================
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { userId: getUserId(req) },
            order: [['createdAt', 'DESC']]
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// =======================================================
// GET /api/tasks/:id - Obtener tarea específica
// =======================================================
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: getUserId(req) }
        });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json(task);
    } catch (error) {
        console.error('Error al obtener tarea por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// =======================================================
// POST /api/tasks - Crear tarea nueva
// =======================================================
exports.createTask = async (req, res) => {
    const { title, description, dueDate, tag } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ message: 'El título es obligatorio' });
    }

    try {
        const newTask = await Task.create({
            title,
            description: description || null,
            dueDate: dueDate || null,
            tag: tag || null,
            userId: getUserId(req)
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// =======================================================
// PUT /api/tasks/:id - Actualizar tarea y marcar completado
// =======================================================
exports.updateTask = async (req, res) => {
    const { title, description, dueDate, tag, completed } = req.body;
    const taskId = req.params.id;

    try {
        const task = await Task.findOne({
            where: { id: taskId, userId: getUserId(req) }
        });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // ======== Actualización de completedAt ========
        let completedAt = task.completedAt;

        if (completed !== undefined) {
            const wasCompleted = task.completed;
            const isNowCompleted = completed;

            // Si se completa AHORA
            if (!wasCompleted && isNowCompleted) {
                completedAt = new Date();

                // Activar lógica de racha
                await streakController.checkAndAward(getUserId(req));
                console.log(`[Racha] Tarea completada. Chequeo para usuario ${getUserId(req)}`);

            } else if (wasCompleted && !isNowCompleted) {
                // Si se desmarca la tarea
                completedAt = null;
            }
        }

        // ======== Actualizar datos ========
        await Task.update(
            {
                title: title ?? task.title,
                description: description ?? task.description,
                dueDate: dueDate ?? task.dueDate,
                tag: tag ?? task.tag,
                completed: completed !== undefined ? completed : task.completed,
                completedAt
            },
            { where: { id: taskId, userId: getUserId(req) } }
        );

        const updatedTask = await Task.findByPk(taskId);
        res.json(updatedTask);

    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// =======================================================
// DELETE /api/tasks/:id - Eliminar tarea
// =======================================================
exports.deleteTask = async (req, res) => {
    try {
        const deletedRows = await Task.destroy({
            where: { id: req.params.id, userId: getUserId(req) }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
