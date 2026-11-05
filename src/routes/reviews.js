const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

class Review {
    constructor(comentario, calificacion, autor, fecha) {
        this.comentario = comentario;
        this.calificacion = calificacion;
        this.autor = autor;
        this.fecha = fecha;
    }
}

class CSVExporter {
    constructor(directoryPath) {
        this.directoryPath = directoryPath;
        this.ensureDirectoryExists();
    }

    ensureDirectoryExists() {
        if (!fs.existsSync(this.directoryPath)) {
            fs.mkdirSync(this.directoryPath, { recursive: true });
        }
    }

    escapeField(text) {
        if (text === null || text === undefined) return '';
        const stringified = String(text);
        if (stringified.includes('"') || stringified.includes(',') || stringified.includes('\n')) {
            return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
    }

    async exportReviews(id_pelicula, reviewsList) {
        const headers = ['Comentario', 'Calificación', 'Autor', 'Fecha'];
        
        const csvRows = reviewsList.map(review => {
            const formattedDate = review.fecha ? new Date(review.fecha).toISOString().split('T')[0] : '';
            return [
                this.escapeField(review.comentario),
                this.escapeField(review.calificacion),
                this.escapeField(review.autor),
                this.escapeField(formattedDate)
            ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const fileName = `reseñas_pelicula_${id_pelicula}_${Date.now()}.csv`;
        const filePath = path.join(this.directoryPath, fileName);

        await fs.promises.writeFile(filePath, csvContent, 'utf-8');
        return fileName;
    }
}

class MovieService {
    constructor(databaseConnection) {
        this.db = databaseConnection;
    }

    async checkMovieExists(id_pelicula) {
        const [rows] = await this.db.query(
            'SELECT id FROM peliculas WHERE id = ?', 
            [id_pelicula]
        );
        return rows.length > 0;
    }

    async getMovieReviews(id_pelicula) {
        const [rows] = await this.db.query(
            `SELECT comentario, calificacion, autor, fecha 
             FROM reseñas 
             WHERE id_pelicula = ? 
             ORDER BY fecha DESC`, 
            [id_pelicula]
        );
        
        return rows.map(row => new Review(row.comentario, row.calificacion, row.autor, row.fecha));
    }
}

const exportsDir = path.join(__dirname, '../../exports');
const exporter = new CSVExporter(exportsDir);
const movieService = new MovieService(db);

router.get('/movies/:id_pelicula/export-reviews', async (req, res) => {
    const { id_pelicula } = req.params;

    try {
        const movieExists = await movieService.checkMovieExists(id_pelicula);
        if (!movieExists) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'La película especificada no existe.' 
            });
        }

        const reviews = await movieService.getMovieReviews(id_pelicula);
        if (reviews.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Esta película no tiene reseñas registradas para exportar.' 
            });
        }

        const fileName = await exporter.exportReviews(id_pelicula, reviews);

        return res.status(200).json({
            status: 'success',
            message: 'Reseñas exportadas exitosamente al almacenamiento local del servidor.',
            data: {
                archivo: fileName,
                ruta_relativa: `/exports/${fileName}`,
                total_reseñas: reviews.length
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Ocurrió un error interno en el servidor.' 
        });
    }
});

module.exports = router;
