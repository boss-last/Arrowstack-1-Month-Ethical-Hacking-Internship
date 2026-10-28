/**
 * Correctif Sécurisé : SEC-VULN-01 (Injection SQL)
 * Fichier cible : routes/search.ts
 */

import { Request, Response, NextFunction } from 'express';

// Définition de l'opérateur Sequelize
const Op = {
  or: Symbol('or'),
  like: Symbol('like'),
};

export const searchProductsSecure = function (models: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const criteria = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 200) : '';

      // Utilisation d'une requête paramétrée avec l'opérateur Op.like
      const products = await models.Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${criteria}%` } },
            { description: { [Op.like]: `%${criteria}%` } }
          ],
          deletedAt: null // Empêche l'affichage d'articles masqués ou supprimés
        },
        order: [['name', 'ASC']]
      });

      res.status(200).json({
        status: 'success',
        data: products
      });
    } catch (error) {
      next(error);
    }
  };
};
