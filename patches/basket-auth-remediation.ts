/**
 * Correctif Sécurisé : SEC-VULN-02 (Contrôle d'accès brisé - IDOR)
 * Fichier cible : routes/basket.ts
 */

import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    bid: number; // Basket ID lié au token JWT validé
  };
}

export const getBasketSecure = function (models: any) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const requestedBasketId = parseInt(req.params.basketId, 10);
      const authenticatedUserBasketId = req.user?.bid;

      // Contrôle strict de possession côté serveur
      if (!req.user || isNaN(requestedBasketId) || requestedBasketId !== authenticatedUserBasketId) {
        return res.status(403).json({
          status: 'error',
          code: 'FORBIDDEN_RESOURCE_ACCESS',
          message: 'Accès non autorisé : Vous ne pouvez accéder qu’à votre propre panier.'
        });
      }

      const basket = await models.Basket.findOne({
        where: { id: requestedBasketId, UserId: req.user.id },
        include: [{ model: models.Product, paranoid: false }]
      });

      res.status(200).json({
        status: 'success',
        data: basket
      });
    } catch (error) {
      next(error);
    }
  };
};
